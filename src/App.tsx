import { HashRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Module/Landing/Page/Page";
import LoginPage from "./Module/Login/Page/Page";
import DashboardPage from "./Module/Dashboard/Page/Page";
import ModulePage from "./Module/Module/Page/Page";
import LatihanPage from "./Module/Latihan/Page/Page";
import ProgressPage from "./Module/Progress/Page/Page";
import ProfilePage from "./Module/Profile/Page/Page";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/module" element={<ModulePage />} />
        <Route path="/module-detail" element={<LatihanPage />} />
        <Route path="/latihan" element={<LatihanPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
