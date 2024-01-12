import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandshake, faStar } from '@fortawesome/free-regular-svg-icons';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import logo from '../../images/chess-game-logo.png';

import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="side_bar">
      <a className="side_bar-link" href="/">
        <img src={logo} alt="logo" />
      </a>
      <a className="side_bar-link" href="/play">
        <span>
          <FontAwesomeIcon icon={faHandshake} />
        </span>
        <span className="text"> Play</span>
      </a>
      <a className="side_bar-link" href="/review">
        <span className="rounded">
          <FontAwesomeIcon icon={faStar} />
        </span>
        <span className="text">Review</span>
      </a>
      <a className="side_bar-link" href="/learn">
        <span>
          <FontAwesomeIcon icon={faGraduationCap} />
        </span>
        <span className="text">Learn</span>
      </a>
      <a className="side_bar-link button sign_up" href="/signup">
        Sign Up
      </a>
      <a className="side_bar-link button log_in" href="/login">
        Log In
      </a>
    </div>
  );
}

export default Sidebar;
