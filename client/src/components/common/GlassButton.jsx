import "./glass-button.css";

export default function GlassButton({ children }) {
  return (
    <div className="glass-root">
      <div className="button-wrap">
        <button className="glass-btn">
          <span>{children}</span>
        </button>
        <div className="button-shadow" />
      </div>
    </div>
  );
}