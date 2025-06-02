import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./ImageGen.module.css"; // 🔄 변경됨
import PreviousArrow from "../components/PreviousArrow";
import HomeButton from "../components/HomeButton";
import Smiley from "../assets/images/image-50.png";

const ImageGen = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  /* ------------------------------------------------------------------
     🔸 Hook 은 **항상** 컴포넌트 최상단에서 호출되어야 합니다.
     ------------------------------------------------------------------*/
  const [imageUrl, setImageUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  /* ------------------------------------------------------------------
     넘어온 일기(Diary) 확인 ― 없으면 홈으로 리디렉션
     ------------------------------------------------------------------*/
  const diary = state;
  if (!diary) {
    navigate("/");
    return null;
  }

  /* ---------------- 이미지 생성 · 저장 ---------------- */
  const handleGenerate = async () => {
    setIsGenerating(true); // ★ 로딩 상태 ON
    alert("⚠️  이미지 생성 기능은 구현 준비 중입니다.");

    // TODO: DALLE API 호출 후 setImageUrl(url)
    setIsGenerating(false); // ★ 로딩 상태 OFF
  };

  const handleSave = () =>
    alert("⚠️  저장 API 연결 전입니다. (TODO: POST /api/diary/photo)");

  /* ---------------- 렌더링 ---------------- */
  return (
    <div className={styles["imagegen-page"]}>
      {" "}
      {/* 🔄 변경됨 */}
      {/* ── 상단바 ─────────────────────────────────── */}
      <div className={styles["top-bar"]}>
        {" "}
        {/* 🔄 변경됨 */}
        <PreviousArrow />
        <img src={Smiley} alt="마스코트" className={styles.mascot} />{" "}
        {/* 🔄 변경됨 */}
        <HomeButton />
      </div>
      {/* ── 이미지(또는 플레이스홀더) ───────────────── */}
      <div className={styles["image-wrapper"]}>
        {" "}
        {/* 🔄 변경됨 */}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="감정 이미지"
            className={styles["generated-img"]} // 🔄 변경됨
          />
        ) : (
          <div className={styles.placeholder}>
            {" "}
            {/* 🔄 변경됨 */}
            {isGenerating ? "이미지 생성중…" : "이미지가 없습니다."}
          </div>
        )}
      </div>
      {/* ── 일기 카드 ─────────────────────────────── */}
      <div className={styles["diary-card"]}>
        {" "}
        {/* 🔄 변경됨 */}
        <div className={styles["diary-date"]}>
          {" "}
          {/* 🔄 변경됨 */}
          {new Date(diary.created_at).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "short",
          })}
        </div>
        <p className={styles["diary-content"]}>{diary.content}</p>{" "}
        {/* 🔄 변경됨 */}
      </div>
      {/* ── 하단 버튼 ─────────────────────────────── */}
      <div className={styles["bottom-buttons"]}>
        {" "}
        {/* 🔄 변경됨 */}
        <button
          className={`${styles["action-btn"]} ${styles.gen}`}
          onClick={handleGenerate}
        >
          {" "}
          {/* 🔄 변경됨 */}
          이미지 생성하기
        </button>
        <button
          className={`${styles["action-btn"]} ${styles.save}`}
          onClick={handleSave}
        >
          {" "}
          {/* 🔄 변경됨 */}
          저장하기
        </button>
      </div>
    </div>
  );
};

export default ImageGen;
