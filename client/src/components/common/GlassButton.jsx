import "./glass-button.css";

export default function GlassButton({ children, onClick, className = "", type = "button" }) {
  return (
    <div className={`glass-root ${className}`}>
      <div className="button-wrap">
        <button className="glass-btn" type={type} onClick={onClick}>
          <span>{children}</span>
        </button>
        <div className="button-shadow" />
      </div>
    </div>
  );
}