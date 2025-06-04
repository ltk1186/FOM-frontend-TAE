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
import Connselbot from "./pages/Connselbot"; // 추가
import DiaryList from "./pages/DiaryList"; // ** 06.01 추가
import ImageGen from "./pages/ImageGen"; // ** 06.01 추가

import { UserContext } from "./pages/UserContext"; // 🔹 추가
import LoadingOverlay from "./components/LoadingOverlay"; // 🔹 추가

import styles from "./App.module.css"; // 🔄 변경됨

function App() {
  const { isLoading } = useContext(UserContext); // 🔹 로딩 상태 가져오기

  return (
    <div className={styles.App}>
      {" "}
      {/* 🔄 변경됨 */}
      {isLoading && <LoadingOverlay />} {/* 🔹 로딩 중일 때만 오버레이 */}
      <header className={styles.header}>
        {" "}
        {/* 🔄 변경됨 */}
        <nav className={styles["header-nav"]}>
          {" "}
          {/* 🔄 변경됨 */}
          <Link to="/" className={styles["nav-item"]}>
            {" "}
            {/* 🔄 변경됨 */}
            LoginIntro
          </Link>
          <Link to="/login" className={styles["nav-item"]}>
            {" "}
            {/* 🔄 변경됨 */}
            Login
          </Link>
          <Link to="/homemenu" className={styles["nav-item"]}>
            {" "}
            {/* 🔄 변경됨 */}
            Homemenu
          </Link>
          <Link to="/signup" className={styles["nav-item"]}>
            {" "}
            {/* 🔄 변경됨 */}
            Signup
          </Link>
          <Link to="/logout" className={styles["nav-item"]}>
            {" "}
            {/* 🔄 변경됨 */}
            Logout
          </Link>
          <Link to="/recorddiary" className={styles["nav-item"]}>
            {" "}
            {/* 🔄 변경됨 */}
            RecordDiary
          </Link>
          <Link to="/recordgen" className={styles["nav-item"]}>
            {" "}
            {/* 🔄 변경됨 */}
            RecordGen
          </Link>
          <Link to="/recordedit" className={styles["nav-item"]}>
            {" "}
            {/* 🔄 변경됨 */}
            RecordEdit
          </Link>
          <Link to="/recordsummary" className={styles["nav-item"]}>
            {" "}
            {/* 🔄 변경됨 */}
            RecordSummary
          </Link>
          <Link to="/calendar" className={styles["nav-item"]}>
            {" "}
            {/* 🔄 변경됨 */}
            Calendar
          </Link>
          <Link to="/connselbot" className={styles["nav-item"]}>
            {" "}
            {/* 🔄 변경됨 */}
            Connselbot
          </Link>
          <Link to="/settings" className={styles["nav-item"]}>
            {" "}
            {/* 🔄 변경됨 */}
            SettingsPage
          </Link>
          <Link to="/diarylist" className={styles["nav-item"]}>
            {" "}
            {/* 🔄 변경됨 */}
            DiaryList
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
        <Route path="/diarylist" element={<DiaryList />} />{" "}
        <Route path="/connselbot" element={<Connselbot />} />
        {/* ** 06.01 추가 */}
        <Route path="/diary/:id" element={<ImageGen />} /> {/* ** 06.01 추가 */}
        <Route path="/imagegen/:id" element={<ImageGen />} />{" "}
        {/* ** 06.01 추가 */}
      </Routes>
    </div>
  );
}

export default App;
