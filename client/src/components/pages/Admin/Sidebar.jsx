import React from 'react'
import { BsPeopleFill} from 'react-icons/bs'
import { GiChessKnight } from "react-icons/gi";
import logo from '../../../images/chess-game-logo.png';
import { FaChess } from "react-icons/fa";

function Sidebar({openSidebarToggle, OpenSidebar}) {
  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive": ""}>
        <div className='sidebar-title'>
            <div className='sidebar-brand'>
                {/* <img  width="150"  src={logo} alt="" />  */}
                <FaChess/>
                <span style={{ marginLeft: "8px" }}>
                    Admin Chess
                </span>
            </div>
            <span className='icon close_icon' onClick={OpenSidebar}>X</span>
        </div>

        <ul className='sidebar-list'>
            <li className='sidebar-list-item'>
                <a href="">
                    <BsPeopleFill className='icon'/> Customers
                </a>
            </li>
            <li className='sidebar-list-item'>
                <a href="">
                    <GiChessKnight className='icon'/> Game Review
                </a>
            </li>
        </ul>
    </aside>
  )
}

export default Sidebar