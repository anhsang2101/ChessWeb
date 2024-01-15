import React from 'react'
import { useState } from 'react';
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill} from 'react-icons/bs'

function User() {
  const [data, setData] = useState([
    { id: 1, username: 'sang',email: "sang@mail",password: "zFGzxcdZbtTsEW", admin: "true", createAt: "1/1/1999", lastUpdate: "1/1/2000"},
    // Add more initial data as needed
  ]);

  const [newItem, setNewItem] = useState('');

  const handleDeleteItem = (id) => {
    const updatedData = data.filter(item => item.id !== id);
    setData(updatedData);
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
        <h2>User</h2>
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
            {data.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.username}</td>
                <td>{item.email}</td>
                <td>{item.password}</td>
                <td>{item.admin}</td>
                <td>{item.createAt}</td>
                <td>{item.lastUpdate}</td>
                <td>
                  <button className='edit-button'>Edit</button>
                  <button className='delete-button' onClick={() => handleDeleteItem(item.id)}>Delete</button>
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