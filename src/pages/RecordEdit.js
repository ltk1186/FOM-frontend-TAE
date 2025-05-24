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

  const handleSave = async () => {
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

    // 👉 TODO: DB 연동 시 아래 코드 활성화
    /*
        try {
            await fetch(`https://<YOUR_BACKEND_URL>/api/temp_diary/${diaryId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: updatedDiary.title,
                    content: updatedDiary.content,
                    created_at: updatedDiary.createdAt,
                }),
            });
        } catch (error) {
            console.error("DB 수정 오류:", error);
        }
        */

    navigate("/recorddiary");
  };

  const handleDelete = async () => {
    const diaries = JSON.parse(localStorage.getItem("diaries") || "[]");
    const updatedList = diaries.filter((d) => d.id !== diaryId);
    localStorage.setItem("diaries", JSON.stringify(updatedList));

    // 👉 TODO: DB 연동 시 아래 코드 활성화
    /*
        try {
            await fetch(`https://<YOUR_BACKEND_URL>/api/temp_diary/${diaryId}`, {
                method: "DELETE",
            });
        } catch (error) {
            console.error("DB 삭제 오류:", error);
        }
        */

    navigate("/recorddiary");
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
