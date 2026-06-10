import { HashRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Module/Landing/Page/Page";
import LoginPage from "./Module/Login/Page/Page";
import DashboardPage from "./Module/Dashboard/Page/Page";
import KanjiPage from "./Module/Kanji/Page/Page";
import VocabularyPage from "./Module/Vocabulary/Page/Page";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/kanji" element={<KanjiPage />} />
        <Route path="/vocabulary" element={<VocabularyPage />} />
      </Routes>
    </Router>
  );
}

export default App;
