import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
  useRef,
} from "react";
import styles from "./Calendar.module.css";
import axios from "axios";
import HomeButton from "../components/HomeButton";
import Settings from "../components/Settings";
import PreviousArrow from "../components/PreviousArrow";
import { UserContext } from "./UserContext";
import { useNavigate, useLocation } from "react-router-dom";
import Smiley from "../assets/images/image-50.png";

/* ───────────────────────── 상수 ───────────────────────── */
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

/* ───────────────────────── 유틸 ───────────────────────── */
const getTodayString = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")}`;
};

const getFullWeekDates = () => {
  const today = new Date();
  let dow = today.getDay(); // 0(일)‒6
  dow = dow === 0 ? 7 : dow;
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dow - 1));
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
  });
};

/* ──────────────────────── 컴포넌트 ─────────────────────── */
const CalendarPage = () => {
  const { user, setIsLoading } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();

  /* ------- states ------- */
  const [weekDates, setWeekDates] = useState([]);
  const [emotionData, setEmotionData] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const [selectedDate, setSelectedDate] = useState(null); // 팝업 ON/OFF
  const [diaryPopupContent, setDiaryPopupContent] = useState([]);
  const [originalDiaryContent, setOriginalDiaryContent] = useState([]);
  const [diaryId, setDiaryId] = useState(null);

  const [isConsulting, setIsConsulting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draftText, setDraftText] = useState("");

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  /* ------- refs ------- */
  const requestControllerRef = useRef(null); // Axios 취소
  const psyCache = useRef({}); // 상담 보고서 캐시

  /* ────────────── 라이프사이클: 공통 정리 ────────────── */
  // 스크롤 헤더 효과
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 언마운트 시 요청 취소
  useEffect(() => {
    return () => requestControllerRef.current?.abort();
  }, []);

  // 팝업 열릴 때 body 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = selectedDate ? "hidden" : "auto";
  }, [selectedDate]);

  // 다른 계정으로 로그인하면 상담 캐시 초기화
  useEffect(() => {
    psyCache.current = {};
  }, [user]);

  /* ──────────────── 데이터: 주간 감정 ──────────────── */
  useEffect(() => {
  if (!user) return;

  const blankEmotion = Object.fromEntries(Object.keys(EMOTION_COLORS).map((k) => [k, 0]));
  const mapEmotion = (e) => ({
    joy: e.joy ?? 0,
    sadness: e.sadness ?? 0,
    anger: e.anger ?? 0,
    fear: e.fear ?? 0,
    disgust: e.disgust ?? 0,
    shame: e.shame ?? 0,
    surprise: e.surprise ?? 0,
    confusion: e.confusion ?? 0,  // confusion 필드 이름도 이걸로
    boredom: e.boredom ?? 0,
  });

  const fetchWeeklyEmotion = async () => {
    setIsLoading(true);
    const dates = getFullWeekDates();
    setWeekDates(dates);

    const todayStr = getTodayString();

    const promises = dates.map(async (date) => {
      if (date > todayStr) return blankEmotion;
      try {
        const { data: diaryArr } = await axios.get(
          "https://fombackend.azurewebsites.net/api/diary/read",
          { params: { user_id: user.user_id, selected_date: date } }
        );
        if (!diaryArr?.[0]?.diary_id) return blankEmotion;

        const { data: e } = await axios.get(
          "https://fombackend.azurewebsites.net/api/emotion/read",
          { params: { user_id: user.user_id, diary_id: diaryArr[0].diary_id } }
        );
        return mapEmotion(e);
      } catch {
        return blankEmotion;
      }
    });

    const resultArr = await Promise.all(promises);
    setEmotionData(resultArr);
    setIsLoading(false);
  };

  fetchWeeklyEmotion();
}, [user, setIsLoading]);

  /* ──────────────── 팝업 로직 공통 함수 ──────────────── */
  const openPopup = useCallback(
    async (dateStr) => {
      requestControllerRef.current?.abort();
      const controller = new AbortController();
      requestControllerRef.current = controller;

      setSelectedDate(dateStr);
      setIsConsulting(false);
      setIsEditing(false);
      setIsLoading(true);

      try {
        const res = await axios.get(
          "https://fombackend.azurewebsites.net/api/diary/read",
          {
            params: { user_id: user.user_id, selected_date: dateStr },
            signal: controller.signal,
          }
        );
        if (controller.signal.aborted) return;

        if (Array.isArray(res.data) && res.data.length) {
          const diary = [{ content: res.data[0].content }];
          setDiaryPopupContent(diary);
          setOriginalDiaryContent(diary);
          setDiaryId(res.data[0].diary_id);
        } else {
          const msg = [{ content: "작성된 일기가 없습니다." }];
          setDiaryPopupContent(msg);
          setOriginalDiaryContent(msg);
          setDiaryId(null);
        }
      } catch {
        if (!controller.signal.aborted) {
          const errMsg = [{ content: "일기 조회 중 오류가 발생했습니다." }];
          setDiaryPopupContent(errMsg);
          setOriginalDiaryContent(errMsg);
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    },
    [user, setIsLoading]
  );

  /* ──────────────── 오늘 날짜 자동 팝업 ──────────────── */
  useEffect(() => {
    if (!user) return;

    // URL state(다른 페이지에서 넘어온 날짜)가 있으면 그걸 우선,
    // 없으면 오늘 날짜로 자동 팝업
    const fallbackDate = location.state?.selectedDate || getTodayString();
    openPopup(fallbackDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // openPopup은 useCallback이라 안전

  /* ──────────────── 상담(마스코트) ──────────────── */
  const handleMascotClick = async () => {
    if (!selectedDate || !diaryId || !user || !originalDiaryContent[0]?.content) {
      setIsConsulting(true);
      setDiaryPopupContent([{ content: "해당 날짜의 상담 보고서가 없습니다." }]);
      return;
    }

    setIsConsulting(true);
    setIsEditing(false);

    // 1. 캐시 우선
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
          diary_text: originalDiaryContent[0].content,
        }
      );
      if (typeof res.data?.Fome === "string") {
        psyCache.current[selectedDate] = res.data.Fome;
        setDiaryPopupContent([{ content: res.data.Fome }]);
      } else {
        setDiaryPopupContent([
          { content: "해당 날짜의 상담 보고서가 없습니다." },
        ]);
      }
    } catch {
      setDiaryPopupContent([
        { content: "상담 보고서 생성에 실패했습니다." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  /* ───────────── 삭제 / 저장 / 편집 등 부가 로직 ───────────── */
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
        await axios.post("https://fombackend.azurewebsites.net/api/diary/create", {
          user_id: user.user_id,
          content: draftText,
          created_at: selectedDate + "T09:00:00",
        });
      }
      setDiaryPopupContent([{ content: draftText }]);
      setOriginalDiaryContent([{ content: draftText }]);
      setIsEditing(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!diaryId) return;
    setIsLoading(true);
    try {
      await axios.delete(
        "https://fombackend.azurewebsites.net/api/diary/delete",
        { params: { diary_id: diaryId } }
      );
      setSelectedDate(null); // 팝업 닫기
      setDiaryPopupContent([]);
      setOriginalDiaryContent([]);
      setDiaryId(null);
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  /* ─────────────── 렌더링 ─────────────── */
  /* ---- 캘린더 테이블 (위에서 calendarRows 계산) ---- */
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const calendarRows = [];
  let day = 1 - (firstDay === 0 ? 6 : firstDay - 1);
  for (let i = 0; i < 6; i++) {
    const row = [];
    let hasValid = false;
    for (let j = 0; j < 7; j++) {
      const valid = day >= 1 && day <= lastDate;
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;
      row.push(
        <td key={j}>
          {valid ? (
            <button onClick={() => openPopup(dateStr)}>{day}</button>
          ) : (
            <span style={{ visibility: "hidden" }}>-</span>
          )}
        </td>
      );
      if (valid) hasValid = true;
      day++;
    }
    if (hasValid) calendarRows.push(<tr key={i}>{row}</tr>);
  }

  return (
    <>
      {/* ───── 페이지 상단(네비) ───── */}
      <div className={styles["calendar-page"]}>
        <div
          className={`${styles["navigation-bar"]} ${
            isScrolled ? styles["scrolled"] : ""
          }`}
        >
          <div className={styles["nav-left"]}>
            <PreviousArrow />
          </div>

          {/* 연도/월 드롭다운 */}
          <div className={styles["nav-center"]}>
            <div className={styles.dropdowns}>
              <select
                value={year}
                onChange={(e) =>
                  setCurrentDate(
                    new Date(Number(e.target.value), currentDate.getMonth(), 1)
                  )
                }
              >
                {Array.from({ length: 100 }, (_, i) => year - i).map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>
              <select
                value={currentDate.getMonth() + 1}
                onChange={(e) =>
                  setCurrentDate(
                    new Date(year, Number(e.target.value) - 1, 1)
                  )
                }
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles["nav-right"]}>
            <Settings />
            <HomeButton />
          </div>
        </div>

        {/* ───── 캘린더 표 ───── */}
        <div className={styles["calendar-table"]}>
          <table>
            <thead>
              <tr>{DAYS.map((d) => <th key={d}>{d}</th>)}</tr>
            </thead>
            <tbody>{calendarRows}</tbody>
          </table>
        </div>

        {/* ───── 주간 감정 그래프 ───── */}
        <div className={styles["emotion-chart"]}>
          <div className={styles["chart-title"]}>일주일의 나의 감정</div>
          <div className={styles["chart-bars"]}>
            {emotionData.map((day, idx) => {
              let offset = 0;
              return (
                <div key={idx} className={styles["chart-column"]}>
                  {Object.entries(day).map(([emo, val]) => {
                    const bar = (
                      <div
                        key={emo}
                        className={styles.bar}
                        style={{
                          backgroundColor: EMOTION_COLORS[emo],
                          height: `${val}px`,
                          bottom: `${offset}px`,
                        }}
                      />
                    );
                    offset += val;
                    return bar;
                  })}
                  <div className={styles["day-label"]}>
                    <div>{DAYS[idx]}</div>
                    <div className={styles["day-date"]}>
                      {weekDates[idx]?.slice(8, 10)}일
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className={styles.legend}>
            {Object.entries(EMOTION_COLORS).map(([k, c]) => (
              <div key={k} className={styles["legend-item"]}>
                <span
                  className={styles["color-dot"]}
                  style={{ backgroundColor: c }}
                />
                {EMOTION_KR[k]}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ───── 일기/상담 팝업 ───── */}
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
                  onClick={() => {
                    setIsConsulting(false);
                    setDiaryPopupContent(originalDiaryContent);
                  }}
                >
                  &lt;
                </button>
              )}
              <div className={styles["popup-title"]}>{selectedDate}</div>
              {isConsulting && (
                <div className={styles["popup-subtitle"]}>포미의 상담 보고서</div>
              )}
            </div>

            <div className={styles["popup-content"]}>
              {isEditing ? (
                <textarea
                  className={styles["popup-textarea"]}
                  value={draftText}
                  onChange={(e) => setDraftText(e.target.value)}
                  autoFocus
                />
              ) : (
                // "작성된 일기가 없습니다."는 편집 모드가 아닐 때만 보여줌
                diaryPopupContent[0]?.content === "작성된 일기가 없습니다." ? (
                  <p>{diaryPopupContent[0].content}</p>
                ) : (
                  diaryPopupContent.map(({ content }, i) => <p key={i}>{content}</p>)
                )
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
                    onClick={
                      isEditing
                        ? () => setSelectedDate(null)
                        : () => setShowDeleteConfirm(true)
                    }
                  >
                    {isEditing ? "취소" : "삭제"}
                  </button>
                  <img
                    src={Smiley}
                    alt="마스코트"
                    className={styles["popup-smiley"]}
                    onClick={handleMascotClick}
                  />
                  <button
                    className={`${styles["popup-button"]} ${styles.save}`}
                    onClick={isEditing ? handleSave : () => {
                      const content = originalDiaryContent[0]?.content;
                      setDraftText(content === "작성된 일기가 없습니다." ? "" : (content || ""));
                      setIsEditing(true);
                    }}
                  >
                    {isEditing ? "저장" : "수정"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ───── 삭제 확인 모달 ───── */}
      {showDeleteConfirm && (
        <div
          className={styles["popup-overlay"]}
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className={styles["popup-confirm-content"]}
            onClick={(e) => e.stopPropagation()}
          >
            <img src={Smiley} alt="" className={styles["popup-image"]} />
            <div className={styles["popup-message"]}>정말 삭제하시겠어요?</div>
            <div className={styles["popup-actions"]}>
              <button
                className={styles["popup-btn"]}
                onClick={handleConfirmDelete}
              >
                예
              </button>
              <button
                className={styles["popup-btn"]}
                onClick={() => setShowDeleteConfirm(false)}
              >
                아니요
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CalendarPage;