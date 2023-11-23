import defAvatar from '../images/default-avatar.jpg';
import defAvatar2 from '../images/default-avatar-2.webp';

function DialogEndGame() {
   return (
      <div className="dialogEndGame">
         <span className="btn-exit">X</span>

         <p className="dialogEndGame_title">White win!</p>

         <div className="dialogEndGame_players">
            <div className="players_infor">
               <div className="players_infor-avatar">
                  <img src={defAvatar} alt="avatar user" />
               </div>
               <div className="players_infor-name">Thai Son</div>
            </div>

            <span
               style={{ fontSize: '16px', fontWeight: '500', color: 'white' }}
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

         <button className="btn-play-again">Play Again</button>
      </div>
   );
}

export default DialogEndGame;
