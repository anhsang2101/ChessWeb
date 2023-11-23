import {useState} from "react";
import {Chess} from "chess.js";
import { Chessboard } from "react-chessboard";

import DialogEndGame from "./components/dialogEndGame/DialogEndGame"
import "./App.css";

// to do list
// 1. logic
    // - en passent
    // - promotion: done
    // - protect king: done
    // - king possible move: done
    // - castle: done
// 2. chay server, chat app -> ket noi 2 nguoi
// 3. UI cho nguoi con lai

function App() {
  const [game, setGame] = useState(new Chess());
  const [moveFrom, setMoveFrom] = useState("");
  const [moveTo, setMoveTo] = useState(null);
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const [optionSquares, setOptionSquares] = useState({});
  const [isEndGame, setEndGame] = useState(false);

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
    if (game.game_over() || game.in_draw() || possibleMoves.length === 0) {
      setEndGame(true);
      return;
    }
  }

  function getMoveOptions(square) {
    // get all possible moves
    const moves = game.moves({
      square,
      verbose: true,
    });

    // if the square is empty or the piece on square is protecing the king -> no possible moves
    if (moves.length === 0) {
      let optionSquares = {}
      
      // if square contains piece (but hasn't possible moves) then still set this square's background to yellow
      if(game.get(square)) {
        optionSquares = {
          [square] : {
            background: "rgba(255, 255, 0, 0.4)"
          }
        }
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
            ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%",
      };
      return move;
    });
    newSquares[square] = {
      background: "rgba(255, 255, 0, 0.4)",
    };
    setOptionSquares(newSquares);
    return true;
  }

  function onSquareClick(square) {
    
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
        setMoveFrom(hasMoveOptions ? square : "");
        return;
      }

      // valid move
      setMoveTo(square);

      // if promotion move
      // if (
      //   (foundMove.color === "w" &&
      //     foundMove.piece === "p" &&
      //     square[1] === "8") ||
      //   (foundMove.color === "b" &&
      //     foundMove.piece === "p" &&
      //     square[1] === "1")
      // ) {
      //   setShowPromotionDialog(true);
      //   return;
      // }

      // is normal move
      const gameCopy = { ...game };
      const move = gameCopy.move({
        from: moveFrom,
        to: square,
        promotion: "q",
      });

      checkEndGame();

      // if invalid, setMoveFrom and getMoveOptions
      if (move === null) {
        const hasMoveOptions = getMoveOptions(square);
        if (hasMoveOptions) setMoveFrom(square);
        return;
      }

      setGame(gameCopy);

      // setTimeout(makeRandomMove, 300);
      setMoveFrom("");
      setMoveTo(null);
      setOptionSquares({});
      return;
    }
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

  function onPromotionPieceSelect(piece) {
    // if no piece passed then user has cancelled dialog, don't make move and reset
    if (piece) {
      const gameCopy = { ...game };
      gameCopy.move({
        from: moveFrom,
        to: moveTo,
        promotion: piece[1].toLowerCase() ?? "q",
      });
      setGame(gameCopy);
      setTimeout(makeRandomMove, 300);
    }

    setMoveFrom("");
    setMoveTo(null);
    setShowPromotionDialog(false);
    setOptionSquares({});
    return true;
  }

  function reset() {
    setEndGame(false)
    safeGameMutate((game) => {
      game.reset();
    });
    setOptionSquares({});
  }

  return (
       <div className="container">
          <div className="chessboard">
            <Chessboard
              id="ClickToMove"
              position={game.fen()}
              animationDuration={200}
              arePiecesDraggable={false}
              customBoardStyle={{
                borderRadius: "4px",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
              }}
              customDarkSquareStyle={{ backgroundColor: "#779952" }}
              customLightSquareStyle={{ backgroundColor: "#edeed1" }}
              customSquareStyles={{
                ...optionSquares,
              }}
              onSquareClick={onSquareClick}
              onPromotionPieceSelect={onPromotionPieceSelect}
              promotionToSquare={moveTo}
              showPromotionDialog={showPromotionDialog}
            />
          </div>

          {isEndGame && <DialogEndGame hideDialog={() => setEndGame(false)} playAgain={() => reset()}/>}
       </div>
  );
}

export default App;