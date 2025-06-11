import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import styles from "../pages/Homemenu.module.css";
import { UserContext } from "../pages/UserContext";

const emotionTypes = [
  "기쁨",
  "슬픔",
  "분노",
  "공포",
  "혐오",
  "불안",
  "부러움",
  "당황",
  "따분",
];

const emotionColors = {
  기쁨: "#ffcc00",
  슬픔: "#0060BA",
  분노: "#FF5640",
  공포: "#656565",
  혐오: "#009200",
  불안: "#FF8801",
  부러움: "#2EC19C",
  당황: "#FF83EA",
  따분: "#A19CA0",
};

const emotionKeys = [
  "joy",
  "sadness",
  "anger",
  "fear",
  "disgust",
  "anxiety",
  "envy",
  "bewilderment",
  "boredom",
];

const WeeklyCalendar = ({ onDateEmotionClick }) => {
  const { user } = useContext(UserContext);
  const [weekDays, setWeekDays] = useState([]);

  useEffect(() => {
    const getLastSevenDays = () => {
      const days = [];
      const today = new Date();
      for (let i = 7; i >= 1; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        const formattedDate = date.getDate().toString().padStart(2, "0");
        const dateStr = date.toISOString().slice(0, 10); // YYYY-MM-DD
        days.push({
          day: formattedDate,
          dateStr,
          hasActivity: false,
          emotion: "",
        });
      }
      return days;
    };

    const fetchFeelings = async () => {
      const today = new Date();

      const startDate = new Date(today);
      startDate.setDate(today.getDate() - 7);
      const endDate = new Date(today);
      endDate.setDate(today.getDate() - 1);

      const getYYYYMMDD = (date) =>
        `${String(date.getFullYear()).slice(2)}${String(
          date.getMonth() + 1
        ).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;

      const firstDay = getYYYYMMDD(startDate);
      const lastDay = getYYYYMMDD(endDate);
      try {
        if (!user || !user.user_id) return;

        const response = await axios.get(
          "https://fombackend.azurewebsites.net/api/emotion/read",
          {
            params: {
              user_id: user.user_id,
              selected_date: `${firstDay}${lastDay}`,
            },
          }
        );
        const feelingsArr = response.data;
        const feelingDict = {};
        feelingsArr.forEach((f) => {
          if (f.created_at) {
            const d = f.created_at.slice(0, 10);
            feelingDict[d] = f;
          }
        });

        const initialDays = getLastSevenDays();

        const updatedWeekDays = initialDays.map((dayInfo) => {
          const feelingObj = feelingDict[dayInfo.dateStr];
          if (feelingObj) {
            // 감정 수치 중 최댓값 인덱스 구하기
            const values = emotionKeys.map((key) => feelingObj[key] ?? 0);
            const maxVal = Math.max(...values);
            if (maxVal === 0) {
              // 기록은 있는데 전부 0 (거의 없겠지만)
              return {
                ...dayInfo,
                hasActivity: false,
                emotion: "",
              };
            }
            const topIdx = values.indexOf(maxVal);
            return {
              ...dayInfo,
              hasActivity: true,
              emotion: emotionTypes[topIdx],
            };
          } else {
            return { ...dayInfo, hasActivity: false, emotion: "" };
          }
        });
        setWeekDays(updatedWeekDays);
      } catch (error) {
        console.error("Error fetching feelings:", error);
      }
    };

    const initialDays = getLastSevenDays();
    setWeekDays(initialDays);
    fetchFeelings();
  }, [user]);

  return (
    <div className={styles["weekly-calendar-container"]}>
      <div className={styles["weekly-calendar-frame"]}>
        <div className={styles["calendar-background-top"]}></div>
        <div className={styles["calendar-background-bottom"]}></div>
        <div className={styles["calendar-header"]}>
          <h3>주간 달력</h3>
        </div>
        <div className={styles["weekly-dates"]}>
          {weekDays.map((day, index) => (
            <div key={index} className={styles["date-component"]}>
              <div className={styles["date-number"]}>{day.day}</div>
              <div
                className={`${styles["date-indicator"]} ${
                  day.hasActivity ? styles.active : ""
                }`}
                style={{
                  backgroundColor: day.hasActivity
                    ? emotionColors[day.emotion]
                    : "#e4e4e4",
                }}
                onClick={() => {
                  if (onDateEmotionClick && day.hasActivity) {
                    onDateEmotionClick({
                      day: day.day,
                      emotion: day.emotion,
                    });
                  }
                }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeeklyCalendar;
