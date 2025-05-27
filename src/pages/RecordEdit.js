// src/pages/RecordEdit.js
import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./RecordEdit.css";
import backgroundImage from "../assets/images/login-1.png";
import PreviousArrow from "../components/PreviousArrow";
import HomeButton from "../components/HomeButton";
import Settings from "../components/Settings";
import { UserContext } from "./UserContext";
import axios from "axios";

const RecordEdit = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();

    const diaryId = location.state?.id;
    const diaryTitle = location.state?.title || "";
    const diaryContent = location.state?.content || "";

    const [logTime, setLogTime] = useState("");
    const [logTitle, setLogTitle] = useState(diaryTitle);
    const [logContent, setLogContent] = useState(diaryContent);

    useEffect(() => {
        const createdAt = new Date();
        const formattedCreatedAt = `${createdAt.getFullYear()}-${String(
            createdAt.getMonth() + 1
        ).padStart(2, "0")}-${String(createdAt.getDate()).padStart(
            2,
            "0"
        )} ${String(createdAt.getHours()).padStart(2, "0")}:${String(
            createdAt.getMinutes()
        ).padStart(2, "0")}:${String(createdAt.getSeconds()).padStart(2, "0")}`;

        setLogTime(formattedCreatedAt);

        // 예외처리: state가 없다면 목록페이지로 이동
        if (!location.state) {
            navigate("/recorddiary");
        }
    }, [location.state, navigate]);

    const handleSave = async () => {
        if (!diaryId) {
            alert("수정할 일기의 ID정보가 없습니다.");
            return;
        }

        // 날짜 데이터를 ISO형식으로 넘기기 위해 다음과 같이 처리
        const isoLogTime = new Date(logTime).toISOString();

        try {
            await axios.put(
                `https://ms-fom-backend-hwcudkcfgedgcagj.eastus2-01.azurewebsites.net/api/temp_diary/${diaryId}`,
                {
                    title: logTitle,
                    content: logContent,
                    created_at: isoLogTime,
                }
            );
            navigate("/recorddiary");
        } catch (error) {
            console.error("DB 수정 오류:", error);
        }
    };
    const handleDelete = async () => {
        if (!diaryId) {
            console.log(diaryId);
            return;
        } else {
            console.log(diaryId);
        }

        try {
            await axios.delete(
                `https://ms-fom-backend-hwcudkcfgedgcagj.eastus2-01.azurewebsites.net/api/temp_diary/delete?temp_diary_id=${diaryId}`
            );
            navigate("/recorddiary");
        } catch (error) {
            console.error("DB 삭제 오류:", error);
        }
    };

    if (!user) {
        navigate("/login");
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
                    placeholder="제목을 입력하세요"
                />
                <textarea
                    className="log-content"
                    value={logContent}
                    onChange={(e) => setLogContent(e.target.value)}
                    placeholder="내용을 입력하세요"
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
