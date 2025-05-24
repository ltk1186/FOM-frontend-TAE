// src/pages/SettingsPage.js
import React, { useContext } from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";

const SettingsPage = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    if (!user) {
        //{user.email}통해 로그인 정보 참조
        navigate("/login"); // 로그인을 하지 않았다면 로그인 화면으로 이동
        return null;
    }
    return (
        <div style={{ padding: "50px", textAlign: "center" }}>
            <h2>⚙️ 설정 화면 (임시)</h2>
            <p>여기는 설정 페이지입니다. 추후 구현 예정입니다.</p>
        </div>
    );
};

export default SettingsPage;
