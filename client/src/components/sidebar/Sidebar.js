import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandshake, faStar } from '@fortawesome/free-regular-svg-icons';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';
import logo from '../../images/chess-game-logo.png';
import avatar from '../../images/default-avatar.jpg';
import { createAxios } from '../pages/redux/createInstance';
import { logoutUser } from '../pages/redux/apiRequest';
import { loginSuccess } from '../pages/redux/authSlice';

function Sidebar() {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const idUser = user?._id;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const axiosJWT = createAxios(user, dispatch, loginSuccess);
  
  function handleLogout() {
    logoutUser(idUser, user?.accessToken, dispatch, navigate, axiosJWT);
  };

  return (
    <div className="side_bar">
      <a className="side_bar-link" href="/">
        <img src={logo} alt="logo" />
      </a>
      <a className="side_bar-link" href="/play/online">
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
      {user ? (
        <>
          <a className="profile" href="/profile">
            <img src={avatar} alt="profile" />
            <span className="profile_name">{user.username}</span>
          </a>
          <a className="side_bar-link button sign_up" onClick={handleLogout}>
            Log Out
          </a>
        </>
      ) : (
        <>
          <a className="side_bar-link button sign_up" href="/signup">
            Sign Up
          </a>
          <a className="side_bar-link button log_in" href="/login">
            Log In
          </a>
        </>
      )}
    </div>
  );
}

export default Sidebar;
