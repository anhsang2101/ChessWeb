import { useEffect, useState } from 'react'
import {useSelector, useDispatch} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './Admin.css'
import Header from './Header'
import Sidebar from './Sidebar'
import User from './User'
import Game from './Game'
import { getAllGames, getAllUsers } from '../redux/apiRequest';
import { createAxios } from '../redux/createInstance';
import { loginSuccess } from '../redux/authSlice';

let allUsers = [];
let allGames = [];

function Admin() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [showUsers, setShowUsers] = useState(true);

  const user = useSelector(state => state.auth.login?.currentUser);
  const dispath = useDispatch();
  const navigate = useNavigate();
  const axiosJWT = createAxios(user, dispath, loginSuccess);

  allUsers = useSelector(state => state.admin.getUsers?.users);
  allGames = useSelector(state => state.admin.getGames?.games);


  useEffect(() => {
    if(user?.admin === false) navigate("/login");
  }, [])

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle)
  }

  const handleChooseOptions = (options) => {
    if(options === 'users') {
      getAllUsers(user, user?.accessToken, dispath, axiosJWT);
      setShowUsers(true);
    }
    else {
      // getAllGames(user, user?.accessToken, dispath, axiosJWT);
      setShowUsers(false);
    }
  }

  return (
    <div className='grid-container'>
      <Header OpenSidebar={OpenSidebar}/>
      <Sidebar 
        openSidebarToggle={openSidebarToggle} 
        OpenSidebar={OpenSidebar} 
        handleChooseOptions={handleChooseOptions} />     
      {showUsers ? <User users={allUsers}/> : <Game />}
    </div>
  )
}
export default Admin;
