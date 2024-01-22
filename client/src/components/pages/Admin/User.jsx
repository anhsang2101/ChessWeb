import React, { useEffect } from 'react';
import axios from 'axios';
import {useSelector, useDispatch} from 'react-redux';
import { createAxios } from '../redux/createInstance';
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill} from 'react-icons/bs'
import { loginSuccess } from '../redux/authSlice';
import { getAllUsers } from '../redux/apiRequest';
import IPAddress from '../../../IPAddress';

let users = [];

function User() {
  users = useSelector(state => state.admin.getUsers?.users);
  const user = useSelector(state => state.auth.login?.currentUser);
  const dispath = useDispatch();
  const axiosJWT = createAxios(user, dispath, loginSuccess);

  useEffect(() => {
    getAllUsers(user, user?.accessToken, dispath, axiosJWT)
  }, [])

  const handleDeleteItem = async (userId) => {
    await axios.delete(`http://${IPAddress}:3001/admin/deleteuser/${userId}`)
    .then(res => {
      alert(res.data);
      window.location.reload();
    })
    .catch(error => console.log(error));
  };

  return (
    <main className='main-container'>
        <div className='main-title'>
            <h3>DASHBOARD</h3>
        </div>

        <div className='main-cards'>
            <div className='card'>
                <div className='card-inner'>
                    <h3>GAME REPLAY</h3>
                    <BsFillArchiveFill className='card_icon'/>
                </div>
                <h1>300</h1>
            </div>
            <div className='card'>
                <div className='card-inner'>
                    <h3>CATEGORIES</h3>
                    <BsFillGrid3X3GapFill className='card_icon'/>
                </div>
                <h1>12</h1>
            </div>
            <div className='card'>
                <div className='card-inner'>
                    <h3>USER</h3>
                    <BsPeopleFill className='card_icon'/>
                </div>
                <h1>33</h1>
            </div>
            <div className='card'>
                <div className='card-inner'>
                    <h3>ALERTS</h3>
                    <BsFillBellFill className='card_icon'/>
                </div>
                <h1>42</h1>
            </div>
        </div>

        <div className='add-item'>
          <label htmlFor="">Search: </label>
          <input
            type='text'
            placeholder='Enter Username'
          />
          <button className='search-button'>Search</button>
        </div>

        <div className='crud-table'>
        <h2>Users</h2>
        <table className='user-table'>
          <thead>
            <tr>
              <th>ID</th>
              <th>User Name</th>
              <th>Email</th>
              <th>Password</th>
              <th>Is Admin</th>
              <th>Create At</th>
              <th>Last Update</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users?.map(item => (
              <tr key={item._id}>
                <td>{item._id}</td>
                <td>{item.username}</td>
                <td>{item.email}</td>
                <td>{item.password}</td>
                <td>{item.admin ? "true" : "false"}</td>
                <td>{item.createdAt}</td>
                <td>{item.updatedAt}</td>
                <td className='buttons'>
                  <button className='edit-button'>Edit</button>
                  <button className='delete-button' onClick={() => handleDeleteItem(item._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </main>
  )
}

export default User