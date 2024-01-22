import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import io from 'socket.io-client';
import { createContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import './PlayOnline.css';
import DialogEndGame from '../../../dialogEndGame/DialogEndGame';
import DialogMessages from '../../../dialogMessages/DialogMessages';
import TimeOptions from '../../../rightSideController/timeOptions/TimeOptions';
import Sidebar from '../../../sidebar/Sidebar';
import HistoriesAndChats from '../../../rightSideController/HistoriesAndChats/HistoriesAndChats';
import PlayersSection from '../../../players/PlayersSection';
import { createAxios } from '../../redux/createInstance';
import { addNewGame } from '../../redux/apiRequest';
import { loginSuccess } from '../../redux/authSlice';
import IPAddress from '../../../../IPAddress';

const socket = io.connect(`http://${IPAddress}:3001`);

export const HistoriesContext = createContext();
export const InforOfRoomContext = createContext();

function PlayOnline() {
  const [game, setGame] = useState(new Chess());
  const [moveFrom, setMoveFrom] = useState('');
  const [moveTo, setMoveTo] = useState(null);
  // const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const [optionSquares, setOptionSquares] = useState({});
  const [isStartGame, setIsStartGame] = useState(false);
  const [isOccurring, setIsOccurring] = useState(false);
  const [isEndGame, setEndGame] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [roomID, setRoomID] = useState('');
  const [inforOfRoom, setInforOfRoom] = useState({});
  const [orderOfPlayer, setOrderOfPlayer] = useState('');
  const [pieceType, setPieceType] = useState('white');
  const [isMyTurn, setIsMyTurn] = useState(true);
  const [showMessages, setShowMessages] = useState(null);
  const [controllerSide, setControllerSide] = useState(null);
  const [histories, setHistories] = useState([]);
  const [minutesOpp, setMinutesOpp] = useState(0);
  const [secondsOpp, setSecondsOpp] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [messages, setMessages] = useState([]);

  const user = useSelector((state) => state.auth.login?.currentUser);
  const dispath = useDispatch();
  const navigate = useNavigate();
  const axiosJWT = createAxios(user, dispath, loginSuccess);

  useEffect(() => {
    if (!user) navigate('/login');
    setControllerSide(<TimeOptions playingOptions={playingOptions} />);
    // setControllerSide(<HistoriesAndChats />);
  }, []);

  useEffect(() => {
    if (user) {
      const data = {
        userID: user._id,
        page: 'play online',
      };
      // check the current state of players when they reconnecting
      socket.emit('handleCurrentState', data);
    }
  }, [user]);

  useEffect(() => {
    if (Object.keys(inforOfRoom).length > 0) {
      const remaindTime = {
        minutes: minutes,
        seconds: seconds,
      };
      const remaindTimeOpp = {
        minutes: minutesOpp,
        seconds: secondsOpp,
      };
      const newInforOfRoom = { ...inforOfRoom };

      if (orderOfPlayer === 'player1') {
        newInforOfRoom[orderOfPlayer].remaindTime = remaindTime;
        newInforOfRoom['player2'].remaindTime = remaindTimeOpp;
      } else if (orderOfPlayer === 'player2') {
        newInforOfRoom[orderOfPlayer].remaindTime = remaindTime;
        newInforOfRoom['player1'].remaindTime = remaindTimeOpp;
      }

      setInforOfRoom(newInforOfRoom);
    }
  }, [minutes, seconds, minutesOpp, secondsOpp]);

  useEffect(() => {
    // on start game
    socket.on('startGame', () => {
      setControllerSide(<HistoriesAndChats />);
      setIsStartGame(true);
      setIsOccurring(true);
      setShowMessages(null);
    });
    // on receive status
    socket.on('status', (data) => {
      const infor = {
        messages: data,
        inforButton: {
          animation: 'loading',
          buttonCancel: {
            name: 'Cancel',
            option: 'cancelInvite',
            background: 'green',
          },
        },
      };
      // setShowMessages(preValue => ({...preValue, messages, infor}))
      setShowMessages(infor);
    });
    // Handle when player reconnect
    socket.on('onReconnect', (data) => {
      // console.log('data: ', data);
      const player = getPlayer(data.inforOfRoom, 'id', user?._id);
      const promise = new Promise(function (resolve) {
        resolve();
      });
      promise
        .then(() => setIsStartGame(true))
        .then(() => setIsOccurring(true))
        .then(() => setRoomID(data.inforOfRoom.roomID))
        .then(() => setPieceType(data.pieceType))
        .then(() => setIsMyTurn(data.isMyTurn))
        .then(() => setInforOfRoom(data.inforOfRoom))
        .then(() => setOrderOfPlayer(player))
        .then(() => setControllerSide(<HistoriesAndChats />))
        // .then(() => setHistories(data.histories))
        .then(() => {
          const gameCopy = { ...game };
          gameCopy.load(data.position);
          setGame(gameCopy);
        });
    });
    // get player's room information
    socket.on('inforOfRoom', (data) => {
      // console.log('inforOfRoom', data);
      setInforOfRoom(data);
      setRoomID(data.roomID);

      const player = getPlayer(data, 'id', user?._id);
      setOrderOfPlayer(player);
      setPieceType(data[player].pieceType);
      setIsMyTurn(data[player].isMyTurn);
    });
    // on move piece
    socket.on('movePiece', (data) => {
      // console.log(data);
      movePiece(data);
      setHistories((preValue) => [...preValue, data.history]);
    });
    // when end game
    socket.on('endGame', (data) => {
      // console.log('endGame',data);
      setEndGame(true);
      setInforOfRoom(data);
      setIsStartGame(false);
    });
    // when restart a new game
    socket.on('resetGame', (data) => {
      setEndGame(false);
      // set information for dialog messages when player received the invitaion of reset game
      const infor = {
        messages: `${data.name} Want To Play Again With You`,
        inforButton: {
          buttonCancel: {
            name: 'Cancel',
            option: 'cancelInvite',
            background: 'dark',
          },
          buttonAccept: {
            name: 'Yes',
            option: 'acceptInviteRematch',
            background: 'green',
          },
        },
      };
      setShowMessages(infor);
    });
    // when received an draw invitaion
    socket.on('offerDrawGame', (data) => {
      // set information for dialog messages when player received the invitaion of reset game
      const infor = {
        messages: `${data.username} offer a draw with you`,
        inforButton: {
          buttonCancel: {
            name: 'Cancel',
            option: 'cancelInvite',
            background: 'dark',
          },
          buttonAccept: {
            name: 'Yes',
            option: 'acceptInviteDraw',
            background: 'green',
          },
        },
      };
      setShowMessages(infor);
    });
    // handle when opponent accept the invite playing again
    socket.on('handleResetGame', (data) => {
      // console.log('handleResetGame: ', data);
      reset();
      setEndGame(false);
      setPieceType((currentPiceType) => {
        let type;
        if (currentPiceType === 'white') {
          setIsMyTurn(false);
          type = 'black';
        } else {
          setIsMyTurn(true);
          type = 'white';
        }
        return type;
      });
      setHistories([]);
      setShowMessages(null);
      setInforOfRoom(data);
      setIsStartGame(true);
      setIsWaiting(false);
    });
    // handle when opponent accept the invite draw
    socket.on('handleDrawGame', () => {
      setIsWaiting(false);
      setShowMessages(null);
      setHistories([]);
    });
    // when required get player's information
    socket.on('getPlayerInfor', () => {
      let playerPieceType, isPlayerTurn, inforOfRoom;
      let histories;

      setPieceType((preValue) => {
        playerPieceType = preValue;
        return preValue;
      });
      setIsMyTurn((preValue) => {
        isPlayerTurn = preValue;
        return preValue;
      });
      setInforOfRoom((preValue) => {
        inforOfRoom = preValue;
        return preValue;
      });
      // setHistories((preValue) => {
      //   histories = preValue;
      //   return preValue;
      // });

      const gameState = {
        position: game.fen(),
        pieceType: playerPieceType,
        isMyTurn: isPlayerTurn,
        inforOfRoom,
        // histories,
      };
      socket.emit('playerInfor', gameState);
    });
    // when opponent want to cacel the invitation
    socket.on('cancelInvite', () => {
      setIsWaiting(false);
      // set information for dialog messages when oppent denied the invitaion
      const infor = {
        messages: 'Opponent denied your invitation',
        inforButton: {
          buttonCancel: {
            name: 'Cancel',
            option: '',
            background: 'green',
          },
        },
      };
      setShowMessages(infor);
    });
    // show message onto the chat box
    socket.on('sendMessage', (message) => {
      setMessages((preValue) => [...preValue, message]);
    });
  }, [socket]);

  useEffect(() => {
    // when user reconnect, we set previous game state for player,
    // if game is over then show dialog end game.
    if (checkEndGame()) setEndGame(true);
  }, [game]);

  function safeGameMutate(modify) {
    setGame((g) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }

  function checkEndGame() {
    const possibleMoves = game.moves();
    // exit if the game is over
    if (game.game_over() || game.in_draw() || possibleMoves.length === 0)
      return true;
    return false;
  }

  function handleEndGame(option = null) {
    setIsStartGame(false);

    let newInforOfRoom;
    newInforOfRoom = { ...inforOfRoom };
    // update state
    newInforOfRoom.state = 'finish';

    // add new property - pieceTypeWin
    if (option === 'draw') newInforOfRoom.pieceTypeWon = 'draw game';
    else {
      let playerWon, opponent;
      if (option === 'offerResign' || option === 'offerAbort') {
        let pieceTypeWon = pieceType === 'white' ? 'black' : 'white';
        newInforOfRoom.pieceTypeWon = pieceTypeWon;
        playerWon = getPlayer(inforOfRoom, 'pieceType', pieceTypeWon);
      } else {
        newInforOfRoom.pieceTypeWon = pieceType;
        playerWon = getPlayer(inforOfRoom, 'pieceType', pieceType);
      }
      // add property "isWon" for player who won the game
      if (playerWon === 'player1') opponent = 'player2';
      else opponent = 'player1';
      inforOfRoom[playerWon].isWon = true;
      inforOfRoom[opponent].isWon = false;
    }

    // insert infor of game into database
    addNewGameToDB(newInforOfRoom);

    setInforOfRoom(newInforOfRoom);
    // console.log('newInforOfRoom: ', newInforOfRoom);
    socket.emit('endGame', newInforOfRoom);
    setEndGame(true);
    return;
  }

  function addNewGameToDB(inforOfRoom) {
    const game = {
      player1: {
        username: inforOfRoom['player1']['name'],
        pieceType: inforOfRoom['player1']['pieceType'],
      },
      player2: {
        username: inforOfRoom['player2']['name'],
        pieceType: inforOfRoom['player2']['pieceType'],
      },
      wonPlayer: inforOfRoom['pieceTypeWon'],
      moves: histories?.length,
      date: getCurrentDate(),
      history: histories,
    };
    // console.log(game);
    // addNewGame(game, user, user?.accessToken, dispath, axiosJWT);
    addNewGame(game, dispath);
  }

  function getCurrentDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    const formattedToday = dd + '/' + mm + '/' + yyyy;
    return formattedToday;
  }

  function getMoveOptions(square) {
    // get all possible moves
    const moves = game.moves({
      square,
      verbose: true,
    });

    // if the square is empty or the piece on square is protecing the king -> no possible moves
    if (moves.length === 0) {
      let optionSquares = {};

      // if square contains piece (but hasn't possible moves) then still set this square's background to yellow
      if (game.get(square)) {
        optionSquares = {
          [square]: {
            background: 'rgba(255, 255, 0, 0.4)',
          },
        };
      }
      setOptionSquares(optionSquares);
      return false;
    }

    const newSquares = {};
    moves.map((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to) &&
          game.get(move.to).color !== game.get(square).color
            ? 'radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)'
            : 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
        borderRadius: '50%',
      };
      return move;
    });
    newSquares[square] = {
      background: 'rgba(255, 255, 0, 0.4)',
    };
    setOptionSquares(newSquares);
    return true;
  }

  function onSquareClick(square) {
    // if not player's turn then they cannot click on any piece
    if (!isMyTurn) return;

    const squareObject = game.get(square);
    // if this square contain a piece
    if (squareObject) {
      const pieceColor = squareObject.color;
      // prevent player from click on piece's opponent
      // howerver, when you want to attack to piece's opponent that is valid
      if (
        (pieceColor === 'b' && pieceType === 'white') ||
        (pieceColor === 'w' && pieceType === 'black')
      ) {
        // check if the player want to attack to piece's opponent, this is valid
        let inValidMove = true;
        for (const opSquare in optionSquares) {
          if (square === opSquare) {
            inValidMove = false;
            break;
          }
        }
        if (inValidMove) return;
      }
    }

    // from square
    if (!moveFrom) {
      const hasMoveOptions = getMoveOptions(square);
      if (hasMoveOptions) setMoveFrom(square);
      return;
    }

    // to square
    if (!moveTo) {
      // check if valid move before showing dialog
      const moves = game.moves({
        moveFrom,
        verbose: true,
      });
      // console.log(moves);
      const foundMove = moves.find(
        (m) => m.from === moveFrom && m.to === square
      );
      // not a valid move
      if (!foundMove) {
        // check if clicked on new piece
        const hasMoveOptions = getMoveOptions(square);
        // if new piece, setMoveFrom, otherwise clear moveFrom
        setMoveFrom(hasMoveOptions ? square : '');
        return;
      }

      // valid move
      setMoveTo(square);

      // if promotion move
      if (
        (foundMove.color === 'w' &&
          foundMove.piece === 'p' &&
          square[1] === '8') ||
        (foundMove.color === 'b' &&
          foundMove.piece === 'p' &&
          square[1] === '1')
      ) {
        // setShowPromotionDialog(true);
        return;
      }

      // is normal move
      const gameCopy = { ...game };

      const move = gameCopy.move({
        from: moveFrom,
        to: square,
        promotion: 'q',
      });

      if (checkEndGame()) handleEndGame();

      // if invalid, setMoveFrom and getMoveOptions
      if (move === null) {
        const hasMoveOptions = getMoveOptions(square);
        if (hasMoveOptions) setMoveFrom(square);
        return;
      }

      // get histories
      const history = gameCopy.history({ verbose: true });
      setHistories((preValue) => [...preValue, history]);

      // update chessboard state after player's move
      let updateMovePiece = {
        roomID: roomID,
        fen: game.fen(),
        nextTurn: pieceType === 'white' && isMyTurn ? 'black' : 'white',
        history,
      };

      movePiece(updateMovePiece);

      socket.emit('movePiece', updateMovePiece);

      setGame(gameCopy);

      // setTimeout(makeRandomMove, 300);
      setMoveFrom('');
      setMoveTo(null);
      setOptionSquares({});

      return;
    }
  }

  // function onPromotionPieceSelect(piece) {
  //   // if no piece passed then user has cancelled dialog, don't make move and reset
  //   if (piece) {
  //     const gameCopy = { ...game };
  //     gameCopy.move({
  //       from: moveFrom,
  //       to: moveTo,
  //       promotion: piece[1].toLowerCase() ?? 'q',
  //     });
  //     setGame(gameCopy);
  //     setTimeout(makeRandomMove, 300);
  //   }

  //   setMoveFrom('');
  //   setMoveTo(null);
  //   // setShowPromotionDialog(false);
  //   setOptionSquares({});
  //   return true;
  // }

  function reset() {
    setEndGame(false);
    safeGameMutate((game) => {
      game.reset();
    });
    setOptionSquares({});
  }

  function movePiece(data) {
    const gameCopy = { ...game };
    gameCopy.load(data.fen);
    setGame(gameCopy);
    setPieceType((pieceType) => {
      setIsMyTurn(data.nextTurn === pieceType ? true : false);
      return pieceType;
    });
  }

  function getPlayer(source, attribute, value) {
    return source?.player1?.[attribute] === value ? 'player1' : 'player2';
  }

  function playingOptions(option) {
    if (option === 'playOnline') {
      socket.emit(option, user);
    }
  }

  function handleOptions(option) {
    // console.log(option);
    switch (option) {
      // accept invite rematch game
      case 'acceptInviteRematch':
        reset();
        setEndGame(false);
        setPieceType((currentPiceType) => {
          let type;
          if (currentPiceType === 'white') {
            setIsMyTurn(false);
            type = 'black';
          } else {
            setIsMyTurn(true);
            type = 'white';
          }
          return type;
        });
        setHistories([]);
        setShowMessages(null);
        // reset timer for player
        const remaindTime = {
          minutes: 10,
          seconds: 0,
        };
        const newInforOfRoom = { ...inforOfRoom };
        newInforOfRoom['player1'].remaindTime = remaindTime;
        newInforOfRoom['player2'].remaindTime = remaindTime;
        // console.log(newInforOfRoom);
        setInforOfRoom(newInforOfRoom);
        setIsStartGame(true);
        socket.emit('handleResetGame', newInforOfRoom);
        break;

      // accept invite draw
      case 'acceptInviteDraw':
        handleEndGame('draw');
        socket.emit('handleDrawGame', roomID);
        break;

      // hide the dialog end game
      case 'hideDialog':
        setEndGame(false);
        break;

      // start a new game
      case 'newGame':
        reset();
        setEndGame(false);
        setIsWaiting(false);
        setShowMessages(null);
        setIsOccurring(false);
        setHistories([]);
        setControllerSide(<TimeOptions playingOptions={playingOptions} />);
        socket.emit('playOnline', user);
        break;

      // review the game
      case 'gameReview':
        break;

      // when user want to play again
      case 'rematchGame':
        // player has to wait for reply from another one
        setEndGame(false);

        // set information for dialog message when player wanna reset game
        const infor = {
          messages: 'Waiting For Opponent Reply',
          inforButton: {
            animation: 'loading',
            buttonCancel: {
              name: 'Cancel',
              option: 'cancelInviteFromSender',
              background: 'green',
            },
          },
        };
        // setShowMessages(preValue => ({...preValue, messages, infor}))
        setShowMessages(infor);

        // get roomID and name of inviting player
        let inforOfPlayer = {
          roomID,
          name: user?.username,
        };

        setIsWaiting(true);
        // console.log("inforOfPlayer: ", inforOfPlayer);
        socket.emit('resetGame', inforOfPlayer);
        break;

      // when opponent denied the invitaion
      case 'cancelInvite':
        socket.emit('cancelInvite', inforOfRoom.roomID);
        setShowMessages(null);
        break;

      default:
        setShowMessages(null);
        break;
    }
    // setShowMessages(null);
  }

  function getTimer(timer) {
    // console.log(timer);
    setMinutes(timer.minutes);
    setSeconds(timer.seconds);
    setMinutesOpp(timer.minutesOpp);
    setSecondsOpp(timer.secondsOpp);
  }

  function handleFinishGame(options, value = null) {
    // console.log(options);
    if (options === 'offerDraw') {
      setIsWaiting(true);

      // set information for dialog message when player want to offer a draw
      const infor = {
        messages: 'Waiting For Opponent Reply',
        inforButton: {
          animation: 'loading',
          buttonCancel: {
            name: 'Cancel',
            option: 'cancelInvite',
            background: 'green',
          },
        },
      };
      setShowMessages(infor);

      const data = {
        roomID,
        username: user?.username,
      };
      socket.emit('offerDrawGame', data);
    } else if (options === 'sendMessage') {
      // console.log(value);
      const data = {
        roomID,
        message: value,
      };
      socket.emit('sendMessage', data);
    } else {
      handleEndGame(options);
      socket.emit('handleDrawGame', roomID);
    }
  }

  return (
    <div className="container">
      <Sidebar />

      <div className="main_container">
        <div className="chessboard">
          <Chessboard
            id="ClickToMove"
            position={game.fen()}
            boardOrientation={pieceType}
            animationDuration={200}
            arePiecesDraggable={false}
            customBoardStyle={{
              borderRadius: '4px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
            }}
            customDarkSquareStyle={{ backgroundColor: '#779952' }}
            customLightSquareStyle={{ backgroundColor: '#edeed1' }}
            customSquareStyles={{
              ...optionSquares,
            }}
            onSquareClick={isStartGame && onSquareClick}
            // onPromotionPieceSelect={onPromotionPieceSelect}
            // promotionToSquare={moveTo}
            // showPromotionDialog={showPromotionDialog}
          />

          {/* show dialog end game */}
          {isEndGame && (
            <DialogEndGame
              inforOfRoom={inforOfRoom}
              handleOptions={handleOptions}
            />
          )}

          {/* show dialog waiting for reply */}
          {isWaiting && (
            <DialogMessages
              messages={showMessages && showMessages.messages}
              infor={showMessages && showMessages.inforButton}
              handleOptions={handleOptions}
            />
          )}

          {/* show dialog invite */}
          {showMessages && (
            <DialogMessages
              messages={showMessages && showMessages.messages}
              infor={showMessages && showMessages.inforButton}
              handleOptions={handleOptions}
            />
          )}
        </div>

        {/* section for show players */}
        <InforOfRoomContext.Provider
          value={{ inforOfRoom, orderOfPlayer, isMyTurn, isStartGame }}
        >
          {isOccurring && <PlayersSection getTimer={getTimer} />}
        </InforOfRoomContext.Provider>

        {/* section for controller */}
        <div className="controller_side">
          <HistoriesContext.Provider
            value={{ histories, messages, handleFinishGame }}
          >
            {controllerSide && controllerSide}
          </HistoriesContext.Provider>
        </div>
      </div>
    </div>
  );
}

export default PlayOnline;
