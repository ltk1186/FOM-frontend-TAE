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

const WeeklyCalendar = () => {
    const { user } = useContext(UserContext);
    const [weekDays, setWeekDays] = useState([]);

    useEffect(() => {
        // Helper function to generate dates for the last 7 days
        const getLastSevenDays = () => {
            const days = [];
            const today = new Date();
            for (let i = 7; i >= 1; i--) {
                const date = new Date();
                date.setDate(today.getDate() - i); // Calculate the date
                const formattedDate = date
                    .getDate()
                    .toString()
                    .padStart(2, "0"); // Format as DD
                days.push({
                    day: formattedDate, // Add formatted date
                    hasActivity: false, // Default value until fetched
                    emotion: "", // Placeholder for emotion
                });
            }
            return days;
        };

        // FastAPI에서 감정 데이터를 가져옵니다
        const fetchFeelings = async () => {
            try {
                if (!user || !user.user_id) return;

                const response = await axios.post(
                    "https://fomeapi.eastus2.cloudapp.azure.com/myfeeling/",
                    {
                        user_id: user.user_id,
                    }
                );
                const feelings = response.data; // FastAPI에서 반환된 데이터

                const initialDays = getLastSevenDays();

                const updatedWeekDays = initialDays.map((day, index) => ({
                    ...day,
                    hasActivity: true,
                    emotion: emotionTypes[feelings[index] - 1], // FastAPI 인덱스 값은 1 시작
                }));

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
                            <div className={styles["date-number"]}>
                                {day.day}
                            </div>
                            <div
                                className={`${styles["date-indicator"]} ${
                                    day.hasActivity ? styles.active : ""
                                }`}
                                style={{
                                    backgroundColor: emotionColors[day.emotion],
                                }} // 색상 적용
                            ></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WeeklyCalendar;
