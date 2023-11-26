import defAvatar from '../../images/default-avatar.jpg';
import defAvatar2 from '../../images/default-avatar-2.webp';
import "./DialogEndGame.css";

function DialogEndGame({hideDialog, playAgain}) {
   return (
      <div className="dialogEndGame">
         <span className="btn-exit" onClick={hideDialog}>X</span>

         <p className="dialogEndGame_title">White win!</p>

         <div className="dialogEndGame_players">
            <div className="players_infor">
               <div className="players_infor-avatar">
                  <img src={defAvatar} alt="avatar user" />
               </div>
               <div className="players_infor-name">Thai Son</div>
            </div>

            <span
               style={{ fontSize: '18px', fontWeight: '500', color: 'white' }}
            >
               VS
            </span>

            <div className="players_infor">
               <div className="players_infor-avatar player_win">
                  <img
                     src={defAvatar2}
                     alt="avatar user"
                  />
               </div>
               <div className="players_infor-name">Gof Father</div>
            </div>
         </div>

         <button className="btn-play-again" onClick={playAgain}>Play Again</button>
      </div>
   );
}

export default DialogEndGame;
