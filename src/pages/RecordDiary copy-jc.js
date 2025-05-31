// src/pages/RecordDiary.js
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./RecordDiary.css";
import PreviousArrow from "../components/PreviousArrow";
import HomeButton from "../components/HomeButton";
import Settings from "../components/Settings";
import MicIcon from "../assets/images/group-70.svg";
import CalendarIcon from "../assets/images/group-90.svg";
import WriteIcon from "../assets/images/write.png";
import { UserContext } from "./UserContext";
import axios from "axios";

const RecordDiary = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [diaries, setDiaries] = useState([]);

  useEffect(() => {
    const fetchDiaries = async (userID) => {
      try {
        const response = await axios.get(
          `https://ms-fom-backend-hwcudkcfgedgcagj.eastus2-01.azurewebsites.net/api/temp_diary/read?user_id=${userID}`
        );
        setDiaries(response.data);
        console.log("✅ diaries 데이터 가져오기 성공:", response.data);
      } catch (error) {
        console.error(
          "❌ diaries API 에러:",
          error.response?.data || error.message
        );
      }
    };

    if (user?.user_id) {
      fetchDiaries(user.user_id);
    } else {
      console.warn("⚠️ 사용자 아이디가 없습니다.");
    }
  }, [user?.user_id]);

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
    for (const id of selectedIds) {
      const diaryId = id; // ✅ RecordEdit.js와 동일한 명명 방식 사용
      try {
        await axios.delete(
          `https://ms-fom-backend-hwcudkcfgedgcagj.eastus2-01.azurewebsites.net/api/temp_diary/delete?temp_diary_id=${diaryId}`
        );
        console.log(`✅ ID ${diaryId} 삭제 성공`);
      } catch (error) {
        console.error(`❌ ID ${diaryId} 삭제 실패:`, error);
      }
    }

    // 삭제 후 목록 재조회
    try {
      const response = await axios.get(
        `https://ms-fom-backend-hwcudkcfgedgcagj.eastus2-01.azurewebsites.net/api/temp_diary/read?user_id=${user.user_id}`
      );
      setDiaries(response.data);
    } catch (error) {
      console.error("❌ diaries 재조회 실패:", error);
    }

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
              key={diary.temp_diary_id}
              onClick={() =>
                !isDeleteMode &&
                navigate("/recordedit", {
                  state: {
                    id: diary.temp_diary_id,
                    title: diary.title,
                    content: diary.content,
                  },
                })
              }
            >
              {isDeleteMode && (
                <button
                  className={`select-circle ${
                    selectedIds.includes(diary.temp_diary_id) ? "selected" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(diary.temp_diary_id);
                  }}
                />
              )}
              <div className="diary-date">
                {diary.created_at
                  ? new Date(diary.created_at).toLocaleString("ko-KR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "날짜 없음"}
              </div>
              <div className="diary-title">{diary.title}</div>
              <div className="diary-content">{diary.content}</div>
            </div>
          ))
        )}
      </div>

      <button
        className="add-diary-btn"
        onClick={() => navigate("/recordsummary", { state: { diaries } })}
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
