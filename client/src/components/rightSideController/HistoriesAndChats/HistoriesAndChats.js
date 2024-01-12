import { useContext, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag } from '@fortawesome/free-solid-svg-icons';

import './HistoriesAndChats.css';
import { HistoriesContext } from '../../pages/PlayOnline/PlayOnline';

var orderTurn = 1;

function HistoriesAndChats() {
  // receive histories from PlayOnline page
  const histories = useContext(HistoriesContext);
  // get div tag histories
  const historiesSection = document.getElementById("historiesSection");

  // whenever receive new move piece, render it on HistoriesAndChats Section
  useEffect(() => {
    const lastIndex = histories.length - 1;
    if(lastIndex >= 0) {
      // get value of the last move piece
      const lastElement = histories[lastIndex][0].san;

      // remove class "active"
      const activeClassElements = historiesSection.querySelectorAll(".histories_group .active");
      activeClassElements.forEach(element => {
        element.classList.remove("active");
      })

      // if the moveing piece belong to the white player
      if(lastIndex % 2 === 0) {
        if(historiesSection) {
          const historiesGroupSection = document.createElement("div");
          historiesGroupSection.className = "histories_group";
          historiesGroupSection.id = orderTurn.toString();
          historiesGroupSection.innerHTML =  `
            <span class="histories_group-turn">${orderTurn}.</span>
            <span class="histories_group-white-turn san active">${lastElement}</span>
          `

          historiesSection.appendChild(historiesGroupSection);
        }
      } else {
        const historiesGroupSection = document.getElementById(`${orderTurn}`);

        if(historiesGroupSection) {
          const blackTurnElement = document.createElement("span");
          blackTurnElement.className = "histories_group-black-turn san active";
          blackTurnElement.innerHTML = lastElement;

          historiesGroupSection.appendChild(blackTurnElement);
          orderTurn++;
        }
      }
    }
  }, [histories]);

  return (
    <div className="hac_container">
      {/* show all piece moves */}
      <div className="histories" id="historiesSection">
        {/* <div className="histories_group">
          <span className="histories_group-turn">1.</span>
          <span className="histories_group-white-turn san">e3</span>
          <span className="histories_group-black-turn san">Nc6</span>
        </div>
        <div className="histories_group">
          <span className="histories_group-turn">1.</span>
          <span className="histories_group-white-turn san">e3ax</span>
          <span className="histories_group-black-turn san active">Nc6</span>
        </div>
        <div className="histories_group">
          <span className="histories_group-turn">1.</span>
          <span className="histories_group-white-turn san">es3</span>
          <span className="histories_group-black-turn san">Nc6</span>
        </div>
        <div className="histories_group">
          <span className="histories_group-turn">1.</span>
          <span className="histories_group-white-turn san">e34x</span>
          <span className="histories_group-black-turn san">Nc6</span>
        </div>
        <div className="histories_group">
          <span className="histories_group-turn">1.</span>
          <span className="histories_group-white-turn san">e3s</span>
          <span className="histories_group-black-turn san">Nc6</span>
        </div> */}
      </div>

      {/* when the player wants to draw or resign, abort */}
      <div className="finish_game">
        <span className="finish_game-draw">1/2 Draw</span>
        <span className="finish_game-abort">
          <FontAwesomeIcon icon={faFlag} /> Abort
        </span>
      </div>

      {/* show all messages */}
      <div className="chat_box-messages">
        <p>ttson01 offer the draw game</p>
        <p>ttson01 offer the draw game</p>
        <p>ttson01 offer the draw game</p>
        <p>ttson01 offer the draw game</p>
        <p>ttson01 offer the draw game</p>
        <p>ttson01 offer the draw game</p>
        <p>ttson01 offer the draw game</p>
        <p>ttson01 offer the draw game</p>
        <p>ttson01 offer the draw game</p>
        <p>ttson01 offer the draw game</p>
        <p>ttson01 offer the draw game</p>
        <p>ttson01 offer the draw game</p>
        <p>ttson01 offer the draw game</p>
        <p>ttson01 offer the draw game</p>
        <p>ttson01 offer the draw game</p>
        <p>ttson01 offer the draw game</p>
      </div>

      {/* the place for player can enter and send the message */}
      <input
        className="chat_box-enter_message"
        placeholder="Send a message..."
      />
      {/* <div className="chat_box">

      </div> */}
    </div>
  );
}

export default HistoriesAndChats;
