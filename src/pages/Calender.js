import React, { useEffect, useState, useContext } from "react";
import "./Calendar.css";
import HomeButton from "../components/HomeButton";
import PreviousArrow from "../components/PreviousArrow";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";

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

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

const CalendarPage = () => {
  const [emotionData, setEmotionData] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const { user, setIsLoading } = useContext(UserContext); // 🔹 로딩 컨텍스트 추가
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login"); // 로그인을 하지 않았다면 로그인 화면으로 이동
      return;
    }

    // 🔹 로딩 시작
    setIsLoading(true);

    // 예시용 하드코딩된 감정 데이터 (추후 API로 교체 시 유용)
    const fetchEmotionData = async () => {
      try {
        // 여기에 API 요청 로직이 들어갈 수 있음
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
      } finally {
        // 🔹 로딩 종료
        setIsLoading(false);
      }
    };

    fetchEmotionData();
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
      if (day >= 1 && day <= lastDate) {
        row.push(
          <td key={j}>
            <button onClick={() => alert(`${year}-${month + 1}-${day}`)}>
              {day}
            </button>
          </td>
        );
        hasValidDate = true;
      } else {
        row.push(
          <td key={j} aria-hidden="true">
            <span style={{ visibility: "hidden" }}>-</span>
          </td>
        );
      }
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

  return (
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
              <span className="color-dot" style={{ backgroundColor: color }} />
              {
                {
                  joy: "기쁨",
                  sadness: "슬픔",
                  anger: "분노",
                  fear: "공포",
                  disgust: "혐오",
                  shame: "불안",
                  surprise: "부러움",
                  confusion: "당황",
                  boredom: "따분",
                }[key]
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
