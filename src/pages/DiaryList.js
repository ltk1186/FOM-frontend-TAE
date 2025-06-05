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

  useEffect(() => {
    if (!user?.user_id) return;

    const fetchDiaries = async () => {
      setIsLoading(true);
      const result = [];
      const daysInMonth = new Date(year, month, 0).getDate();
      // 가장 최근 날짜가 위로 오도록 내림차순 순회
      for (let day = daysInMonth; day >= 1; day--) {
        const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(
          day
        ).padStart(2, "0")}`;
        try {
          const res = await axios.get(
            "https://fombackend.azurewebsites.net/api/diary/read",
            {
              params: {
                user_id: user.user_id,
                selected_date: dateStr,
              },
            }
          );
          // 일기가 있고 summary가 있으면 추가
          if (Array.isArray(res.data) && res.data.length > 0) {
            const { diary_id, created_at, summary } = res.data[0];
            if (summary && summary.trim() !== "") {
              result.push({ diary_id, created_at, summary });
            }
          }
        } catch (e) {
          // 일기가 없는 날은 무시
        }
      }
      setDiaries(result);
      setIsLoading(false);
    };

    fetchDiaries();
  }, [user?.user_id, year, month, setIsLoading]);

  // 연/월 선택 옵션
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 5 }, (_, i) => thisYear - i);

  return (
    <div
      className={styles["diary-list-page"]}
      style={{ minHeight: "100svh", height: "auto", overflowY: undefined }}
    >
      {/* top nav */}
      <div className={styles["list-top-nav"]}>
        <PreviousArrow />
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
        <HomeButton />
      </div>
      {/* diary cards */}
      <div className={styles["list-container"]}>
        {diaries.length === 0 ? (
          <p className={styles.empty}>해당 월에 작성된 일기가 없습니다.</p>
        ) : (
          diaries.map((d) => (
            <div
              key={d.diary_id}
              className={styles["diary-card"]}
              onClick={() => {
                setIsLoading(true);
                navigate(`/imagegen/${d.diary_id}`, { state: d });
              }}
            >
              <div className={styles.date}>
                {new Date(d.created_at).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  weekday: "short",
                })}
              </div>
              <div className={styles.summary}>{d.summary}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DiaryList;
