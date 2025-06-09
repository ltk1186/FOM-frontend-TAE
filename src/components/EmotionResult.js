import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./EmotionResult.css";

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
                    "https://fombackend.azurewebsites.net/api/feeling/"
                    // "https://fomeapi.eastus2.cloudapp.azure.com/feeling/"
                );
                const data = response.data;

                // 한글 감정으로 매핑
                const emotionMapping = {
                    joy: "기쁨",
                    sadness: "슬픔",
                    anger: "분노",
                    fear: "공포",
                    disgust: "혐오",
                    anxiety: "불안",
                    envy: "부러움",
                    bewilderment: "당황",
                    boredom: "따분",
                };

                const mappedData = Object.entries(data).reduce(
                    (result, [key, value]) => {
                        const koreanEmotion = emotionMapping[key];
                        if (koreanEmotion) result[koreanEmotion] = value;
                        return result;
                    },
                    {}
                );

                const maxEntry = Object.entries(mappedData).reduce(
                    (max, current) => (current[1] > max[1] ? current : max),
                    ["", 0]
                );

                setMaxEmotion({
                    type: maxEntry[0],
                    percentage: maxEntry[1],
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
