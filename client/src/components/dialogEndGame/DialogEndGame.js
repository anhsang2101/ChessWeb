import defAvatar from '../../images/default-avatar.jpg';
import defAvatar2 from '../../images/default-avatar-2.webp';
import './DialogEndGame.css';

function DialogEndGame({ inforOfRoom, hideDialog, playAgain }) {
  // console.log({ ...inforOfRoom });
  return (
    <div className="dialogEndGame">
      <span className="btn-exit" onClick={hideDialog}>
        X
      </span>

      <p className="dialogEndGame_title">{inforOfRoom?.pieceTypeWon} win!</p>

      <div className="dialogEndGame_players">
        <div className="players_infor">
          <div className={`players_infor-avatar ${inforOfRoom?.player1.isWon ? "player_win" : ""}`}>
            <img src={defAvatar} alt="avatar user" />
          </div>
          <div className="players_infor-name">{inforOfRoom?.player1?.name}</div>
        </div>

        <span style={{ fontSize: '18px', fontWeight: '500', color: 'white' }}>
          VS
        </span>

        <div className="players_infor">
          <div className={`players_infor-avatar ${inforOfRoom?.player2.isWon ? "player_win" : ""}`}>
            <img src={defAvatar2} alt="avatar user" />
          </div>
          <div className="players_infor-name">{inforOfRoom?.player2?.name}</div>
        </div>
      </div>

      <button className="btn-play-again" onClick={() => playAgain()}>
        Play Again
      </button>
    </div>
  );
}

export default DialogEndGame;
