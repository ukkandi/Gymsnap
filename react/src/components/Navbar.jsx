import { Link } from "react-router-dom";

export default function Navbar() {
  const navStyle = {
    display: "flex",
    gap: "20px",
    padding: "15px",
    background: "#eee",
    marginBottom: "20px"
  };

  return (
    <nav style={navStyle}>
      <Link to="/">Workout</Link>
      <Link to="/streaks">Streaks</Link>
      <Link to="/calendar">Calendar</Link>
      <Link to="/summary">AI Summary</Link>
      <Link to="/health">Health</Link>
    </nav>
  );
}
