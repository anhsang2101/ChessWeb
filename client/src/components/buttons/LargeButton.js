import "./CustomButton.css";

function LargeButton({ name, bg, onEventClick, option = null }) {
  return <button className={`large-button ${bg}`} onClick={() => onEventClick(option)}>{name}</button>;
}

export default LargeButton;
