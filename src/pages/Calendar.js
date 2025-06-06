import React, { useEffect, useState, useContext, useCallback, useRef } from "react";
import styles from "./Calendar.module.css";
import axios from "axios";
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

const DAYS = ["월", "화", "수", "목", "금", "토", "일"];

// 월요일~일요일 날짜 배열, toISOString() 대신 직접 YYYY-MM-DD 생성
const getFullWeekDates = () => {
  const today = new Date();
  let dayOfWeek = today.getDay();
  dayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek; // 일요일은 7로
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek - 1));
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    // toISOString 대신 로컬 YYYY-MM-DD
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    dates.push(`${yyyy}-${mm}-${dd}`);
  }
  return dates;
};

const CalendarPage = () => {
  const { user, setIsLoading } = useContext(UserContext);
  const navigate = useNavigate();
  const psyCache = useRef({});

  const [emotionData, setEmotionData] = useState([]);
  const [weekDates, setWeekDates] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [diaryPopupContent, setDiaryPopupContent] = useState([]);
  const [originalDiaryContent, setOriginalDiaryContent] = useState([]);
  const [isConsulting, setIsConsulting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draftText, setDraftText] = useState("");
  const [diaryId, setDiaryId] = useState(null);

  // 스크롤 상태 (헤더용)
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // AbortController 관리 (요청취소)
  const requestControllerRef = useRef(null);

  useEffect(() => {
    psyCache.current = {};
  }, [user]);

  useEffect(() => {
    // 컴포넌트 언마운트 시 마지막 요청 취소
    return () => {
      requestControllerRef.current?.abort();
    };
  }, []);

  // 오늘 날짜 반환
  const getTodayString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // 팝업 열기 (이전요청 취소/새요청)
  const openPopup = useCallback(
    async (dateStr) => {
      // 이전 요청 취소
      requestControllerRef.current?.abort();
      const controller = new AbortController();
      requestControllerRef.current = controller;

      setSelectedDate(dateStr);
      setIsConsulting(false);
      setIsEditing(false);
      setIsLoading(true);

      try {
        const response = await axios.get(
          "https://fombackend.azurewebsites.net/api/diary/read",
          {
            params: { user_id: user.user_id, selected_date: dateStr },
            signal: controller.signal,
          }
        );

        if (controller.signal.aborted) return;

        if (Array.isArray(response.data) && response.data.length > 0) {
          const diary = [{ content: response.data[0].content }];
          setDiaryPopupContent(diary);
          setOriginalDiaryContent(diary);
          setDiaryId(response.data[0].diary_id);
        } else {
          const diary = [{ content: "작성된 일기가 없습니다." }];
          setDiaryPopupContent(diary);
          setOriginalDiaryContent(diary);
          setDiaryId(null);
        }
      } catch (error) {
        if (controller.signal.aborted) return;
        setDiaryPopupContent([{ content: "일기 조회 중 오류가 발생했습니다." }]);
        setOriginalDiaryContent([{ content: "일기 조회 중 오류가 발생했습니다." }]);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    },
    [user, setIsLoading]
  );

  // 주간 감정/오늘 자동팝업
  useEffect(() => {
    const fetchEmotionForThisWeek = async () => {
      if (!user) return;
      setIsLoading(true);
      const dates = getFullWeekDates();
      setWeekDates(dates);

      const todayStr = getTodayString();
      const results = [];

      for (const date of dates) {
        if (date > todayStr) {
          results.push({
            joy: 0,
            sadness: 0,
            anger: 0,
            fear: 0,
            disgust: 0,
            shame: 0,
            surprise: 0,
            confusion: 0,
            boredom: 0,
          });
          continue;
        }
        try {
          const diaryRes = await axios.get(
            "https://fombackend.azurewebsites.net/api/diary/read",
            { params: { user_id: user.user_id, selected_date: date } }
          );
          const diary = diaryRes.data[0];
          if (!diary || !diary.diary_id) {
            results.push({
              joy: 0,
              sadness: 0,
              anger: 0,
              fear: 0,
              disgust: 0,
              shame: 0,
              surprise: 0,
              confusion: 0,
              boredom: 0,
            });
            continue;
          }

          const emotionRes = await axios.get(
            "https://fombackend.azurewebsites.net/api/emotion/read",
            { params: { user_id: user.user_id, diary_id: diary.diary_id } }
          );
          const emotion = emotionRes.data;
          results.push({
            joy: emotion.joy ?? 0,
            sadness: emotion.sadness ?? 0,
            anger: emotion.anger ?? 0,
            fear: emotion.fear ?? 0,
            disgust: emotion.disgust ?? 0,
            shame: emotion.shame ?? 0,
            surprise: emotion.surprise ?? 0,
            confusion: emotion.bewilderment ?? 0,
            boredom: emotion.boredom ?? 0,
          });
        } catch {
          results.push({
            joy: 0,
            sadness: 0,
            anger: 0,
            fear: 0,
            disgust: 0,
            shame: 0,
            surprise: 0,
            confusion: 0,
            boredom: 0,
          });
        }
      }
      setEmotionData(results);
      setIsLoading(false);
    };

    if (!user) {
      navigate("/login");
      return;
    }
    fetchEmotionForThisWeek();

    // 오늘 일기 자동 팝업
    const todayStr = getTodayString();
    openPopup(todayStr);
    // eslint-disable-next-line
  }, [user, navigate, setIsLoading, openPopup]);

  // 달력
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const calendarRows = [];
  let day = 1 - (firstDay === 0 ? 6 : firstDay - 1); // 월요일 시작
  for (let i = 0; i < 6; i++) {
    const row = [];
    let hasValidDate = false;
    for (let j = 0; j < 7; j++) {
      const valid = day >= 1 && day <= lastDate;
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
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

const handleMascotClick = async () => {
  if (!selectedDate || !diaryId || !user || !originalDiaryContent[0]?.content) {
    setIsConsulting(true);
    setDiaryPopupContent([{ content: "해당 날짜의 상담 보고서가 없습니다." }]);
    return;
  }

  setIsConsulting(true);
  setIsEditing(false);

  // 1. 캐시에 있으면 바로 사용
  if (psyCache.current[selectedDate]) {
    setDiaryPopupContent([{ content: psyCache.current[selectedDate] }]);
    return;
  }

  setDiaryPopupContent([{ content: "상담 보고서를 생성 중입니다..." }]);
  setIsLoading(true);
  try {
    const res = await axios.post(
      "https://fombackend.azurewebsites.net/api/psy/create",
      {
        user_id: user.user_id,
        diary_id: diaryId,
        diary_text: originalDiaryContent[0].content // 반드시 추가!
      }
    );
    if (res.data && typeof res.data.Fome === "string") {
      psyCache.current[selectedDate] = res.data.Fome;
      setDiaryPopupContent([{ content: res.data.Fome }]);
    } else {
      setDiaryPopupContent([{ content: "해당 날짜의 상담 보고서가 없습니다." }]);
    }
  } catch (e) {
    setDiaryPopupContent([{ content: "상담 보고서 생성에 실패했습니다." }]);
  } finally {
    setIsLoading(false);
  }
};

  const handleBack = () => {
    setIsConsulting(false);
    setDiaryPopupContent(originalDiaryContent);
  };

  const handleDelete = async () => {
    if (!diaryId) return;
    setIsLoading(true);
    try {
      await axios.delete(
        "https://fombackend.azurewebsites.net/api/diary/delete",
        { params: { diary_id: diaryId } }
      );
      setSelectedDate(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !selectedDate) return;
    setIsLoading(true);
    try {
      if (diaryId) {
        await axios.put(
          `https://fombackend.azurewebsites.net/api/diary/${diaryId}`,
          { content: draftText }
        );
      } else {
        await axios.post(
          "https://fombackend.azurewebsites.net/api/diary/create",
          {
            user_id: user.user_id,
            content: draftText,
            created_at: selectedDate + "T09:00:00",
          }
        );
      }
      setIsEditing(false);
      setOriginalDiaryContent([{ content: draftText }]);
    } finally {
      setIsLoading(false);
    }
  };

  const startEdit = () => {
    if (isConsulting) return;
    setDraftText(diaryPopupContent[0]?.content || "");
    setIsEditing(true);
  };

  return (
    <>
      <div className={styles["calendar-page"]}>
        {/* navigation-bar 최신 구조 */}
        <div
          className={`${styles["navigation-bar"]} ${
            isScrolled ? styles["scrolled"] : ""
          }`}
        >
          <div className={styles["nav-left"]}>
            <PreviousArrow />
          </div>
          <div className={styles["nav-center"]}>
            <button
              className={styles["month-btn"]}
              onClick={() => changeMonth(-1)}
            >
              &lt;
            </button>
            {year}년 {month + 1}월
            <button
              className={styles["month-btn"]}
              onClick={() => changeMonth(1)}
            >
              &gt;
            </button>
          </div>
          <div className={styles["nav-right"]}>
            <Settings />
            <HomeButton />
          </div>
        </div>

        {/* 달력 */}
        <div className={styles["calendar-table"]}>
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

        {/* 감정 차트 */}
        <div className={styles["emotion-chart"]}>
          <div className={styles["chart-title"]}>일주일의 나의 감정</div>
          <div className={styles["chart-bars"]}>
            {emotionData.map((day, index) => {
              let offset = 0;
              return (
                <div key={index} className={styles["chart-column"]}>
                  {Object.entries(day).map(([emotion, value]) => {
                    const bar = (
                      <div
                        key={emotion}
                        className={styles.bar}
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
                  <div className={styles["day-label"]}>
                    <div>{DAYS[index]}</div>
                    <div className={styles["day-date"]}>
                      {weekDates[index]?.slice(8, 10)}일
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className={styles.legend}>
            {Object.entries(EMOTION_COLORS).map(([key, color]) => (
              <div key={key} className={styles["legend-item"]}>
                <span
                  className={styles["color-dot"]}
                  style={{ backgroundColor: color }}
                />
                {EMOTION_KR[key]}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 일기 팝업 */}
      {selectedDate && (
        <div className={styles["diary-popup-overlay"]}>
          <div className={styles["diary-popup"]}>
            <button
              className={styles["popup-close-button"]}
              onClick={() => setSelectedDate(null)}
            >
              ×
            </button>
            <div className={styles["popup-header"]}>
              {isConsulting && (
                <button
                  className={styles["popup-back-button"]}
                  onClick={handleBack}
                >
                  &lt;
                </button>
              )}
              <div className={styles["popup-title"]}>{selectedDate}</div>
              {isConsulting && (
                <div className={styles["popup-subtitle"]}>
                  포미의 상담 보고서
                </div>
              )}
            </div>
            <div className={styles["popup-content"]} onClick={startEdit}>
              {isConsulting || !isEditing ? (
                diaryPopupContent.map(({ content }, i) => (
                  <p key={i}>{content}</p>
                ))
              ) : (
                <textarea
                  className={styles["popup-textarea"]}
                  value={draftText}
                  onChange={(e) => setDraftText(e.target.value)}
                />
              )}
            </div>
            <div
              className={styles["popup-bottom-row"]}
              style={isConsulting ? { justifyContent: "center" } : undefined}
            >
              {isConsulting ? (
                <button
                  className={`${styles["popup-button"]} ${styles.save}`}
                  onClick={() => navigate("/connselbot")}
                >
                  더 상담하기
                </button>
              ) : (
                <>
                  <button
                    className={`${styles["popup-button"]} ${styles.delete}`}
                    onClick={handleDelete}
                  >
                    삭제하기
                  </button>
                  <img
                    src={Smiley}
                    alt="마스코트"
                    className={styles["popup-smiley"]}
                    onClick={handleMascotClick}
                  />
                  <button
                    className={`${styles["popup-button"]} ${styles.save}`}
                    onClick={async () => {
                      if (isEditing) {
                        setDiaryPopupContent([{ content: draftText }]);
                        setOriginalDiaryContent([{ content: draftText }]);
                        setIsEditing(false);
                      }
                      await handleSave();
                    }}
                  >
                    저장하기
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