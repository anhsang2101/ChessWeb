import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { io } from 'socket.io-client';
import Sidebar from '../../../sidebar/Sidebar';
import PlayingOptions from '../../../rightSideController/playingOptions/PlayingOptions';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import IPAddress from '../../../../IPAddress';
import { useState, useEffect } from 'react';

const socket = io.connect(`http://${IPAddress}:3001`);
const PlayWithComputer = () => {
  const [game, setGame] = useState(new Chess());
  const [currentTimeout, setCurrentTimeout] = useState();

  const user = useSelector((state) => state.auth.login?.currentUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // check the current state of players when they reconnecting
      const data = {
        userID: user._id,
        page: 'play with computer',
      };
      socket.emit('handleCurrentState', data);
    }
  }, [user]);

  function safeGameMutate(modify) {
    setGame((g) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }

  function makeRandomMove() {
    const possibleMoves = game.moves();

    // exit if the game is over
    if (game.game_over() || game.in_draw() || possibleMoves.length === 0)
      return;

    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    safeGameMutate((game) => {
      game.move(possibleMoves[randomIndex]);
    });
  }

  function onDrop(sourceSquare, targetSquare, piece) {
    const gameCopy = { ...game };
    const move = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: piece[1].toLowerCase() ?? 'q',
    });
    setGame(gameCopy);

    // illegal move
    if (move === null) return false;

    // store timeout so it can be cleared on undo/reset so computer doesn't execute move
    const newTimeout = setTimeout(makeRandomMove, 200);
    setCurrentTimeout(newTimeout);
    return true;
  }

  return (
    <div className="container">
      <Sidebar />

      <div className="main_container">
        <div className="chessboard">
          <Chessboard
            id="ClickToMove"
            position={game.fen()}
            animationDuration={200}
            // arePiecesDraggable={false}
            customBoardStyle={{
              borderRadius: '4px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
            }}
            customDarkSquareStyle={{ backgroundColor: '#779952' }}
            customLightSquareStyle={{ backgroundColor: '#edeed1' }}
            // customSquareStyles={{
            //   ...optionSquares,
            // }}
            onPieceDrop={onDrop}
          />
        </div>

        {/* section for controller */}
        <div className="controller_side">
          <PlayingOptions />
        </div>
      </div>
    </div>
  );
};

export default PlayWithComputer;
