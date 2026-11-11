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
import ConfigPage from "./Module/Admin/Page/ConfigPage";
import ReviewQuizAdminPage from "./Module/Admin/Page/ReviewQuizAdminPage";
import ReviewQuizQuestionsAdminPage from "./Module/Admin/Page/ReviewQuizQuestionsAdminPage";
import ReviewQuizPage from "./Module/ReviewQuiz/Page/ReviewQuizPage";

import AboutPage from "./Module/About/Page/Page";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/module" element={<ModulePage />} />
        <Route path="/module-detail" element={<LatihanPage />} />
        <Route path="/latihan" element={<LatihanPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/review-quiz/:id" element={<ReviewQuizPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/module-detail" element={<ModuleDetailPage />} />
        <Route path="/admin/kanji" element={<KanjiListPage />} />
        <Route path="/admin/kanji-form" element={<KanjiFormPage />} />
        <Route path="/admin/jukugo" element={<JukugoPage />} />
        <Route path="/admin/categories" element={<CategoryListPage />} />
        <Route path="/admin/semantic-control" element={<SemanticControlPage />} />
        <Route path="/admin/config" element={<ConfigPage />} />
        <Route path="/admin/review-quiz" element={<ReviewQuizAdminPage />} />
        <Route path="/admin/review-quiz/:id/questions" element={<ReviewQuizQuestionsAdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
