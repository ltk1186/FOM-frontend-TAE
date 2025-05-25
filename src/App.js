import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import LoginIntro from "./pages/LoginIntro"; // 추가
import Login from "./pages/Login";
import Homemenu from "./pages/Homemenu";
import Signup from "./pages/Signup";
import Logout from "./pages/Logout";
<<<<<<< Updated upstream
import RecordDiary from "./pages/RecordDiary"; // 추가
import RecordGen from "./pages/RecordGen"; // 추가
import RecordEdit from "./pages/RecordEdit"; // 추가
import RecordSummary from "./pages/RecordSummary"; // 추가
import Calender from "./pages/Calender"; // DiaryList -> Calender
import SettingsPage from "./pages/SettingsPage"; // 추가

function App() {
    return (
        // 일생님 코드
        // <>
        //   <nav>
        //     <Link to="/">Home</Link> | <Link to="/login">Login</Link> |{" "}
        //     <Link to="/signup">Signup</Link> | <Link to="/calender">Calender</Link>{" "}
        //     | <Link to="/record1">Record1</Link> | <Link to="/logout">Logout</Link>
        //   </nav>

        //   <Routes>
        //     <Route path="/" element={<Home />} />
        //     <Route path="/login" element={<Login />} />
        //     <Route path="/signup" element={<Signup />} />
        //     <Route path="/calender" element={<Calender />} />
        //     <Route path="/record1" element={<Record1 />} />
        //     <Route path="/logout" element={<Logout />} />
        //   </Routes>
        // </>

        <div className="App">
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
                    <Link to="/calender" className="nav-item">
                        Calender
                    </Link>
                    <Link to="/settings" className="nav-item">
                        SettingsPage
                    </Link>
                </nav>
            </header>
=======
import Diarylist from "./pages/Diarylist";
import Homemenu from "./pages/Homemenu";

function App() {
    return (
        <>
            <nav>
                <Link to="/">Home</Link> | <Link to="/login">Login</Link> |{" "}
                <Link to="/signup">Signup</Link> |{" "}
                <Link to="/diarylist">Diarylist</Link> |{" "}
                <Link to="/record1">Record1</Link> |{" "}
                <Link to="/homemenu">Homemenu</Link> |{" "}
                <Link to="/logout">Logout</Link>
            </nav>
>>>>>>> Stashed changes

            <Routes>
                <Route path="/" element={<LoginIntro />} />
                <Route path="/login" element={<Login />} />
                <Route path="/homemenu" element={<Homemenu />} />
                <Route path="/signup" element={<Signup />} />
<<<<<<< Updated upstream
=======
                <Route path="/diarylist" element={<Diarylist />} />
                <Route path="/record1" element={<Record1 />} />
                <Route path="/homemenu" element={<Homemenu />} />
>>>>>>> Stashed changes
                <Route path="/logout" element={<Logout />} />
                <Route path="/recorddiary" element={<RecordDiary />} />
                <Route path="/recordgen" element={<RecordGen />} />
                <Route path="/recordedit" element={<RecordEdit />} />{" "}
                <Route path="/recordsummary" element={<RecordSummary />} />
                <Route path="/calender" element={<Calender />} />
                <Route path="/settings" element={<SettingsPage />} />{" "}
            </Routes>
        </div>
    );
}

export default App;
