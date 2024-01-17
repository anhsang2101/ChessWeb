import React from 'react'
import { BsPeopleFill} from 'react-icons/bs'
import { GiChessKnight } from "react-icons/gi";
import { FaChess } from "react-icons/fa";

function Sidebar({openSidebarToggle, OpenSidebar, handleChooseOptions}) {

  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive": ""}>
        <div className='sidebar-title'>
            <div className='sidebar-brand'>
                <FaChess/>
                <span style={{ marginLeft: "8px" }}>
                    Admin Chess
                </span>
            </div>
            <span className='icon close_icon' onClick={OpenSidebar}>X</span>
        </div>

        <ul className='sidebar-list'>
            <li className='sidebar-list-item' onClick={() => handleChooseOptions('users')}>
                <span>
                    <BsPeopleFill className='icon'/> Users
                </span>
            </li>
            <li className='sidebar-list-item' onClick={() => handleChooseOptions('games')}>
                <span>
                    <GiChessKnight className='icon'/> Game Review
                </span>
            </li>
        </ul>
    </aside>
  )
}

export default Sidebar