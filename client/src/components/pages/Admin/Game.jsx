import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill} from 'react-icons/bs'
import IPAddress from '../../../IPAddress';

function User() {
  const [games, setGames] = useState([])

  useEffect( () => {
    axios.get(`http://${IPAddress}:3001/admin/games`)
      .then(res => {
        setGames(res.data);
      })
      .catch(error => console.log(error));
  }, [])
  
  const handleDeleteItem = async (gameId) => {
    await axios.delete(`http://${IPAddress}:3001/admin/deletegame/${gameId}`)
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
        <h2>Games</h2>
        <table className='user-table'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Player 1</th>
              <th>Player 2</th>
              <th>Won Player</th>
              <th>Moves</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {games.map((item) => {
              return (
                <tr key={item.id}>
                <td>{item._id}</td>
                <td>
                  <p>{item.player1.username}</p>
                  <p>{item.player1.pieceType}</p>
                </td>
                <td>
                  <p>{item.player2.username}</p>
                  <p>{item.player2.pieceType}</p>
                </td>
                <td>{item.wonPlayer}</td>
                <td>{item.moves}</td>
                <td>{item.createdAt}</td>
                <td className='buttons'>
                  <button className='edit-button'>View</button>
                  <button className='delete-button' onClick={() => handleDeleteItem(item._id)}>Delete</button>
                </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

    </main>
  )
}

export default User