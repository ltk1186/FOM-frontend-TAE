// src/pages/RecordDiary.js
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./RecordDiary.css";
import PreviousArrow from "../components/PreviousArrow";
import HomeButton from "../components/HomeButton";
import Settings from "../components/Settings";
import MicIcon from "../assets/images/group-70.svg";
import CalendarIcon from "../assets/images/group-90.svg";
import WriteIcon from "../assets/images/write.png";
import { UserContext } from "./UserContext";

const RecordDiary = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const diaries = JSON.parse(localStorage.getItem("diaries") || "[]");

  const toggleDeleteMode = () => {
    setIsDeleteMode((prev) => !prev);
    setSelectedIds([]);
  };

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    const updated = diaries.filter((d) => !selectedIds.includes(d.id));
    localStorage.setItem("diaries", JSON.stringify(updated));

    // 📝 TODO: DB 연동 시 아래 코드 활성화
    /*
        for (const id of selectedIds) {
            try {
                await fetch(`https://<YOUR_BACKEND_URL>/api/temp_diary/${id}`, {
                    method: "DELETE",
                });
            } catch (error) {
                console.error("DB 삭제 실패:", error);
            }
        }
        */

    setSelectedIds([]);
    setIsDeleteMode(false);
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="diary-page">
      <div className="top-buttons">
        <PreviousArrow />
        {isDeleteMode && (
          <div className="delete-controls">
            <button className="delete-count-button" onClick={handleBulkDelete}>
              {selectedIds.length}개 항목 삭제
            </button>
            <button className="cancel-delete-button" onClick={toggleDeleteMode}>
              ❌
            </button>
          </div>
        )}
        <div className="right-buttons">
          <button className="trash-button" onClick={toggleDeleteMode}>
            🗑
          </button>
          <Settings />
          <HomeButton />
        </div>
      </div>

      <div className="diary-list">
        {diaries.length === 0 ? (
          <p className="empty-message">작성된 일지가 없습니다.</p>
        ) : (
          diaries.map((diary) => (
            <div
              className="diary-card"
              key={diary.id}
              onClick={() =>
                !isDeleteMode &&
                navigate("/recordedit", {
                  state: { id: diary.id },
                })
              }
            >
              {isDeleteMode && (
                <button
                  className={`select-circle ${
                    selectedIds.includes(diary.id) ? "selected" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(diary.id);
                  }}
                />
              )}
              <div className="diary-date">{diary.createdAt}</div>
              <div className="diary-title">{diary.title}</div>
              <div className="diary-content">{diary.content}</div>
            </div>
          ))
        )}
      </div>

      <button
        className="add-diary-btn"
        onClick={() => navigate("/recordsummary")}
      >
        일기 완성하기
      </button>

      <div className="bottom-icons">
        <img
          src={WriteIcon}
          alt="텍스트 작성"
          className="fab-button"
          onClick={() => navigate("/recordgen")}
        />
        <img
          src={MicIcon}
          alt="음성 입력"
          className="fab-button"
          onClick={() => navigate("/recordgen", { state: { mic: true } })}
        />
        <img
          src={CalendarIcon}
          alt="캘린더"
          className="fab-button"
          onClick={() => navigate("/calender")}
        />
      </div>
    </div>
  );
};

export default RecordDiary;
