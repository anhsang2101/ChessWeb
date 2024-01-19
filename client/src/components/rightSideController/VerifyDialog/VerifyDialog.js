import './VerifyDialog.css';
import CustomButton from '../../buttons/CustomButton';

function VerifyDialog({ message, handleChooseOptions, optionAccept }) {
  return (
    <div className="verify_container">
      <h3>{message}</h3>
      <div className="verify_buttons">
        <CustomButton
          name="No"
          bg="dark"
          onEventClick={handleChooseOptions}
          option="no"
        ></CustomButton>
        <CustomButton
          name="Yes"
          bg="green"
          onEventClick={handleChooseOptions}
          option={optionAccept}
        ></CustomButton>
      </div>
    </div>
  );
}

export default VerifyDialog;
