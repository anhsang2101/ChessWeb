import { createContext, useEffect, useRef, useState } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import io from 'socket.io-client';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faHandshake, faStar } from '@fortawesome/free-regular-svg-icons';
// import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';

import './PlayOnline.css';
import DialogEndGame from '../../dialogEndGame/DialogEndGame';
import DialogMessages from '../../dialogMessages/DialogMessages';
// import logo from '../../../images/chess-game-logo.png';
import TimeOptions from '../../rightSideController/timeOptions/TimeOptions';
import Sidebar from '../../sidebar/Sidebar';
// import BoardForPlay from '../../boards/BoardForPlay';
// import BoardDefault from '../../boards/BoardDefault';
import HistoriesAndChats from '../../rightSideController/HistoriesAndChats/HistoriesAndChats';

const socket = io.connect('http://localhost:3001');

let inforOfRoomCopy = {};

export const HistoriesContext = createContext();

function PlayOnline() {
  const [game, setGame] = useState(new Chess());
  const [moveFrom, setMoveFrom] = useState('');
  const [moveTo, setMoveTo] = useState(null);
  // const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const [optionSquares, setOptionSquares] = useState({});
  const [isStartGame, setIsStartGame] = useState(false);
  const [isEndGame, setEndGame] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [roomID, setRoomID] = useState('');
  const [inforOfRoom, setInforOfRoom] = useState({});
  const [pieceType, setPieceType] = useState('white');
  const [isMyTurn, setIsMyTurn] = useState(true);
  const [showMessages, setShowMessages] = useState(null);
  const [controllerSide, setControllerSide] = useState(null);
  const [histories, setHistories] = useState([]);



  useEffect(() => {
    setControllerSide(<TimeOptions playingOptions={playingOptions} />);
  }, []);

  useEffect(() => {
    // on start game
    socket.on('startGame', () => {
      setControllerSide(<HistoriesAndChats />);
      setIsStartGame(true);
      alert('start game');
    });
    // on receive status
    socket.on('status', (data) => {
      alert(data);
    });
    // Handle when player reconnect
    socket.on('onReconnect', (data) => {
      // console.log('new socket: ', socket.id);
      const promise = new Promise(function (resolve) {
        resolve();
      });
      promise
        .then(() => setRoomID(data.roomID))
        .then(() => setPieceType(data.pieceType))
        .then(() => setIsMyTurn(data.isMyTurn))
        .then(() => setInforOfRoom(data.inforOfRoom))
        .then(() => {
          const gameCopy = { ...game };
          gameCopy.load(data.position);
          setGame(gameCopy);
        });
    });
    // get player's room information
    socket.on('inforOfRoom', (data) => {
      // console.log("inforOfRoom", data);
      setInforOfRoom(data);
      setRoomID(data.roomID);

      const player = getPlayer(data, 'socketId', socket.id);
      setPieceType(data[player].pieceType);
      setIsMyTurn(data[player].isMyTurn);
    });
    // on move piece
    socket.on('movePiece', (data) => {
      movePiece(data);
      setHistories(preValue => ([...preValue, data.history]));
    });
    // when end game
    socket.on('endGame', (data) => {
      setEndGame(true);
      setInforOfRoom(data);
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
            option: 'cancelInviteFromReceiver',
            background: 'dark',
          },
          buttonAccept: {
            name: 'Yes',
            option: 'acceptInvite',
            background: 'green',
          },
        },
      };
      setShowMessages(infor);
    });
    // handle when opponent accept the invite playing again
    socket.on('handleResetGame', () => {
      // console.log('handleResetGame: co vao');
      setPieceType((currentPiceType) =>
        currentPiceType === 'white' ? 'black' : 'white'
      );
      reset();
      setIsWaiting(false);
      setShowMessages(null);
    });
    // when required get player's information
    socket.on('getPlayerInfor', () => {
      // console.log("socketId: ",socket.id);
      let roomID, playerPieceType, isPlayerTurn, inforOfRoom;

      setRoomID((preValue) => {
        roomID = preValue;
        return preValue;
      });
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

      const gameState = {
        roomID: roomID,
        position: game.fen(),
        pieceType: playerPieceType,
        isMyTurn: isPlayerTurn,
        inforOfRoom,
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
  }, [socket]);

  useEffect(() => {
    setInforOfRoom((preValue) => {
      inforOfRoomCopy = { ...preValue };
      // console.log('inforOfRoomCopy:  ', inforOfRoomCopy);
      return preValue;
    });
  }, [inforOfRoom]);

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

  function handleEndGame() {
    setEndGame(true);

    let newInforOfRoom;
    newInforOfRoom = { ...inforOfRoom };
    // add new property - pieceTypeWin
    newInforOfRoom.pieceTypeWon = pieceType;
    // add property "isWon" for player who won the game
    const playerWon = getPlayer(inforOfRoom, 'pieceType', pieceType);
    inforOfRoom[playerWon].isWon = true;

    setInforOfRoom(newInforOfRoom);
    // console.log('newInforOfRoom: ', newInforOfRoom);
    socket.emit('endGame', newInforOfRoom);
    return;
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
        (foundMove.color === "w" &&
          foundMove.piece === "p" &&
          square[1] === "8") ||
        (foundMove.color === "b" &&
          foundMove.piece === "p" &&
          square[1] === "1")
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
      setHistories(preValue => ([...preValue, history]));

      // update chessboard state after player's move
      let movePiece = {
        roomID: roomID,
        fen: game.fen(),
        nextTurn: pieceType === 'white' && isMyTurn ? 'black' : 'white',
        history
      };
      socket.emit('movePiece', movePiece);

      setGame(gameCopy);

      // setTimeout(makeRandomMove, 300);
      setMoveFrom('');
      setMoveTo(null);
      setOptionSquares({});

      return;
    }
  }

  // function makeRandomMove() {
  //   const possibleMoves = game.moves();

  //   // exit if the game is over
  //   if (game.game_over() || game.in_draw() || possibleMoves.length === 0)
  //     return;

  //   const randomIndex = Math.floor(Math.random() * possibleMoves.length);
  //   safeGameMutate((game) => {
  //     game.move(possibleMoves[randomIndex]);
  //   });
  // }

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
    return source.player1[attribute] === value ? 'player1' : 'player2';
  }

  function playingOptions(option) {
    if (option === 'playOnline') {
      socket.emit(option);
    }
  }

  function handleOptions(option) {
    if (option === 'acceptInvite') {
      reset();
      setPieceType((currentPiceType) =>
        currentPiceType === 'white' ? 'black' : 'white'
      );
      socket.emit('handleResetGame', inforOfRoom.roomID);
    } else if (option === 'cancelInviteFromReceiver') {
      socket.emit('cancelInvite', inforOfRoom.roomID);
    }
    // hidden the dialog messages
    setShowMessages(null);
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
              inforOfRoom={inforOfRoomCopy}
              hideDialog={() => setEndGame(false)}
              playAgain={() => {
                // player has to wait for reply from another one
                setEndGame(false);
                setIsWaiting(true);

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
                };
                const socketId1 = inforOfRoom?.player1?.socketId;
                inforOfPlayer.name =
                  socket.id === socketId1
                    ? inforOfRoom?.player1?.name
                    : inforOfRoom?.player2?.name;

                // console.log("inforOfPlayer: ", inforOfPlayer);
                socket.emit('resetGame', inforOfPlayer);
              }}
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

        <div className="controller_side">
          <HistoriesContext.Provider value={histories}>
            {(controllerSide) && controllerSide}
          </HistoriesContext.Provider>
       </div>
      </div>
    </div>
  );
}

export default PlayOnline;
