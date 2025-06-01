import React, { useEffect, useState, useContext } from "react";
import "./Calendar.css";
import HomeButton from "../components/HomeButton";
import Settings from "../components/Settings";
import PreviousArrow from "../components/PreviousArrow";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
import Smiley from "../assets/images/image-50.png";

const EMOTION_COLORS = {
  joy: "#FFD93D",
  sadness: "#5DA2D5",
  anger: "#FF6B6B",
  fear: "#FFA630",
  disgust: "#6DC67C",
  shame: "#A67BC1",
  surprise: "#F084C2",
  confusion: "#8E8E8E",
  boredom: "#BBBBBB",
};

const EMOTION_KR = {
  joy: "기쁨",
  sadness: "슬픔",
  anger: "분노",
  fear: "공포",
  disgust: "혐오",
  shame: "불안",
  surprise: "부러움",
  confusion: "당황",
  boredom: "따분",
};

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

const CalendarPage = () => {
  const { user, setIsLoading } = useContext(UserContext);
  const navigate = useNavigate();

  const [emotionData, setEmotionData] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [diaryPopupContent, setDiaryPopupContent] = useState([]);
  const [originalDiaryContent, setOriginalDiaryContent] = useState([]);

  const [isConsulting, setIsConsulting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draftText, setDraftText] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    setIsLoading(true);
    setEmotionData([
      {
        joy: 30,
        sadness: 10,
        anger: 5,
        fear: 10,
        disgust: 5,
        shame: 10,
        surprise: 10,
        confusion: 10,
        boredom: 10,
      },
      {
        joy: 40,
        sadness: 25,
        anger: 10,
        fear: 15,
        disgust: 10,
        shame: 15,
        surprise: 10,
        confusion: 15,
        boredom: 15,
      },
      {
        joy: 10,
        sadness: 10,
        anger: 20,
        fear: 10,
        disgust: 10,
        shame: 10,
        surprise: 10,
        confusion: 10,
        boredom: 10,
      },
      {
        joy: 25,
        sadness: 15,
        anger: 5,
        fear: 10,
        disgust: 10,
        shame: 5,
        surprise: 10,
        confusion: 10,
        boredom: 10,
      },
      {
        joy: 10,
        sadness: 30,
        anger: 10,
        fear: 10,
        disgust: 10,
        shame: 10,
        surprise: 10,
        confusion: 5,
        boredom: 5,
      },
      {
        joy: 15,
        sadness: 15,
        anger: 10,
        fear: 10,
        disgust: 10,
        shame: 10,
        surprise: 10,
        confusion: 10,
        boredom: 10,
      },
      {
        joy: 20,
        sadness: 10,
        anger: 10,
        fear: 10,
        disgust: 10,
        shame: 10,
        surprise: 10,
        confusion: 10,
        boredom: 10,
      },
    ]);
    setIsLoading(false);
  }, [user, navigate, setIsLoading]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const calendarRows = [];
  let day = 1 - firstDay;
  for (let i = 0; i < 6; i++) {
    const row = [];
    let hasValidDate = false;

    for (let j = 0; j < 7; j++) {
      const valid = day >= 1 && day <= lastDate;
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;
      row.push(
        <td key={j}>
          {valid ? (
            <button onClick={() => openPopup(dateStr)}>{day}</button>
          ) : (
            <span style={{ visibility: "hidden" }}>-</span>
          )}
        </td>
      );
      if (valid) hasValidDate = true;
      day++;
    }

    if (hasValidDate) {
      calendarRows.push(<tr key={i}>{row}</tr>);
    }
  }

  const changeMonth = (offset) => {
    const newDate = new Date(year, month + offset, 1);
    setCurrentDate(newDate);
  };

  const openPopup = (dateStr) => {
    setSelectedDate(dateStr);
    setIsConsulting(false);
    setIsEditing(false);
    const diary = [{ content: "휴 힘들다. 졸리다... (데모 텍스트)" }];
    setDiaryPopupContent(diary);
    setOriginalDiaryContent(diary);
  };

  const handleMascotClick = () => {
    if (!selectedDate) return;
    setIsConsulting(true);
    setIsEditing(false);
    setDiaryPopupContent([
      {
        content: "오늘의 일기를 읽으며 당신의 하루가 고요하게...",
      },
    ]);
  };

  const handleBack = () => {
    setIsConsulting(false);
    setDiaryPopupContent(originalDiaryContent);
  };

  const handleDelete = () => console.log("❌ 삭제");
  const handleSave = () => console.log("💾 저장");

  const startEdit = () => {
    if (isConsulting) return;
    setDraftText(diaryPopupContent[0]?.content || "");
    setIsEditing(true);
  };

  const completeEdit = () => {
    setDiaryPopupContent([{ content: draftText }]);
    setOriginalDiaryContent([{ content: draftText }]);
    setIsEditing(false);
  };

  return (
    <>
      <div className="calendar-page">
        <div className="calendar-header">
          <PreviousArrow />
          <div className="calendar-title">
            <button className="month-btn" onClick={() => changeMonth(-1)}>
              &lt;
            </button>
            {year}년 {month + 1}월
            <button className="month-btn" onClick={() => changeMonth(1)}>
              &gt;
            </button>
          </div>
          <Settings />
          <HomeButton />
        </div>

        <div className="calendar-table">
          <table>
            <thead>
              <tr>
                {DAYS.map((d, i) => (
                  <th key={i}>{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>{calendarRows}</tbody>
          </table>
        </div>

        <div className="emotion-chart">
          <div className="chart-title">일주일의 나의 감정</div>
          <div className="chart-bars">
            {emotionData.map((day, index) => {
              let offset = 0;
              return (
                <div key={index} className="chart-column">
                  {Object.entries(day).map(([emotion, value]) => {
                    const bar = (
                      <div
                        key={emotion}
                        className="bar"
                        style={{
                          backgroundColor: EMOTION_COLORS[emotion],
                          height: `${value}px`,
                          bottom: `${offset}px`,
                        }}
                      />
                    );
                    offset += value;
                    return bar;
                  })}
                  <div className="day-label">{DAYS[index]}</div>
                </div>
              );
            })}
          </div>
          <div className="legend">
            {Object.entries(EMOTION_COLORS).map(([key, color]) => (
              <div key={key} className="legend-item">
                <span
                  className="color-dot"
                  style={{ backgroundColor: color }}
                />
                {EMOTION_KR[key]}
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedDate && (
        <div className="diary-popup-overlay">
          <div className="diary-popup">
            <button
              className="popup-close-button"
              onClick={() => setSelectedDate(null)}
            >
              ×
            </button>

            <div className="popup-header">
              {isConsulting && (
                <button className="popup-back-button" onClick={handleBack}>
                  &lt;
                </button>
              )}
              <div className="popup-title">{selectedDate}</div>
              {isConsulting && (
                <div className="popup-subtitle">포미의 상담 보고서</div>
              )}
            </div>

            <div className="popup-content" onClick={startEdit}>
              {isConsulting || !isEditing ? (
                diaryPopupContent.map(({ content }, i) => (
                  <p key={i}>{content}</p>
                ))
              ) : (
                <textarea
                  className="popup-textarea"
                  value={draftText}
                  onChange={(e) => setDraftText(e.target.value)}
                />
              )}
            </div>

            <div
              className="popup-bottom-row"
              style={isConsulting ? { justifyContent: "center" } : undefined}
            >
              {isConsulting ? (
                <button
                  className="popup-button save"
                  onClick={() => console.log("▶ 더 상담하기")}
                >
                  더 상담하기
                </button>
              ) : (
                <>
                  <button
                    className="popup-button delete"
                    onClick={handleDelete}
                  >
                    삭제하기
                  </button>
                  <img
                    src={Smiley}
                    alt="마스코트"
                    className="popup-smiley"
                    onClick={handleMascotClick}
                  />
                  <button
                    className="popup-button save"
                    onClick={isEditing ? completeEdit : handleSave}
                  >
                    {isEditing ? "완료" : "저장하기"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CalendarPage;
