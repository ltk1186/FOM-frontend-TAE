import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Record from "./pages/Record";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Logout from "./pages/Logout";
import Diarylist from "./pages/Diarylist";

function App() {
    return (
        <>
            <nav>
                <Link to="/">Home</Link> | <Link to="/login">Login</Link> |{" "}
                <Link to="/record">Record</Link> |{" "}
                <Link to="/signup">Signup</Link> |{" "}
                <Link to="/diarylist">Diarylist</Link> |{" "}
                <Link to="/logout">Logout</Link>
            </nav>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/record" element={<Record />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/diarylist" element={<Diarylist />} />
                <Route path="/logout" element={<Logout />} />
            </Routes>
        </>
    );
}

export default App;
