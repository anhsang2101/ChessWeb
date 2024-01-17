import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-regular-svg-icons';

import '../SignIn/SignIn.css';
import logo from '../../../images/chess-game-logo.png';
import { registerUser } from '../redux/apiRequest';

function SignUp() {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const dispath = useDispatch();
  const navigate = useNavigate();

  const showHidePasswordRef = useRef();
  const showHidePasswordRef2 = useRef();

  // show hide password
  function handleShowHidePassword(option = null) {
    if (option === 'doubleCheckPass') {
      setShowPassword2((preValue) => {
        if (preValue === false) showHidePasswordRef2.current.type = 'text';
        else showHidePasswordRef2.current.type = 'password';

        return preValue === true ? false : true;
      });
    } else {
      setShowPassword((preValue) => {
        if (preValue === false) showHidePasswordRef.current.type = 'text';
        else showHidePasswordRef.current.type = 'password';

        return preValue === true ? false : true;
      });
    }
  }

  function handleSignUp(e) {
    e.preventDefault();

    const newUser = {
      username: userName,
      email: email,
      password: password,
    };
    registerUser(newUser, dispath, navigate);
  }

  return (
    <div className="form_container">
      <div className="logo">
        <a href="/">
          <img src={logo} alt="logo" />
        </a>
      </div>

      <div className="form_component">
        <form onSubmit={handleSignUp}>
          {/* username */}
          <div className="input_group">
            <span className="input_group-icon">
              <FontAwesomeIcon icon={faUser} />
            </span>
            <input
              className="input_group-input"
              placeholder="Username"
              type="text"
              value={userName && userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          {/* <div className='show_error'>error error error</div> */}
          <div className="show_error">{errors.userName && errors.userName}</div>

          {/* email */}
          <div className="input_group">
            <span className="input_group-icon">
              <FontAwesomeIcon icon={faEnvelope} />
            </span>
            <input
              className="input_group-input"
              placeholder="Email"
              type="email"
              value={email && email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {/* <div className='show_error'>error error error</div> */}
          <div className="show_error">{errors.email && errors.email}</div>

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
                value={password && password}
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
          <div className="show_error">{errors.password && errors.password}</div>

          {/* double check password */}
          <div className="input_group">
            <span className="input_group-icon">
              <FontAwesomeIcon icon={faLock} />
            </span>
            <div className="input_group-password">
              <input
                className="input_group-input"
                placeholder="Re-enter password"
                type="password"
                value={password2 && password2}
                ref={showHidePasswordRef2}
                onChange={(e) => setPassword2(e.target.value)}
              />
              <span
                className="input_group-icon"
                onClick={() => handleShowHidePassword('doubleCheckPass')}
              >
                {showPassword2 ? (
                  <FontAwesomeIcon icon={faLock} />
                ) : (
                  <FontAwesomeIcon icon={faEye} />
                )}
              </span>
            </div>
          </div>
          {/* <div className='show_error'>error error error</div> */}
          <div className="show_error">
            {errors.password2 && errors.password2}
          </div>

          {/* button log in */}
          <button className="btn_login" type="submit">
            Sign Up
          </button>
        </form>

        {/* register */}
        <a className="register" href="/login">
          <span>You already have an account - Sign In!</span>
        </a>
      </div>
    </div>
  );
}

export default SignUp;
