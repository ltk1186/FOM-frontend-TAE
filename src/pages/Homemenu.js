import React from "react";
import { useNavigate } from "react-router-dom";
import "./Homemenu.css";
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
        route: "/login",
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
        route: "/login",
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

    // 기능 메뉴 데이터

    return (
        <div className="home-container">
            {/* 네비게이션 바 */}
            <div className="navigation-bar">
                <button className="nav-button back-button">
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
                <button className="nav-button home-button">
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

            <div className="divider"></div>

            {/* 주간 달력 섹션 */}
            <div className="weekly-calendar-container">
                <div className="weekly-calendar-frame">
                    <div className="calendar-background-top"></div>
                    <div className="calendar-background-bottom"></div>

                    <div className="calendar-header">
                        <h3>주간 달력</h3>
                    </div>

                    <div className="weekly-dates">
                        {weekDays.map((day, index) => (
                            <div key={index} className="date-component">
                                <div className="date-number">{day.day}</div>
                                <div
                                    className={`date-indicator ${
                                        day.hasActivity ? "active" : ""
                                    }`}
                                ></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 감정 지수 섹션 */}
            <div className="emotion-index-container">
                <div className="emotion-index-content">
                    <h3 className="emotion-question">
                        오늘 포미사용자의 감정지수는?
                    </h3>
                    <div className="emotion-result">
                        <span className="emotion-type">슬픔</span>
                        <span className="emotion-percentage">
                            이 42%로 가장 높습니다.
                        </span>
                    </div>
                </div>
            </div>

            {/* 기능 선택 섹션 */}
            <div className="function-selection-container">
                <h2 className="section-title">기능 선택</h2>

                <div className="menu-grid">
                    {menuItems.map((item) => (
                        <div
                            key={item.id}
                            className="menu-item"
                            onClick={() => navigate(item.route)}
                        >
                            <div className="menu-icon-container">
                                <div className="menu-icon-background"></div>
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className={`menu-icon ${item.className}`}
                                />
                                <span className="menu-title">{item.title}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Homemenu;
