// src/pages/RecordEdit.js
import React, { useState } from "react";
import "./RecordEdit.css";
import backgroundImage from "../assets/images/login-1.png";
import PreviousArrow from "../components/PreviousArrow";
import HomeButton from "../components/HomeButton";
import Settings from "../components/Settings";

const RecordEdit = () => {
    const [logTime, setLogTime] = useState("2025년 5월 20일 (화) 14:00");
    const [logTitle, setLogTitle] = useState("백수지만 오늘도 바쁜 하루");
    const [logContent, setLogContent] = useState(
        "여기는 드롭다운하면 일기 상세가 쫙 나온다\n여기는 드롭다운하면 일기 상세가 쫙 나온다\n여기는 드롭다운하면 일기 상세가 쫙 나온다\n\n여기는 드롭다운하면 일기 상세가 쫙 나온다\n여기는 드롭다운하면 일기 상세가 쫙 나온다\n\n여기는 드롭다운하면 일기 상세가 쫙 나온다여기는 드롭다운하면 일기 상세가 쫙 나온다"
    );

    const handleSave = () => {
        console.log("저장:", { logTime, logTitle, logContent });
    };

    const handleDelete = () => {
        console.log("삭제:", { logTime, logTitle, logContent });
    };

    return (
        <div
            className="record-edit-container"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            {/* 상단 버튼 영역 */}
            <div className="top-buttons">
                <PreviousArrow />
                <div className="right-buttons">
                    <Settings />
                    <HomeButton />
                </div>
            </div>

            {/* 텍스트 박스 */}
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

            {/* 하단 버튼 */}
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
