import React, { useContext } from "react";
import { Routes, Route, Link } from "react-router-dom";
import LoginIntro from "./pages/LoginIntro";
import Login from "./pages/Login";
import Homemenu from "./pages/Homemenu";
import Signup from "./pages/Signup";
import Logout from "./pages/Logout";
import Diarylist from "./pages/Diarylist";

function App() {
    const { isLoading } = useContext(UserContext); // 🔹 로딩 상태 가져오기

    return (
        <>
            <nav>
                <Link to="/">Home</Link> | <Link to="/login">Login</Link> |{" "}
                <Link to="/signup">Signup</Link> |{" "}
                <Link to="/diarylist">Diarylist</Link> |{" "}
                <Link to="/record1">Record1</Link> |{" "}
                <Link to="/logout">Logout</Link>
            </nav>

            <Routes>
                <Route path="/" element={<LoginIntro />} />
                <Route path="/login" element={<Login />} />
                <Route path="/homemenu" element={<Homemenu />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/diarylist" element={<Diarylist />} />
                <Route path="/record1" element={<Record1 />} />
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
                <Route path="/diary/:id" element={<ImageGen />} />{" "}
                {/* ** 06.01 추가 */}
                <Route path="/imagegen/:id" element={<ImageGen />} />{" "}
                {/* ** 06.01 추가 */}
                <Route path="/gallery" element={<Gallery />} />
            </Routes>
        </div>
    );
}

export default App;
