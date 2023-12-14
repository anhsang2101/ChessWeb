import CustomButton from '../buttons/CustomButton';
import './DialogMessages.css';
function DialogMessages({ messages, infor, handleOptions }) {
  // console.log(infor);
  return (
    <div className="dialog_messages">
      <p className={"messages " + infor.animation}>{messages}</p>
      <div className="dialog_messages-buttons">
        {infor.buttonCancel && (
          <CustomButton
            name={infor.buttonCancel.name}
            bg={infor.buttonCancel.background}
            onEventClick={handleOptions}
            option={infor.buttonCancel.option}
          />
        )}
        {infor.buttonAccept && (
          <CustomButton
            name={infor.buttonAccept.name}
            bg={infor.buttonAccept.background}
            onEventClick={handleOptions}
            option={infor.buttonAccept.option}
          />
        )}
      </div>
    </div>
  );
}

export default DialogMessages;
