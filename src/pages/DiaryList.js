import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./DiaryList.module.css";
import PreviousArrow from "../components/PreviousArrow";
import HomeButton from "../components/HomeButton";
import { UserContext } from "./UserContext";
import axios from "axios";

const DiaryList = () => {
    const navigate = useNavigate();
    const { user, setIsLoading } = useContext(UserContext);

    const thisYear = new Date().getFullYear();
    const thisMonth = new Date().getMonth() + 1;
    const [year, setYear] = useState(thisYear);
    const [month, setMonth] = useState(thisMonth);
    const [diaries, setDiaries] = useState([]);
    const [isScrolled, setIsScrolled] = useState(false); // 🔄 navigation-bar 리팩토링

    useEffect(() => {
        if (!user?.user_id) return;

        const fetchDiaries = async () => {
            setIsLoading(true);

            // 월의 첫날과 마지막 날 계산
            const firstDay = `${String(year).slice(2)}${String(month).padStart(
                2,
                "0"
            )}01`; // 2025년 6월 → "250601"
            const lastDay = `${String(year).slice(2)}${String(month).padStart(
                2,
                "0"
            )}${new Date(year, month, 0)
                .getDate()
                .toString()
                .padStart(2, "0")}`; // "250630"

            try {
                const res = await axios.get(
                    "https://fombackend.azurewebsites.net/api/diary/read",
                    {
                        params: {
                            user_id: user.user_id,
                            selected_date: `${firstDay}${lastDay}`, // "250601250607"
                        },
                    }
                );

                if (Array.isArray(res.data) && res.data.length > 0) {
                    // 받은 데이터를 다이어리 리스트로 변환
                    const filteredDiaries = res.data.map((entry) => ({
                        diary_id: entry.diary_id,
                        created_at: entry.created_at,
                        summary: entry.summary,
                    }));
                    setDiaries(filteredDiaries);
                } else {
                    setDiaries([]);
                }
            } catch (e) {
                console.error("Failed to fetch diaries", e);
                setDiaries([]);
            }

            setIsLoading(false);
        };

        fetchDiaries();
    }, [user?.user_id, year, month, setIsLoading]);

    // 🔄 navigation-bar 리팩토링
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // 연/월 선택 옵션
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const years = Array.from({ length: 100 }, (_, i) => thisYear - i);

    return (
        <div
            className={styles["diary-list-page"]}
            style={{
                minHeight: "100svh",
                height: "auto",
                overflowY: undefined,
            }}
        >
            {/* 🔄 navigation-bar 리팩토링 시작 */}
            <div
                className={`${styles["navigation-bar"]} ${
                    isScrolled ? styles["scrolled"] : ""
                }`}
            >
                <div className={styles["nav-left"]}>
                    <PreviousArrow />
                </div>
                <div className={styles["nav-center"]}>
                    <div className={styles.dropdowns}>
                        <select
                            value={year}
                            onChange={(e) => setYear(Number(e.target.value))}
                        >
                            {years.map((y) => (
                                <option key={y}>{y}</option>
                            ))}
                        </select>
                        <select
                            value={month}
                            onChange={(e) => setMonth(Number(e.target.value))}
                        >
                            {months.map((m) => (
                                <option key={m}>{m}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className={styles["nav-right"]}>
                    <HomeButton />
                </div>
            </div>
            {/* 🔄 navigation-bar 리팩토링 끝 */}

            {/* diary cards */}
            <div className={styles["list-container"]}>
                {diaries.length === 0 ? (
                    <p className={styles.empty}>
                        해당 월에 작성된 일기가 없습니다.
                    </p>
                ) : (
                    diaries.map((d) => (
                        <div
                            key={d.diary_id}
                            className={styles["diary-card"]}
                            onClick={() => {
                                setIsLoading(true);
                                navigate(`/imagegen/${d.diary_id}`, {
                                    state: d,
                                });
                            }}
                        >
                            <div className={styles.date}>
                                {new Date(d.created_at).toLocaleDateString(
                                    "ko-KR",
                                    {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        weekday: "short",
                                    }
                                )}
                            </div>
                            <div className={styles.summary}>
                                {d.summary || "내용 없음"}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DiaryList;
