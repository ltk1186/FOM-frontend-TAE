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
    let dayOfWeek = today.getDay();
    dayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek - 1));
    const dates = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        dates.push(`${yyyy}-${mm}-${dd}`);
    }
    return dates;
};

/* ──────────────────────── 컴포넌트 ─────────────────────── */
const CalendarPage = () => {
    const { user, setIsLoading } = useContext(UserContext);
    const navigate = useNavigate();

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

    const [isScrolled, setIsScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 0);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const requestControllerRef = useRef(null);

    useEffect(() => {
        return () => {
            requestControllerRef.current?.abort();
        };
    }, []);

    // 🔽 팝업 활성화 시 body 스크롤 방지
    useEffect(() => {
        if (selectedDate) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [selectedDate]);

    const getTodayString = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const dd = String(today.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    };

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
                const response = await axios.get(
                    "https://fombackend.azurewebsites.net/api/diary/read",
                    {
                        params: {
                            user_id: user.user_id,
                            selected_date: dateStr,
                        },
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
                setDiaryPopupContent([
                    { content: "일기 조회 중 오류가 발생했습니다." },
                ]);
                setOriginalDiaryContent([
                    { content: "일기 조회 중 오류가 발생했습니다." },
                ]);
            } finally {
                if (!controller.signal.aborted) setIsLoading(false);
            }
        },
        [user, setIsLoading]
    );

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
                        {
                            params: {
                                user_id: user.user_id,
                                selected_date: date,
                            },
                        }
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
                        {
                            params: {
                                user_id: user.user_id,
                                diary_id: diary.diary_id,
                            },
                        }
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
        // openPopup(getTodayString());
    }, [user, navigate, setIsLoading, openPopup]);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    const calendarRows = [];
    let day = 1 - (firstDay === 0 ? 6 : firstDay - 1);
    for (let i = 0; i < 6; i++) {
        const row = [];
        let hasValidDate = false;
        for (let j = 0; j < 7; j++) {
            const valid = day >= 1 && day <= lastDate;
            const dateStr = `${year}-${String(month + 1).padStart(
                2,
                "0"
            )}-${String(day).padStart(2, "0")}`;
            row.push(
                <td key={j}>
                    {valid ? (
                        <button onClick={() => openPopup(dateStr)}>
                            {day}
                        </button>
                    ) : (
                        <span style={{ visibility: "hidden" }}>-</span>
                    )}
                </td>
            );
            if (valid) hasValidDate = true;
            day++;
        }
        if (hasValidDate) calendarRows.push(<tr key={i}>{row}</tr>);
    }

    const handleMascotClick = () => {
        if (!selectedDate) return;
        setIsConsulting(true);
        setIsEditing(false);
        setDiaryPopupContent([
            { content: "오늘의 일기를 읽으며 당신의 하루가 고요하게..." },
        ]);
    };

    const handleBack = () => {
        setIsConsulting(false);
        setDiaryPopupContent(originalDiaryContent);
    };

    const handleDelete = () => {
        setIsEditing(false);
        setDiaryPopupContent(originalDiaryContent);
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
            setDiaryPopupContent([{ content: draftText }]);
            setOriginalDiaryContent([{ content: draftText }]);
            setIsEditing(false);
        } finally {
            setIsLoading(false);
        }
    };

    const startEdit = () => {
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
                    {/* 기존 연월 설정 방식 */}
                    {/* <div className={styles["nav-center"]}>
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
          </div> */}
                    <div className={styles["nav-center"]}>
                        <div className={styles.dropdowns}>
                            <select
                                value={year}
                                onChange={(e) =>
                                    setCurrentDate(
                                        new Date(
                                            Number(e.target.value),
                                            currentDate.getMonth(),
                                            1
                                        )
                                    )
                                }
                            >
                                {Array.from(
                                    { length: 100 },
                                    (_, i) => year - i
                                ).map((y) => (
                                    <option key={y} value={y}>
                                        {y}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={currentDate.getMonth() + 1}
                                onChange={(e) =>
                                    setCurrentDate(
                                        new Date(
                                            currentDate.getFullYear(),
                                            Number(e.target.value) - 1,
                                            1
                                        )
                                    )
                                }
                            >
                                {Array.from(
                                    { length: 12 },
                                    (_, i) => i + 1
                                ).map((m) => (
                                    <option key={m} value={m}>
                                        {m}
                                    </option>
                                ))}
                            </select>
                        </div>
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
                    <div className={styles["chart-title"]}>
                        일주일의 나의 감정
                    </div>
                    <div className={styles["chart-bars"]}>
                        {emotionData.map((day, index) => {
                            let offset = 0;
                            return (
                                <div
                                    key={index}
                                    className={styles["chart-column"]}
                                >
                                    {Object.entries(day).map(
                                        ([emotion, value]) => {
                                            const bar = (
                                                <div
                                                    key={emotion}
                                                    className={styles.bar}
                                                    style={{
                                                        backgroundColor:
                                                            EMOTION_COLORS[
                                                                emotion
                                                            ],
                                                        height: `${value}px`,
                                                        bottom: `${offset}px`,
                                                    }}
                                                />
                                            );
                                            offset += value;
                                            return bar;
                                        }
                                    )}
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
                            <div className={styles["popup-title"]}>
                                {selectedDate}
                            </div>
                            {isConsulting && (
                                <div className={styles["popup-subtitle"]}>
                                    포미의 상담 보고서
                                </div>
                            )}
                        </div>
                        <div className={styles["popup-content"]}>
                            {isConsulting || !isEditing ? (
                                diaryPopupContent.map(({ content }, i) => (
                                    <p key={i}>{content}</p>
                                ))
                            ) : (
                                <textarea
                                    className={styles["popup-textarea"]}
                                    value={draftText}
                                    onChange={(e) =>
                                        setDraftText(e.target.value)
                                    }
                                />
                            )}
                        </div>
                        <div
                            className={styles["popup-bottom-row"]}
                            style={
                                isConsulting
                                    ? { justifyContent: "center" }
                                    : undefined
                            }
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
                                                ? handleDelete
                                                : () => setSelectedDate(null)
                                        }
                                    >
                                        {isEditing ? "취소하기" : "삭제하기"}
                                    </button>
                                    <img
                                        src={Smiley}
                                        alt="마스코트"
                                        className={styles["popup-smiley"]}
                                        onClick={handleMascotClick}
                                    />
                                    <button
                                        className={`${styles["popup-button"]} ${styles.save}`}
                                        onClick={
                                            isEditing ? handleSave : startEdit
                                        }
                                    >
                                        {isEditing ? "저장하기" : "수정하기"}
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
