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
const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

/* ───────────────────────── 유틸 ───────────────────────── */
const getTodayString = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
};

/* ──────────────────────── 컴포넌트 ─────────────────────── */
const CalendarPage = () => {
    const { user, setIsLoading } = useContext(UserContext);
    const location = useLocation();
    const navigate = useNavigate();

    /* ------- states ------- */
    
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
    const psyCache = useRef({}); // 포미의 한마디 캐시

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

    //  팝업/삭제 확인창 등장 시 스크롤 제어 (주찬님 코드) 
    useEffect(() => {
        if (showDeleteConfirm) {
            document.body.style.overflow = "hidden";
        } else if (!selectedDate) {
            // selectedDate도 false여야 완전히 닫힌 상태 → 스크롤 복원
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
        }, [showDeleteConfirm, selectedDate]);

    /* ──────────────── 데이터: 주간 감정 ──────────────── */
    useEffect(() => {
    if (!user) return;

    setIsLoading(true);

    // 오늘 날짜 계산
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    // 7일 전 날짜 계산
    const start = new Date(today);
    start.setDate(today.getDate() - 6);
    const startYyyy = start.getFullYear();
    const startMm = String(start.getMonth() + 1).padStart(2, "0");
    const startDd = String(start.getDate()).padStart(2, "0");

    // API 파라미터: 250603(6월 3일)250609(6월 9일)
    const selected_date = `${String(startYyyy).slice(2)}${startMm}${startDd}${String(yyyy).slice(2)}${mm}${dd}`;

    axios.get("https://fombackend.azurewebsites.net/api/emotion/read", {
        params: {
            user_id: user.user_id,
            selected_date,
        },
    })
    .then(res => {
        // res.data: [{...created_at: "2025-06-03T.."}, ...]
        setEmotionData(res.data);
    })
    .catch(() => setEmotionData([]))
    .finally(() => setIsLoading(false));
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
                        params: {
                            user_id: user.user_id,
                            selected_date: dateStr,
                        },
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
                    const errMsg = [
                        { content: "일기 조회 중 오류가 발생했습니다." },
                    ];
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

        const fromState = location.state?.selectedDate;
        if (fromState === null || fromState === "_blank") return;
        const fallbackDate = fromState || getTodayString();
        openPopup(fallbackDate);
    }, [user, openPopup, location.state?.selectedDate]);

    /* ──────────────── 상담(마스코트) ──────────────── */
    const handleMascotClick = async () => {
        if (
            !selectedDate ||
            !diaryId ||
            !user ||
            !originalDiaryContent[0]?.content
        ) {
            setIsConsulting(true);
            setDiaryPopupContent([
                { content: "해당 날짜의 상담 보고서가 없습니다." },
            ]);
            return;
        }

        setIsConsulting(true);
        setIsEditing(false);

        // 1. 캐시 우선
        if (psyCache.current[selectedDate]) {
            setDiaryPopupContent([{ content: psyCache.current[selectedDate] }]);
            return;
        }

        setDiaryPopupContent([{ content: "포미의 한마디를 생성 중입니다..." }]);
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
                    { content: "해당 날짜의 포미의 한마디가 없습니다." },
                ]);
            }
        } catch {
            setDiaryPopupContent([
                { content: "포미의 한마디 생성에 실패했습니다." },
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
                const createUrl = "https://fombackend.azurewebsites.net/api/diary/create";
                const createdAt = selectedDate + "T00:00:00";
                await axios.put(createUrl, {
                    user_id: user.user_id,
                    content: draftText,
                    created_at: createdAt,
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
        if (!diaryId || !user) return;
        setIsLoading(true);
        try {
            await axios.delete(
                `https://fombackend.azurewebsites.net/api/diary/delete?diary_id=${diaryId}`
            );
            setSelectedDate(null); // 팝업 닫기
            setDiaryPopupContent([]); // 내용 초기화
            setOriginalDiaryContent([]);
            setDiaryId(null);
        } catch (error) {
            console.error("❌ 삭제 실패:", error);
        } finally {
            setIsLoading(false);
            setShowDeleteConfirm(false);
        }
    };

    /* ──────────────── 키보드 열림 감지 ──────────────── */
    // 주찬님 코드
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false); // 🔹 키보드 열림 여부

    useEffect(() => {
    const handleViewportResize = () => {
        if (window.visualViewport) {
        const viewportHeight = window.visualViewport.height;
        const windowHeight = window.innerHeight;
        setIsKeyboardOpen(viewportHeight < windowHeight - 100); // 100px 여유
        }
    };

    if (window.visualViewport) {
        window.visualViewport.addEventListener("resize", handleViewportResize);
        window.visualViewport.addEventListener("scroll", handleViewportResize);
        handleViewportResize(); // 초기 감지
    }

    return () => {
        if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleViewportResize);
        window.visualViewport.removeEventListener("scroll", handleViewportResize);
        }
    };
    }, []);

    /* ─────────────── 렌더링 ─────────────── */
    /* ---- 캘린더 테이블 (위에서 calendarRows 계산) ---- */
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const calendarRows = [];
    const todayStr = getTodayString();
    let day = 1 - firstDay;
    for (let i = 0; i < 6; i++) {
        const row = [];
        let hasValid = false;
        for (let j = 0; j < 7; j++) {
            const valid = day >= 1 && day <= lastDate;
            const dateStr = `${year}-${String(month + 1).padStart(
                2,
                "0"
            )}-${String(day).padStart(2, "0")}`;
            const isToday = dateStr === todayStr;
            row.push(
                <td key={j}>
                    {valid ? (
                        <button onClick={() => openPopup(dateStr)}
                        className={isToday ? styles.today : undefined}
                        >
                            {day}
                        </button>
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
            <div
                className={`${styles["calendar-page"]} ${
                    isKeyboardOpen ? styles["keyboard-open"] : ""
                }`}
            >
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
                                    <option key={y}>{y}</option>
                                ))}
                            </select>
                            <select
                                value={currentDate.getMonth() + 1}
                                onChange={(e) =>
                                    setCurrentDate(
                                        new Date(
                                            year,
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
                            <tr>
                                {DAYS.map((d) => (
                                    <th key={d}>{d}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>{calendarRows}</tbody>
                    </table>
                </div>

                {/* ───── 주간 감정 그래프 ───── */}
                <div className={styles["emotion-chart"]}>
                    <div className={styles["chart-title"]}>
                        일주일의 나의 감정
                    </div>
                    <div className={styles["chart-bars"]}>
                      {emotionData.map((e, idx) => {
                        // 날짜 객체 생성
                        const date = new Date(e.created_at);
                        const dayIdx = date.getDay(); // 0(일)~6(토)
                        const dayName = DAYS[dayIdx];
                        const dayNum = String(date.getDate()).padStart(2, "0");

                        // 감정 필드(joy, sadness...) 뽑기
                        let offset = 0;
                        return (
                          <div key={e.created_at || idx} className={styles["chart-column"]}>
                            {Object.entries(EMOTION_COLORS).map(([emo, color]) => {
                              const val = e[emo] ?? 0;
                              const bar = (
                                <div
                                  key={emo}
                                  className={styles.bar}
                                  style={{
                                    backgroundColor: color,
                                    height: `${val}px`,
                                    bottom: `${offset}px`,
                                  }}
                                />
                              );
                              offset += val;
                              return bar;
                            })}
                            <div className={styles["day-label"]}>
                              <div>{dayName}</div>
                              <div className={styles["day-date"]}>{dayNum}일</div>
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
                                        setDiaryPopupContent(
                                            originalDiaryContent
                                        );
                                    }}
                                >
                                    &lt;
                                </button>
                            )}
                            <div className={styles["popup-title"]}>
                                {selectedDate}
                            </div>
                            {isConsulting && (
                                <div className={styles["popup-subtitle"]}>
                                    포미의 한마디
                                </div>
                            )}
                        </div>

                        <div className={styles["popup-content"]}>
                            {isEditing ? (
                                <textarea
                                    className={styles["popup-textarea"]}
                                    value={draftText}
                                    onChange={(e) =>
                                        setDraftText(e.target.value)
                                    }
                                    autoFocus
                                />
                            ) : // "작성된 일기가 없습니다."는 편집 모드가 아닐 때만 보여줌
                            diaryPopupContent[0]?.content ===
                              "작성된 일기가 없습니다." ? (
                                <p>{diaryPopupContent[0].content}</p>
                            ) : (
                                diaryPopupContent.map(({ content }, i) => (
                                    <p key={i}>{content}</p>
                                ))
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
                                                ? () => {
                                                      setIsEditing(false);
                                                      setDraftText(
                                                          originalDiaryContent[0]
                                                              ?.content || ""
                                                      );
                                                  }
                                                : () =>
                                                      setShowDeleteConfirm(true)
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
                                        onClick={
                                            isEditing
                                                ? handleSave
                                                : () => {
                                                      const content =
                                                          originalDiaryContent[0]
                                                              ?.content;
                                                      setDraftText(
                                                          content ===
                                                              "작성된 일기가 없습니다."
                                                              ? ""
                                                              : content || ""
                                                      );
                                                      setIsEditing(true);
                                                  }
                                        }
                                    >
                                        {isEditing ? "저장" : "수정"}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {/* ✅ 삭제 확인 팝업창 */}
            {showDeleteConfirm && (
                <div
                    className={styles["popup-overlay"]}
                    onClick={() => setShowDeleteConfirm(false)}
                >
                    <div
                        className={styles["popup-confirm-content"]}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={Smiley}
                            alt="삭제 확인"
                            className={styles["popup-image"]}
                        />
                        <div className={styles["popup-info"]}>
                            <span className={styles["popup-message"]}>
                                정말 삭제할까요?
                            </span>
                        </div>
                        <div className={styles["popup-actions"]}>
                            <button
                                className={styles["popup-btn-yes"]}
                                onClick={handleConfirmDelete}
                            >
                                예
                            </button>
                            <button
                                className={styles["popup-btn-no"]}
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
