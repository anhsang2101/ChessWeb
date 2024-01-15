import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-regular-svg-icons';

import '../SignIn/SignIn.css';
import logo from '../../../images/chess-game-logo.png';
import { useRef, useState } from 'react';

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const showHidePasswordRef = useRef();
  const showHidePasswordRef2 = useRef();

  // show hide password
  function handleShowHidePassword(option = null) {
    if(option === "doubleCheckPass") {
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

  return (
    <div className="form_container">
      <div className="logo">
        <a href="/">
          <img src={logo} alt="logo" />
        </a>
      </div>

      <div className="form_component">
        <form>
          {/* email */}
          <div className="input_group">
            <span className="input_group-icon">
              <FontAwesomeIcon icon={faEnvelope} />
            </span>
            <input
              className="input_group-input"
              placeholder="Email"
              type="email"
            />
          </div>
          {/* <div className='show_error'>error error error</div> */}
          <div className='show_error'></div>

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
                ref={showHidePasswordRef}
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
          <div className='show_error'></div>

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
                ref={showHidePasswordRef2}
              />
              <span
                className="input_group-icon"
                onClick={() => handleShowHidePassword("doubleCheckPass")}
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
          <div className='show_error'></div>

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
