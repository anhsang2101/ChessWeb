import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-regular-svg-icons';

import './SignIn.css';
import logo from '../../../images/chess-game-logo.png';
import { loginUser } from '../redux/apiRequest';
import { useNavigate } from 'react-router-dom';

function Sign() {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const showHidePasswordRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // show hide password
  function handleShowHidePassword() {
    setShowPassword((preValue) => {
      if (preValue === false) showHidePasswordRef.current.type = 'text';
      else showHidePasswordRef.current.type = 'password';

      return preValue === true ? false : true;
    });
  }

  const handleLogin = (e) => {
    // prevent reload page from logging in
    e.prevenDefault();

    const newUser = {
      email: email,
      password: password,
    };

    loginUser(newUser, dispatch, navigate);
  };

  return (
    <div className="form_container">
      <div className="logo">
        <a href="/">
          <img src={logo} alt="logo" />
        </a>
      </div>

      <div className="form_component">
        <form onSubmit={handleLogin}>
          {/* email */}
          <div className="input_group">
            <span className="input_group-icon">
              <FontAwesomeIcon icon={faEnvelope} />
            </span>
            <input
              className="input_group-input"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {/* <div className='show_error'>error error error</div> */}
          <div className="show_error"></div>

          {/* password */}
          <div className="input_group">
            <span className="input_group-icon">
              <FontAwesomeIcon icon={faLock} />
            </span>
            <div className="input_group-password">
              <input
                className="input_group-input"
                placeholder="Password"
                type="password"
                value={password}
                ref={showHidePasswordRef}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="input_group-icon"
                onClick={() => handleShowHidePassword()}
              >
                {showPassword ? (
                  <FontAwesomeIcon icon={faLock} />
                ) : (
                  <FontAwesomeIcon icon={faEye} />
                )}
              </span>
            </div>
          </div>
          {/* <div className='show_error'>error error error</div> */}
          <div className="show_error"></div>

          {/* remember password / forget password */}
          <div className="remember-forget_password">
            <div className="remember_password">
              <input type="checkbox" id="rememberPassword" />
              <label htmlFor="rememberPassword">Remember me</label>
            </div>

            <div className="forget_password">
              <a href="#">Forgot Password?</a>
            </div>
          </div>

          {/* button log in */}
          <button className="btn_login" type="submit">
            Log In
          </button>
        </form>

        {/* register */}
        <a className="register" href="/signup">
          <span>Sign Up - and start playing chess!</span>
        </a>
      </div>
    </div>
  );
}

export default Sign;
