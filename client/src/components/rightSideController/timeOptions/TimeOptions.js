import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClock,
  faRocket,
  faBoltLightning,
} from '@fortawesome/free-solid-svg-icons';

import './TimeOptions.css';
import LargeButton from '../../buttons/LargeButton';
import Header from '../header/Header';

function TimeOptions({ playingOptions }) {
  function handleChooseTime(clickedButton) {
    // remove class "active" out of clicked button
    var timeOptions = document.querySelectorAll('.time-options-buttons');
    timeOptions.forEach((element) => {
      element.classList.remove('active');
    });

    // add class "active" for clicked button
    clickedButton.classList.add('active');
  }

  return (
    <div>
      <Header />

      <div className="time-options_container">
        {/* tiem options: bullet, blitz, rapid */}
        <div className="time-options">
          <span className="time-options_icon rocket">
            <FontAwesomeIcon icon={faRocket} />
          </span>
          <span
            className="time-options-buttons"
            onClick={(e) => handleChooseTime(e.target)}
          >
            1 min
          </span>
          <span
            className="time-options-buttons"
            onClick={(e) => handleChooseTime(e.target)}
          >
            1 | 1{' '}
          </span>
          <span
            className="time-options-buttons"
            onClick={(e) => handleChooseTime(e.target)}
          >
            2 | 1
          </span>
        </div>

        <div className="time-options">
          <span className="time-options_icon lightning">
            <FontAwesomeIcon icon={faBoltLightning} />
          </span>
          <span
            className="time-options-buttons"
            onClick={(e) => handleChooseTime(e.target)}
          >
            3 min
          </span>
          <span
            className="time-options-buttons"
            onClick={(e) => handleChooseTime(e.target)}
          >
            3 | 2{' '}
          </span>
          <span
            className="time-options-buttons"
            onClick={(e) => handleChooseTime(e.target)}
          >
            5 min
          </span>
        </div>

        <div className="time-options">
          <span className="time-options_icon clock">
            <FontAwesomeIcon icon={faClock} />
          </span>
          <span
            className="time-options-buttons active"
            onClick={(e) => handleChooseTime(e.target)}
          >
            10 min
          </span>
          <span
            className="time-options-buttons"
            onClick={(e) => handleChooseTime(e.target)}
          >
            15 | 10{' '}
          </span>
          <span
            className="time-options-buttons"
            onClick={(e) => handleChooseTime(e.target)}
          >
            30 min
          </span>
        </div>

        {/* button play game */}
        <div className="button-play">
          <LargeButton
            name="Play"
            bg="green"
            onEventClick={playingOptions}
            option="playOnline"
          />
        </div>

        {/* button play with friend */}
        <div className="button-play-with-friend">
          <LargeButton
            name="Play a Friend"
            bg="dark"
            onEventClick={playingOptions}
            option="playWithFriend"
          />
        </div>
      </div>
    </div>
  );
}

export default TimeOptions;
