import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ImageGen.css";
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
    // Hook 은 이미 위에서 호출됐으므로 규칙 위반이 아님
    navigate("/");
    return null;
  }

  /* ---------------- 이미지 생성 · 저장 ---------------- */
  const handleGenerate = async () => {
    /* 데모용 : Hook setter 사용 → unused-var 경고 방지 */
    setIsGenerating(true);            // ★ 로딩 상태 ON
    alert("⚠️  이미지 생성 기능은 구현 준비 중입니다.");

    /* TODO: DALLE API 호출 후 setImageUrl(url) */
    setIsGenerating(false);           // ★ 로딩 상태 OFF
  };

  const handleSave = () =>
    alert("⚠️  저장 API 연결 전입니다. (TODO: POST /api/diary/photo)");

  /* ---------------- 렌더링 ---------------- */
  return (
    <div className="imagegen-page">
      {/* ── 상단바 ─────────────────────────────────── */}
      <div className="top-bar">
        <PreviousArrow />
        <img src={Smiley} alt="마스코트" className="mascot" />
        <HomeButton />
      </div>

      {/* ── 이미지(또는 플레이스홀더) ───────────────── */}
      <div className="image-wrapper">
        {imageUrl ? (
          <img src={imageUrl} alt="감정 이미지" className="generated-img" />
        ) : (
          <div className="placeholder">
            {isGenerating ? "이미지 생성중…" : "이미지가 없습니다."}
          </div>
        )}
      </div>

      {/* ── 일기 카드 ─────────────────────────────── */}
      <div className="diary-card">
        <div className="diary-date">
          {new Date(diary.created_at).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "short",
          })}
        </div>
        <p className="diary-content">{diary.content}</p>
      </div>

      {/* ── 하단 버튼 ─────────────────────────────── */}
      <div className="bottom-buttons">
        <button className="action-btn gen" onClick={handleGenerate}>
          이미지 생성하기
        </button>
        <button className="action-btn save" onClick={handleSave}>
          저장하기
        </button>
      </div>
    </div>
  );
};

export default ImageGen;