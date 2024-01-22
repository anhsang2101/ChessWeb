import { memo, useContext, useEffect, useState } from 'react';

import './PlayersSection.css';
import defAvatar from '../../images/default-avatar.jpg';
import { InforOfRoomContext } from '../../components/pages/client/PlayOnline/PlayOnline';

let interval;
const timer = {};

function PlayersSection({ getTimer }) {
  const [orderOfPlayer, setOrderOfPlayer] = useState('');
  const [inforOfRoom, setInforOfRoom] = useState({});
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [isStartGame, setIsStartGame] = useState(false);

  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [minutesOpp, setMinutesOpp] = useState(0);
  const [secondsOpp, setSecondsOpp] = useState(0);

  const inforOfRoomContext = useContext(InforOfRoomContext);

  // console.log(inforOfRoomContext);
  useEffect(() => {
    setInforOfRoom(inforOfRoomContext.inforOfRoom);
    setOrderOfPlayer(inforOfRoomContext.orderOfPlayer);
    setIsMyTurn(inforOfRoomContext.isMyTurn);
    setIsStartGame(inforOfRoomContext.isStartGame);
  }, [inforOfRoomContext]);

  useEffect(() => {
    let player, opponent;
    if (orderOfPlayer === 'player1') {
      player = 'player1';
      opponent = 'player2';
    } else if (orderOfPlayer === 'player2') {
      player = 'player2';
      opponent = 'player1';
    }

    setMinutes(inforOfRoom?.[player]?.remaindTime?.minutes);
    setSeconds(inforOfRoom?.[player]?.remaindTime?.seconds);
    setMinutesOpp(inforOfRoom?.[opponent]?.remaindTime?.minutes);
    setSecondsOpp(inforOfRoom?.[opponent]?.remaindTime?.seconds);
  }, [inforOfRoom, orderOfPlayer]);

  // coutdown timer
  useEffect(() => {
    // get timer of players
    timer.minutes = minutes;
    timer.seconds = seconds;
    timer.minutesOpp = minutesOpp;
    timer.secondsOpp = secondsOpp;
    getTimer(timer);

    // coutdown the time of player
    if (isStartGame === true) {
      if (isMyTurn) {
        interval = setInterval(() => {
          if (Number(seconds) > 0)
            setSeconds((preValue) => Number(preValue) - 1);
          else if (Number(minutes) > 0) {
            setMinutes((preValue) => Number(preValue) - 1);
            setSeconds(59);
          }
        }, 1000);
        if (Number(seconds) === 0 && Number(minutes === 0)) stopTimer();
      } else {
        // coutdown the time of opponent
        interval = setInterval(() => {
          if (Number(secondsOpp) > 0)
            setSecondsOpp((preValue) => Number(preValue) - 1);
          else if (Number(minutesOpp) > 0) {
            setMinutesOpp((preValue) => Number(preValue) - 1);
            setSecondsOpp(59);
          }
        }, 1000);
        if (Number(secondsOpp) === 0 && Number(minutesOpp === 0)) stopTimer();
      }
    }

    return () => clearInterval(interval);
  }, [isStartGame, isMyTurn, minutes, seconds, minutesOpp, secondsOpp]);

  function stopTimer() {
    clearInterval(interval);
    // console.log('end game');
  }

  return (
    <div className="players">
      {orderOfPlayer === 'player1' ? (
        <>
          <div className="player_infor">
            <div className="player_infor-avatar">
              <img src={defAvatar} alt="avatar" />
            </div>
            <div>
              <div className="player_infor-name">
                <span>{inforOfRoom?.['player2']?.name}</span>
              </div>
              <div
                className={`time ${
                  inforOfRoom?.['player2']?.isMyTurn ? 'onPlay' : 'onPause'
                }`}
              >{`${
                minutesOpp < 10
                  ? String(minutesOpp).padStart(2, '0')
                  : minutesOpp
              } : ${
                secondsOpp < 10
                  ? String(secondsOpp).padStart(2, '0')
                  : secondsOpp
              }`}</div>
            </div>
          </div>

          <div className="player_infor">
            <div className="player_infor-avatar">
              <img src={defAvatar} alt="avatar" />
            </div>
            <div>
              <div
                className={`time ${
                  inforOfRoom?.['player1']?.isMyTurn ? 'onPlay' : 'onPause'
                }`}
              >{`${
                minutes < 10 ? String(minutes).padStart(2, '0') : minutes
              } : ${
                seconds < 10 ? String(seconds).padStart(2, '0') : seconds
              }`}</div>
              <div className="player_infor-name">
                <span>{inforOfRoom?.['player1']?.name}</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="player_infor">
            <div className="player_infor-avatar">
              <img src={defAvatar} alt="avatar" />
            </div>
            <div>
              <div className="player_infor-name">
                <span>{inforOfRoom?.['player1']?.name}</span>
              </div>
              <div
                className={`time ${
                  inforOfRoom?.['player1']?.isMyTurn ? 'onPlay' : 'onPause'
                }`}
              >{`${
                minutesOpp < 10
                  ? String(minutesOpp).padStart(2, '0')
                  : minutesOpp
              } : ${
                secondsOpp < 10
                  ? String(secondsOpp).padStart(2, '0')
                  : secondsOpp
              }`}</div>
            </div>
          </div>

          <div className="player_infor">
            <div className="player_infor-avatar">
              <img src={defAvatar} alt="avatar" />
            </div>
            <div>
              <div
                className={`time ${
                  inforOfRoom?.['player2']?.isMyTurn ? 'onPlay' : 'onPause'
                }`}
              >{`${
                minutes < 10 ? String(minutes).padStart(2, '0') : minutes
              } : ${
                seconds < 10 ? String(seconds).padStart(2, '0') : seconds
              }`}</div>
              <div className="player_infor-name">
                <span>{inforOfRoom?.['player2']?.name}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default memo(PlayersSection);
