import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
import styles from "./Homemenu.module.css";
import Settings from "../components/Settings";
import PreviousArrow from "../components/PreviousArrow";
import homemenu1 from "../assets/images/homemenu1.png";
import homemenu2 from "../assets/images/homemenu2.png";
import homemenu3 from "../assets/images/homemenu3.png";
import homemenu4 from "../assets/images/homemenu4.png";
import homemenu5 from "../assets/images/homemenu6.png";
import homemenu6 from "../assets/images/homemenu5.png";
import EmotionResult from "../components/EmotionResult";
import WeeklyCalendar from "../components/WeeklyCalendar";

// 감정 색상 정보를 추가합니다
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

const menuItems = [
    {
        id: 1,
        title: "일기작성",
        image: homemenu1,
        className: "diary-icon",
        route: "/recorddiary",
    },
    {
        id: 2,
        title: "캐릭터",
        image: homemenu2,
        className: "character-icon",
        route: "/login",
    },
    {
        id: 3,
        title: "상담받기",
        image: homemenu3,
        className: "counseling-icon",
        route: "/connselbot",
    },
    {
        id: 4,
        title: "나의 감정 이미지",
        image: homemenu4,
        className: "emotion-icon",
        route: "/gallery",
    },
    {
        id: 5,
        title: "목표",
        image: homemenu5,
        className: "target-icon",
        route: "/login",
    },
    {
        id: 6,
        title: "명상",
        image: homemenu6,
        className: "meditation-icon",
        route: "/calendar",
    },
];

const Homemenu = () => {
    const navigate = useNavigate();
    const { user, setIsLoading } = useContext(UserContext);
    const [isScrolled, setIsScrolled] = useState(false);
    const [selectedEmotionInfo, setSelectedEmotionInfo] = useState(null);

    // 페이지 진입 시 로딩 해제
    useEffect(() => {
        setIsLoading(false);
    }, [setIsLoading]);

    // 스크롤 감지
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (!user) {
        navigate("/login");
        return null;
    }

    const handleMenuClick = (route) => {
        setIsLoading(true);
        navigate(route);
    };

    return (
        <>
            <div className={styles["home-container"]}>
                <div
                    className={`${styles["navigation-bar"]} ${
                        isScrolled ? styles["scrolled"] : ""
                    }`}
                >
                    <div className={styles["nav-left"]}>
                        <PreviousArrow />
                    </div>
                    <div className={styles["nav-center"]}></div>
                    <div className={styles["nav-right"]}>
                        <Settings />
                    </div>
                </div>

                <div className={styles.divider}></div>

                {/* ⭐ 주간 달력 & 감정 클릭 시 선택 감정 표시 */}
                <WeeklyCalendar
                    onDateEmotionClick={({ day, emotion }) => {
                        // 이미 선택된 상태와 같으면 사라짐
                        if (
                            selectedEmotionInfo &&
                            selectedEmotionInfo.day === day &&
                            selectedEmotionInfo.emotion === emotion
                        ) {
                            setSelectedEmotionInfo(null);
                        } else {
                            setSelectedEmotionInfo({ day, emotion });
                        }
                    }}
                />
                {selectedEmotionInfo && (
                    <div
                        style={{
                            background:
                                emotionColors[selectedEmotionInfo.emotion] ||
                                "#ddd",
                            color: "#fff",
                            fontWeight: "bold",
                            borderRadius: "20px",
                            padding: "10px 18px",
                            fontSize: "16px",
                            display: "inline-block",
                            border: "2px solid #fff", // 배경의 윤곽선
                            textShadow: `  
      -1px -1px 2px #222,   
      1px -1px 2px #222,   
      -1px 1px 2px #222,   
      1px 1px 2px #222  
    `, // 글씨 윤곽선(검은색)
                        }}
                    >
                        {selectedEmotionInfo.day}일의 감정은 "
                        {selectedEmotionInfo.emotion}" 입니다
                    </div>
                )}

                <div className={styles["emotion-index-container"]}>
                    <div className={styles["emotion-index-content"]}>
                        <h3 className={styles["emotion-question"]}>
                            <p>오늘 포미사용자의 감정지수는?</p>
                        </h3>
                        <div className={styles["emotion-result"]}>
                            <EmotionResult />
                        </div>
                    </div>
                </div>

                {/* 기능 선택 섹션 */}
                <div className={styles["function-selection-container"]}>
                    <h2 className={styles["section-title"]}>기능 선택</h2>
                    <div className={styles["menu-grid"]}>
                        {menuItems.map((item) => (
                            <div
                                key={item.id}
                                className={styles["menu-item"]}
                                onClick={() => handleMenuClick(item.route)}
                            >
                                <div className={styles["menu-icon-container"]}>
                                    <div
                                        className={
                                            styles["menu-icon-background"]
                                        }
                                    ></div>
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className={`${styles["menu-icon"]} ${
                                            styles[item.className]
                                        }`}
                                    />
                                    <span className={styles["menu-title"]}>
                                        {item.title}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Homemenu;
