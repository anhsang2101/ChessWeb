import defAvatar from '../../images/default-avatar.jpg';
import './DialogEndGame.css';
import CustomButton from '../buttons/CustomButton';

function DialogEndGame({ inforOfRoom, handleOptions }) {
  // console.log(inforOfRoom);
  return (
    <div className="dialogEndGame">
      <span className="btn-exit" onClick={() => handleOptions('hideDialog')}>
        X
      </span>

      <p className="dialogEndGame_title">
        {inforOfRoom?.pieceTypeWon === 'draw game'
          ? inforOfRoom?.pieceTypeWon
          : `${inforOfRoom?.pieceTypeWon} win!`}
      </p>

      <div className="dialogEndGame_players">
        <div className="players_infor">
          <div
            className={`players_infor-avatar ${
              inforOfRoom?.player1?.isWon &&
              inforOfRoom?.pieceTypeWon !== 'draw game'
                ? 'player_win'
                : ''
            }`}
          >
            <img src={defAvatar} alt="avatar user" />
          </div>
          <div className="players_infor-name">{inforOfRoom?.player1?.name}</div>
        </div>

        <span style={{ fontSize: '18px', fontWeight: '500', color: 'white' }}>
          VS
        </span>

        <div className="players_infor">
          <div
            className={`players_infor-avatar ${
              inforOfRoom?.player2?.isWon &&
              inforOfRoom?.pieceTypeWon !== 'draw game'
                ? 'player_win'
                : ''
            }`}
          >
            <img src={defAvatar} alt="avatar user" />
          </div>
          <div className="players_infor-name">{inforOfRoom?.player2?.name}</div>
        </div>
      </div>

      <div className="dialogEndGame_finish-game">
        <button
          className="btn-game-review"
          onClick={() => handleOptions('gameReview')}
        >
          Game Review
        </button>

        <div className="buttons_finish-game">
          <CustomButton
            name="New 10 min"
            bg="dark"
            onEventClick={handleOptions}
            option="newGame"
          />

          <CustomButton
            name="Rematch"
            bg="dark"
            onEventClick={handleOptions}
            option="rematchGame"
          />
        </div>
      </div>
    </div>
  );
}

export default DialogEndGame;
