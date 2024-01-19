import "./CustomButton.css";

function CustomButton({ name, bg, onEventClick, option = null }) {
  return <button className={bg} onClick={(e) => {
    e.stopPropagation();
    onEventClick(option);
  }}>{name}</button>;
}

export default CustomButton;
