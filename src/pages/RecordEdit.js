// src/pages/RecordEdit.js
import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./RecordEdit.css";
import backgroundImage from "../assets/images/login-1.png";
import PreviousArrow from "../components/PreviousArrow";
import HomeButton from "../components/HomeButton";
import Settings from "../components/Settings";
import { UserContext } from "./UserContext";

const RecordEdit = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();
    const diaryId = location.state?.id;

    const [logTime, setLogTime] = useState("");
    const [logTitle, setLogTitle] = useState("");
    const [logContent, setLogContent] = useState("");

    useEffect(() => {
        const diaries = JSON.parse(localStorage.getItem("diaries") || "[]");
        const diary = diaries.find((d) => d.id === diaryId);

        if (diary) {
            setLogTime(diary.createdAt);
            setLogTitle(diary.title);
            setLogContent(diary.content);
        }
    }, [diaryId]);

    const handleSave = () => {
        const updatedDiary = {
            id: diaryId,
            createdAt: logTime,
            title: logTitle,
            content: logContent,
        };

        const diaries = JSON.parse(localStorage.getItem("diaries") || "[]");
        const updatedList = diaries.map((d) =>
            d.id === diaryId ? updatedDiary : d
        );
        localStorage.setItem("diaries", JSON.stringify(updatedList));
        navigate("/recorddiary");
    };

    const handleDelete = () => {
        const diaries = JSON.parse(localStorage.getItem("diaries") || "[]");
        const updatedList = diaries.filter((d) => d.id !== diaryId);
        localStorage.setItem("diaries", JSON.stringify(updatedList));
        navigate("/recorddiary");
    };
    if (!user) {
        //{user.email}통해 로그인 정보 참조
        navigate("/login"); // 로그인을 하지 않았다면 로그인 화면으로 이동
        return null;
    }
    return (
        <div
            className="record-edit-container"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div className="top-buttons">
                <PreviousArrow />
                <div className="right-buttons">
                    <Settings />
                    <HomeButton />
                </div>
            </div>

            <div className="record-edit-box">
                <div className="log-time">{logTime}</div>
                <input
                    className="log-title"
                    value={logTitle}
                    onChange={(e) => setLogTitle(e.target.value)}
                />
                <textarea
                    className="log-content"
                    value={logContent}
                    onChange={(e) => setLogContent(e.target.value)}
                />
            </div>

            <div className="record-edit-footer">
                <button className="delete-button" onClick={handleDelete}>
                    🗑
                </button>
                <button className="save-button" onClick={handleSave}>
                    저장하기
                </button>
            </div>
        </div>
    );
};

export default RecordEdit;
