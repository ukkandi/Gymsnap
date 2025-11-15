import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Workout from "./pages/Workout";
import Streaks from "./pages/Streaks";
import Calendar from "./pages/Calendar";
import Summary from "./pages/Summary";
import Health from "./pages/Health";

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Workout />} />
          <Route path="/streaks" element={<Streaks />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/health" element={<Health />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
