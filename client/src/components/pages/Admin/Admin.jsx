import { useEffect, useState } from 'react'
import {useSelector, useDispatch} from 'react-redux';
import { useNavigate } from 'react-router-dom';

import './Admin.css'
import Header from './Header'
import Sidebar from './Sidebar'
import User from './User'
import Game from './Game'
// import { createAxios } from '../redux/createInstance';
// import { loginSuccess } from '../redux/authSlice';

// let allUsers = [];

function Admin() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [showUsers, setShowUsers] = useState(true);
  // const [allGames, setAllGame] = useState([]);

  const user = useSelector(state => state.auth.login?.currentUser);
  const dispath = useDispatch();
  const navigate = useNavigate();
  // const axiosJWT = createAxios(user, dispath, loginSuccess);

  // allUsers = useSelector(state => state.admin.getUsers?.users);

  useEffect(() => {
    if(user?.admin === false) navigate("/login");
  }, [])

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle)
  }

  const handleChooseOptions = (options) => {
    if(options === 'games') {
      setShowUsers(false);
    } else if(options === 'users'){
      setShowUsers(true);
    }
  }

  return (
    <div className='grid-container'>
      <Header OpenSidebar={OpenSidebar}/>
      <Sidebar 
        openSidebarToggle={openSidebarToggle} 
        OpenSidebar={OpenSidebar} 
        handleChooseOptions={handleChooseOptions} />     
      {showUsers ? <User /> : <Game />}
    </div>
  )
}
export default Admin;
