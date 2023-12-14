import "./CustomButton.css";
function CustomButton({ name, bg, onEventClick, option }) {
  console.log("button: ",option);
  return <button className={bg} onClick={() => onEventClick(option)}>{name}</button>;
}

export default CustomButton;
