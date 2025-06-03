import React, { useContext, useEffect } from "react"; // 🔹 useEffect 추가
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
import styles from "./Homemenu.module.css"; // 🔄 변경됨
import homemenu1 from "../assets/images/homemenu1.png";
import homemenu2 from "../assets/images/homemenu2.png";
import homemenu3 from "../assets/images/homemenu3.png";
import homemenu4 from "../assets/images/homemenu4.png";
import homemenu5 from "../assets/images/homemenu5.png";
import homemenu6 from "../assets/images/homemenu6.png";

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
        route: "/login",
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
        route: "/login",
    },
];

const Homemenu = () => {
    const navigate = useNavigate();
    const { user, setIsLoading } = useContext(UserContext); // 🔹 setIsLoading 추가

    // 🔹 페이지 진입 시 로딩 해제
    useEffect(() => {
        setIsLoading(false);
    }, [setIsLoading]);

    if (!user) {
        navigate("/login"); // 로그인을 하지 않았다면 로그인 화면으로 이동
        return null;
    }

    // 주간 날짜 데이터 (예시)
    const weekDays = [
        { day: "01", hasActivity: true },
        { day: "02", hasActivity: false },
        { day: "03", hasActivity: true },
        { day: "04", hasActivity: false },
        { day: "05", hasActivity: true },
        { day: "06", hasActivity: false },
        { day: "07", hasActivity: true },
    ];

    // 🔹 기능 클릭 시 로딩 시작 후 페이지 이동
    const handleMenuClick = (route) => {
        setIsLoading(true);
        navigate(route);
    };

    return (
        <div className={styles["home-container"]}>
            {" "}
            {/* 🔄 변경됨 */}
            {/* 네비게이션 바 */}
            <div className={styles["navigation-bar"]}>
                {" "}
                {/* 🔄 변경됨 */}
                <button
                    className={
                        styles["nav-button"] + " " + styles["back-button"]
                    }
                >
                    {" "}
                    {/* 🔄 변경됨 */}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M15 18L9 12L15 6"
                            stroke="#6C5125"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
                <button
                    className={
                        styles["nav-button"] + " " + styles["home-button"]
                    }
                >
                    {" "}
                    {/* 🔄 변경됨 */}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
                            stroke="#6C5125"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </div>
            <div className={styles.divider}></div> {/* 🔄 변경됨 */}
            {/* 주간 달력 섹션 */}
            <div className={styles["weekly-calendar-container"]}>
                {" "}
                {/* 🔄 변경됨 */}
                <div className={styles["weekly-calendar-frame"]}>
                    {" "}
                    {/* 🔄 변경됨 */}
                    <div
                        className={styles["calendar-background-top"]}
                    ></div>{" "}
                    {/* 🔄 변경됨 */}
                    <div
                        className={styles["calendar-background-bottom"]}
                    ></div>{" "}
                    {/* 🔄 변경됨 */}
                    <div className={styles["calendar-header"]}>
                        {" "}
                        {/* 🔄 변경됨 */}
                        <h3>주간 달력</h3>
                    </div>
                    <div className={styles["weekly-dates"]}>
                        {" "}
                        {/* 🔄 변경됨 */}
                        {weekDays.map((day, index) => (
                            <div
                                key={index}
                                className={styles["date-component"]}
                            >
                                {" "}
                                {/* 🔄 변경됨 */}
                                <div className={styles["date-number"]}>
                                    {day.day}
                                </div>{" "}
                                {/* 🔄 변경됨 */}
                                <div
                                    className={`${styles["date-indicator"]} ${
                                        day.hasActivity ? styles.active : ""
                                    }`} // 🔄 변경됨
                                ></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* 감정 지수 섹션 */}
            <div className={styles["emotion-index-container"]}>
                {" "}
                {/* 🔄 변경됨 */}
                <div className={styles["emotion-index-content"]}>
                    {" "}
                    {/* 🔄 변경됨 */}
                    <h3 className={styles["emotion-question"]}>
                        {" "}
                        {/* 🔄 변경됨 */}
                        <p>
                            <strong>{user.user_id}</strong>님 오늘 포미사용자의
                            감정지수는?
                        </p>
                    </h3>
                    <div className={styles["emotion-result"]}>
                        {" "}
                        {/* 🔄 변경됨 */}
                        <span className={styles["emotion-type"]}>
                            슬픔
                        </span>{" "}
                        {/* 🔄 변경됨 */}
                        <span className={styles["emotion-percentage"]}>
                            이 42%로 가장 높습니다.
                        </span>{" "}
                        {/* 🔄 변경됨 */}
                    </div>
                </div>
            </div>
            {/* 기능 선택 섹션 */}
            <div className={styles["function-selection-container"]}>
                {" "}
                {/* 🔄 변경됨 */}
                <h2 className={styles["section-title"]}>기능 선택</h2>{" "}
                {/* 🔄 변경됨 */}
                <div className={styles["menu-grid"]}>
                    {" "}
                    {/* 🔄 변경됨 */}
                    {menuItems.map((item) => (
                        <div
                            key={item.id}
                            className={styles["menu-item"]} // 🔄 변경됨
                            onClick={() => handleMenuClick(item.route)} // 🔹 수정
                        >
                            <div className={styles["menu-icon-container"]}>
                                {" "}
                                {/* 🔄 변경됨 */}
                                <div
                                    className={styles["menu-icon-background"]}
                                ></div>{" "}
                                {/* 🔄 변경됨 */}
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className={`${styles["menu-icon"]} ${
                                        styles[item.className]
                                    }`} // 🔄 변경됨
                                />
                                <span className={styles["menu-title"]}>
                                    {item.title}
                                </span>{" "}
                                {/* 🔄 변경됨 */}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Homemenu;
