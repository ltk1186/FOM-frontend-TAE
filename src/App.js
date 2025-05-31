import React, { useContext } from "react";
import { Routes, Route, Link } from "react-router-dom";
import LoginIntro from "./pages/LoginIntro";
import Login from "./pages/Login";
import Homemenu from "./pages/Homemenu";
import Signup from "./pages/Signup";
import Logout from "./pages/Logout";
import RecordDiary from "./pages/RecordDiary";
import RecordGen from "./pages/RecordGen";
import RecordEdit from "./pages/RecordEdit";
import RecordSummary from "./pages/RecordSummary";
import Calendar from "./pages/Calendar";
import SettingsPage from "./pages/SettingsPage";

import { UserContext } from "./pages/UserContext"; // 🔹 추가
import LoadingOverlay from "./components/LoadingOverlay"; // 🔹 추가

function App() {
  const { isLoading } = useContext(UserContext); // 🔹 로딩 상태 가져오기

  return (
    <div className="App">
      {isLoading && <LoadingOverlay />} {/* 🔹 로딩 중일 때만 오버레이 */}
      <header className="header">
        <nav className="header-nav">
          <Link to="/" className="nav-item">
            LoginIntro
          </Link>
          <Link to="/login" className="nav-item">
            Login
          </Link>
          <Link to="/homemenu" className="nav-item">
            Homemenu
          </Link>
          <Link to="/signup" className="nav-item">
            Signup
          </Link>
          <Link to="/logout" className="nav-item">
            Logout
          </Link>
          <Link to="/recorddiary" className="nav-item">
            RecordDiary
          </Link>
          <Link to="/recordgen" className="nav-item">
            RecordGen
          </Link>
          <Link to="/recordedit" className="nav-item">
            RecordEdit
          </Link>
          <Link to="/recordsummary" className="nav-item">
            RecordSummary
          </Link>
          <Link to="/calendar" className="nav-item">
            Calendar
          </Link>
          <Link to="/settings" className="nav-item">
            SettingsPage
          </Link>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<LoginIntro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/homemenu" element={<Homemenu />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/recorddiary" element={<RecordDiary />} />
        <Route path="/recordgen" element={<RecordGen />} />
        <Route path="/recordedit" element={<RecordEdit />} />
        <Route path="/recordsummary" element={<RecordSummary />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </div>
  );
}

export default App;
