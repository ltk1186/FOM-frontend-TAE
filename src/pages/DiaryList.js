//ai 일기 완성본 DB에서 가져오는 페이지

import React, { useEffect, useState, useContext } from "react"; // 🔹 useContext 추가
import { useNavigate } from "react-router-dom";
import styles from "./DiaryList.module.css"; // 🔄 변경됨
import PreviousArrow from "../components/PreviousArrow";
import HomeButton from "../components/HomeButton";
import { UserContext } from "./UserContext"; // 🔹 추가

/* =======================================================================
   DUMMY DATA BLOCK  (❗API 연결 시 이 블록 통째로 삭제)
   =======================================================================*/
// <DUMMY_DATA_START>
const dummyDiaries = [
  {
    diary_id: 1,
    created_at: "2025-06-01T09:50:00",
    summary: "벚꽃비속 산책",
    content:
      "오늘은 모처럼 날씨가 좋아서 근처 공원에 산책을 갔는데, 마침 벚꽃이 비처럼 흩날리고 있었다. 우산도 필요 없을 만큼 따뜻한 바람이 불었고...",
  },
  {
    diary_id: 2,
    created_at: "2025-06-02T14:20:00",
    summary: "야경보다 반짝인 건 우리 웃음소리",
    content:
      "퇴근하자마자 친구랑 한강으로 달려갔다. 돗자리 깔고 앉아 치맥 한 입에 피로가 사르르 녹았다...",
  },
  {
    diary_id: 3,
    created_at: "2025-06-03T19:30:00",
    summary: "오늘도 참았다, 또 참았다",
    content: "점심시간이라 바쁜 걸 알겠는데, 너무 대놓고 불친절했다...",
  },
];
// <DUMMY_DATA_END>
/* =======================================================================
   실제 API 연결 시 ↓ 예시 참고 (axios import 후 사용)
   =======================================================================*/
// import axios from "axios";
// const fetchDiaries = async (userId, y, m) => {
//   const res = await axios.get(`/api/diary/list?user_id=${userId}&year=${y}&month=${m}`);
//   return res.data;          // [{ diary_id, created_at, summary, content }, ...]
// };

const DiaryList = () => {
  const navigate = useNavigate();
  const { setIsLoading } = useContext(UserContext); // 🔹 추가

  /* ---------- state ---------- */
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth() + 1;

  const [year, setYear] = useState(thisYear);
  const [month, setMonth] = useState(thisMonth);
  const [diaries, setDiaries] = useState([]);

  /* ---------- load (dummy or API) ---------- */
  useEffect(() => {
    setIsLoading(true); // 🔹 로딩 시작
    // 🔸 더미 사용
    const filtered = dummyDiaries.filter((d) => {
      const dt = new Date(d.created_at);
      return (
        dt.getFullYear() === Number(year) && dt.getMonth() + 1 === Number(month)
      );
    });
    setDiaries(filtered);
    setIsLoading(false); // 🔹 로딩 종료

    /* 🔻 API 사용 시
    (async () => {
      setIsLoading(true);
      const data = await fetchDiaries(user_id, year, month);
      setDiaries(data);
      setIsLoading(false);
    })();
    */
  }, [year, month, setIsLoading]);

  /* ---------- helpers ---------- */
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 5 }, (_, i) => thisYear - i); // 최근 5년

  /* ---------- render ---------- */
  return (
    <div className={styles["diary-list-page"]}>
      {" "}
      {/* 🔄 변경됨 */}
      {/* top nav */}
      <div className={styles["list-top-nav"]}>
        {" "}
        {/* 🔄 변경됨 */}
        <PreviousArrow />
        <div className={styles.dropdowns}>
          {" "}
          {/* 🔄 변경됨 */}
          <select value={year} onChange={(e) => setYear(e.target.value)}>
            {years.map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
          <select value={month} onChange={(e) => setMonth(e.target.value)}>
            {months.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </div>
        <HomeButton />
      </div>
      {/* diary cards */}
      <div className={styles["list-container"]}>
        {" "}
        {/* 🔄 변경됨 */}
        {diaries.length === 0 ? (
          <p className={styles.empty}>해당 월에 작성된 일기가 없습니다.</p> // 🔄 변경됨
        ) : (
          diaries.map((d) => (
            <div
              key={d.diary_id}
              className={styles["diary-card"]} // 🔄 변경됨
              onClick={() => {
                setIsLoading(true); // 🔹 클릭 시 로딩
                navigate(`/imagegen/${d.diary_id}`, { state: d });
              }}
            >
              <div className={styles.date}>
                {" "}
                {/* 🔄 변경됨 */}
                {new Date(d.created_at).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  weekday: "short",
                })}
              </div>
              <div className={styles.summary}>{d.summary}</div>{" "}
              {/* 🔄 변경됨 */}
              <div className={styles.content}>{d.content}</div>{" "}
              {/* 🔄 변경됨 */}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DiaryList;
