import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
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
import Gallery from "./pages/Gallery";

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
            <header className="header"> {/* 🔄 변경됨 */}</header>
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
                <Route path="/diarylist" element={<DiaryList />} />
                <Route path="/connselbot" element={<Connselbot />} />
                <Route path="/diary/:id" element={<ImageGen />} />
                <Route path="/imagegen/:id" element={<ImageGen />} />
                <Route path="/gallery" element={<Gallery />} />
            </Routes>
        </div>
    );
}

export default App;
