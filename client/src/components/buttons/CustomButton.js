import "./CustomButton.css";

function CustomButton({ name, bg, onEventClick, option = null }) {
  return <button className={bg} onClick={() => onEventClick(option)}>{name}</button>;
}

export default CustomButton;
