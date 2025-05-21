// src/pages/Home.js
import React, { useContext } from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    // 로그인을 하지 않았다면 로그인 화면으로 이동
    if (!user) {
        navigate("/login");
        return null;
    }

    return (
        <div>
            <h2>홈 화면 🏠</h2>
            <p>
                <strong>{user.email}</strong>님 환영합니다! 🎉
            </p>
            {/* 로그인한 사용자 정보 표시 */}
        </div>
    );
};

export default Home;
