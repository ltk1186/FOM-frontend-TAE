import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Record1 from "./pages/Record1";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Logout from "./pages/Logout";
import Diarylist from "./pages/Diarylist";

function App() {
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
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/diarylist" element={<Diarylist />} />
                <Route path="/record1" element={<Record1 />} />
                <Route path="/logout" element={<Logout />} />
            </Routes>
        </>
    );
}

export default App;
