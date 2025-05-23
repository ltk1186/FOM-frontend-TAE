// src/pages/RecordDiary.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./RecordDiary.css";
import PreviousArrow from "../components/PreviousArrow";
import HomeButton from "../components/HomeButton";
import Settings from "../components/Settings";
import MicIcon from "../assets/images/group-70.svg";
import CalendarIcon from "../assets/images/group-90.svg";
import WriteIcon from "../assets/images/write.png";

const RecordDiary = () => {
  const navigate = useNavigate();
  const diaries = JSON.parse(localStorage.getItem("diaries") || "[]");

  return (
    <div className="diary-page">
      <div className="top-buttons">
        <PreviousArrow />
        <div className="right-buttons">
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
                navigate("/recordedit", { state: { id: diary.id } })
              }
            >
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
