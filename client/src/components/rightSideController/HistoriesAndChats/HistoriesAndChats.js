import { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag } from '@fortawesome/free-solid-svg-icons';

import './HistoriesAndChats.css';
import { HistoriesContext } from '../../../components/pages/client/PlayOnline/PlayOnline';
import VerifyDialog from '../VerifyDialog/VerifyDialog';

var orderTurn = 1;

function HistoriesAndChats() {
  const [verifyDraw, setVerifyDraw] = useState(false);
  const [verifyAbort, setVerifyAbort] = useState(false);

  // receive histories from PlayOnline page
  const historiesContext = useContext(HistoriesContext);
  const histories = historiesContext.histories;
  const messages = historiesContext.messages;
  const handleFinishGame = historiesContext.handleFinishGame;

  // get div tag histories
  const historiesSection = document.getElementById('historiesSection');
  // get div tag chat_box-messages
  const chatBox = document.getElementById('chatboxSection');

  // whenever receive new move piece, render it on HistoriesAndChats Section
  useEffect(() => {
    if (histories.length > 0) {
      const lastIndex = histories.length - 1;
      if (lastIndex >= 0) {
        // get value of the last move piece
        const lastElement = histories[lastIndex][0].san;

        // remove class "active"
        const activeClassElements = historiesSection.querySelectorAll(
          '.histories_group .active'
        );
        activeClassElements.forEach((element) => {
          element.classList.remove('active');
        });

        // if the moveing piece belong to the white player
        if (lastIndex % 2 === 0) {
          if (historiesSection) {
            const historiesGroupSection = document.createElement('div');
            historiesGroupSection.className = 'histories_group';
            historiesGroupSection.id = orderTurn.toString();
            historiesGroupSection.innerHTML = `
              <span class="histories_group-turn">${orderTurn}.</span>
              <span class="histories_group-white-turn san active">${lastElement}</span>
            `;

            historiesSection.appendChild(historiesGroupSection);
          }
        } else {
          const historiesGroupSection = document.getElementById(`${orderTurn}`);

          if (historiesGroupSection) {
            const blackTurnElement = document.createElement('span');
            blackTurnElement.className =
              'histories_group-black-turn san active';
            blackTurnElement.innerHTML = lastElement;

            historiesGroupSection.appendChild(blackTurnElement);
            orderTurn++;
          }
        }
      }
    }
  }, [histories]);

  useEffect(() => {
    if (messages.length > 0) {
      if (chatBox) {
        const lastElement = messages[messages.length - 1];
        const element = document.createElement('p');
        element.innerHTML = lastElement;
        chatBox.appendChild(element);
      }
    }
  }, [messages]);

  // show / hide dialog verify
  function handleVerify(options) {
    if (options === 'draw') {
      setVerifyDraw(true);
      setVerifyAbort(false);
    } else {
      setVerifyDraw(false);
      setVerifyAbort(true);
    }
  }
  // handel draw / abort / resign
  function handleChooseOptions(options) {
    // console.log('option: ', options);
    setVerifyDraw(false);
    setVerifyAbort(false);
    if (options !== 'no') {
      handleFinishGame(options);
    }
  }

  return (
    <div className="hac_container">
      {/* show all piece moves */}
      <div className="histories" id="historiesSection"></div>

      {/* when the player wants to draw or resign, abort */}
      <div className="finish_game">
        <span className="finish_game-draw" onClick={() => handleVerify('draw')}>
          1/2 Draw
          {verifyDraw && (
            <VerifyDialog
              message="Do you want to offer a draw?"
              handleChooseOptions={handleChooseOptions}
              optionAccept="offerDraw"
            />
          )}
        </span>
        <span
          className="finish_game-abort"
          onClick={() => handleVerify('abort')}
        >
          <FontAwesomeIcon icon={faFlag} />{' '}
          {histories?.length >= 4 ? 'resign' : 'abort'}
          {verifyAbort && (
            <VerifyDialog
              message={`Are you sure want to ${
                histories?.length >= 4 ? 'resign' : 'abort'
              }?`}
              handleChooseOptions={handleChooseOptions}
              optionAccept={`offer${
                histories?.length >= 4 ? 'Resign' : 'Abort'
              }`}
            />
          )}
        </span>
      </div>

      {/* show all messages */}
      <div className="chat_box-messages" id="chatboxSection">
        {/* <p>ttson01 offer the draw game</p>
        <p>ttson01 offer the draw game</p>
        <p>ttson01 offer the draw game</p> */}
      </div>

      {/* the place for player can enter and send the message */}
      <input
        className="chat_box-enter_message"
        placeholder="Send a message..."
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleFinishGame('sendMessage', e.target.value);
            e.target.value = '';
          }
        }}
      />
      {/* <div className="chat_box">

      </div> */}
    </div>
  );
}

export default HistoriesAndChats;
