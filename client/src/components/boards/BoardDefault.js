import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';

import './Board.css';

function BoardDefault({ controllerSide }) {
  const game = new Chess();
  return (
    <div className="main_container">
      <div className="chessboard">
        <Chessboard
          position={game.fen()}
          boardOrientation="white"
          animationDuration={200}
          arePiecesDraggable={false}
          customBoardStyle={{
            borderRadius: '4px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
          }}
          customDarkSquareStyle={{ backgroundColor: '#779952' }}
          customLightSquareStyle={{ backgroundColor: '#edeed1' }}
        />
      </div>

      <div className="controller_side">{controllerSide}</div>
    </div>
  );
}

export default BoardDefault;
