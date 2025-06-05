import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./EmotionResult.css";
const emotions = [
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
const EmotionResult = () => {
    const [maxEmotion, setMaxEmotion] = useState({});

    // 각 감정에 대응하는 색상
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

    // 데이터를 가져오는 useEffect
    useEffect(() => {
        const fetchEmotionData = async () => {
            try {
                const response = await axios.get(
                    "https://fomeapi.eastus2.cloudapp.azure.com/feeling/"
                );
                const data = response.data;

                // 최대값과 해당 감정 찾기
                const maxValue = Math.max(...data);
                const maxIndex = data.indexOf(maxValue);

                setMaxEmotion({
                    type: emotions[maxIndex],
                    percentage: maxValue,
                });
            } catch (error) {
                console.error("Error fetching emotion data:", error);
            }
        };

        fetchEmotionData();
    }, []);

    const emotionStyle = {
        color: maxEmotion.type ? emotionColors[maxEmotion.type] : "#000", // 감정에 따라 글자 색 결정
    };

    return (
        <div className={styles["emotion-result"]}>
            {maxEmotion.type ? (
                <>
                    <span
                        className={styles["emotion-type"]}
                        style={emotionStyle}
                    >
                        <b>{maxEmotion.type}</b>
                    </span>
                    <span className={styles["emotion-percentage"]}>
                        이 {maxEmotion.percentage}%로 가장 높습니다.
                    </span>
                </>
            ) : (
                <span>데이터를 가져오는 중...</span>
            )}
        </div>
    );
};

export default EmotionResult;
