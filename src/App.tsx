import { HashRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Module/Landing/Page/Page";
import LoginPage from "./Module/Login/Page/Page";
import RegisterPage from "./Module/Register/Page/Page";
import DashboardPage from "./Module/Dashboard/Page/Page";
import ModulePage from "./Module/Module/Page/Page";
import LatihanPage from "./Module/Latihan/Page/Page";
import ProgressPage from "./Module/Progress/Page/Page";
import ProfilePage from "./Module/Profile/Page/Page";
import AdminPage from "./Module/Admin/Page/Page";
import ModuleDetailPage from "./Module/Admin/Page/ModuleDetailPage";
import KanjiFormPage from "./Module/Admin/Page/KanjiFormPage";
import JukugoPage from "./Module/Admin/Page/JukugoPage";
import KanjiListPage from "./Module/Admin/Page/KanjiListPage";
import CategoryListPage from "./Module/Admin/Page/CategoryListPage";
import SemanticControlPage from "./Module/Admin/Page/SemanticControlPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/module" element={<ModulePage />} />
        <Route path="/module-detail" element={<LatihanPage />} />
        <Route path="/latihan" element={<LatihanPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/module-detail" element={<ModuleDetailPage />} />
        <Route path="/admin/kanji" element={<KanjiListPage />} />
        <Route path="/admin/kanji-form" element={<KanjiFormPage />} />
        <Route path="/admin/jukugo" element={<JukugoPage />} />
        <Route path="/admin/categories" element={<CategoryListPage />} />
        <Route path="/admin/semantic-control" element={<SemanticControlPage />} />
      </Routes>
    </Router>
  );
}

export default App;
