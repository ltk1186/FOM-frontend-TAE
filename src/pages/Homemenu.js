import React, { useContext, useEffect, useState } from "react"; // 🔄 useState 추가
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
    route: "/login",
  },
];

const Homemenu = () => {
  const navigate = useNavigate();
  const { user, setIsLoading } = useContext(UserContext); // 🔹 setIsLoading 추가
  const [isScrolled, setIsScrolled] = useState(false); // 🔄 추가: 스크롤 상태

  // 🔹 페이지 진입 시 로딩 해제
  useEffect(() => {
    setIsLoading(false);
  }, [setIsLoading]);

  // 🔄 추가: 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <>
      <div className={styles["home-container"]}>
        {/* 네비게이션 바 */}
        {/* 
        <div className={styles["navigation-bar"]}>
          <div className={styles["back-button"]}>
            <PreviousArrow />
          </div>
          <div className={styles["right-buttons"]}>
            <Settings />
          </div>
        </div>
        */}
        {/* 🔄 navigation-bar 구조 통일 (RecordDiary.js 방식) */}
        <div
          className={`${styles["navigation-bar"]} ${
            isScrolled ? styles["scrolled"] : ""
          }`} // 🔄 수정됨
        >
          <div className={styles["nav-left"]}>
            <PreviousArrow />
          </div>
          <div className={styles["nav-center"]}>{/* 중앙 영역 없음 */}</div>
          <div className={styles["nav-right"]}>
            <Settings />
          </div>
        </div>

        <div className={styles.divider}></div>

        {/* 주간 달력 섹션 */}
        {/* <div className={styles["weekly-calendar-container"]}>
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
                  ></div>
                </div>
              ))}
            </div>
          </div>
        </div> */}
        <WeeklyCalendar />

        {/* 감정 지수 섹션 */}
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
                  <div className={styles["menu-icon-background"]}></div>
                  <img
                    src={item.image}
                    alt={item.title}
                    className={`${styles["menu-icon"]} ${
                      styles[item.className]
                    }`}
                  />
                  <span className={styles["menu-title"]}>{item.title}</span>
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
