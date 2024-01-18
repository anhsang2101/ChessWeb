import { useEffect, useState } from 'react'
import {useSelector, useDispatch} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import './Admin.css'
import Header from './Header'
import Sidebar from './Sidebar'
import User from './User'
import Game from './Game'
import { getAllUsers } from '../redux/apiRequest';
import { createAxios } from '../redux/createInstance';
import { loginSuccess } from '../redux/authSlice';

let allUsers = [];
// let allGames = [];

function Admin() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [showUsers, setShowUsers] = useState(true);
  const [allGames, setAllGame] = useState([]);

  const user = useSelector(state => state.auth.login?.currentUser);
  const dispath = useDispatch();
  const navigate = useNavigate();
  const axiosJWT = createAxios(user, dispath, loginSuccess);

  allUsers = useSelector(state => state.admin.getUsers?.users);

  useEffect(() => {
    if(user?.admin === false) navigate("/login");
  }, [])

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle)
  }

  const handleChooseOptions = (options) => {
    if(options === 'games') {
      // axios.get(`http://localhost:3001/admin/games`)
      // .then(res => {
      //   const games = res.data;
      //   // console.log(games);
      //   // allGames = games;
      //   setAllGame(games);
      // })
      // .catch(error => console.log(error));
      setShowUsers(false);
    } else if(options === 'users'){
      // getAllUsers(user, user?.accessToken, dispath, axiosJWT);
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
      {showUsers ? <User allUsers={allUsers}/> : <Game games={allGames}/>}
    </div>
  )
}
export default Admin;
