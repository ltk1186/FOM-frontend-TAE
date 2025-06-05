import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./ImageGen.module.css";
import PreviousArrow from "../components/PreviousArrow";
import HomeButton from "../components/HomeButton";
import Smiley from "../assets/images/image-50.png";
import { UserContext } from "./UserContext";
import axios from "axios";

const ImageGen = () => {
  const { state: diary } = useLocation();
  const navigate = useNavigate();
  const { setIsLoading } = useContext(UserContext);

  const [imageUrl, setImageUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // diary 없으면 홈으로
  useEffect(() => {
    if (!diary) {
      setIsLoading(true);
      navigate("/");
    }
    setIsLoading(false);
  }, [diary, navigate, setIsLoading]);

  if (!diary) return null;

  // 이미지 생성
  const handleGenerate = async () => {
    if (!diary.summary || !diary.diary_id) {
      alert("요약문 또는 일기 ID가 없습니다.");
      return;
    }
    setIsGenerating(true);
    setIsLoading(true);
    try {
      // 백엔드 API 호출 (summary만 content로 사용)
      const res = await axios.put(
        "https://fombackend.azurewebsites.net/api/diary/image/create",
        {
          diary_id: diary.diary_id,
          content: diary.summary,
          created_at: diary.created_at,
        }
      );
      const url = res.data?.URL || res.data?.url;
      if (url) {
        setImageUrl(url);
      } else {
        alert("이미지 URL을 받지 못했습니다.");
      }
    } catch (err) {
      alert("이미지 생성 실패: " + (err?.response?.data?.message || err.message));
    }
    setIsGenerating(false);
    setIsLoading(false);
  };

  // 이미지 URL 저장
  const handleSave = async () => {
    if (!imageUrl || !diary.diary_id) {
      alert("이미지가 없거나 일기 ID가 없습니다.");
      return;
    }
    setIsLoading(true);
    try {
      await axios.put(
        `https://fombackend.azurewebsites.net/api/diary/${diary.diary_id}`,
        { photo: imageUrl }
      );
      alert("저장 성공했습니다.");
    } catch (err) {
      alert("저장 실패: " + (err?.response?.data?.message || err.message));
    }
    setIsLoading(false);
  };

  return (
    <div className={styles["imagegen-page"]}>
      {/* ── 상단바 ───────────────────────────── */}
      <div className={styles["top-bar"]}>
        <PreviousArrow />
        <img src={Smiley} alt="마스코트" className={styles.mascot} />
        <HomeButton />
      </div>

      {/* ── 이미지(또는 플레이스홀더) ───────────── */}
      <div className={styles["image-wrapper"]}>
        {imageUrl ? (
          <img src={imageUrl} alt="감정 이미지" className={styles["generated-img"]} />
        ) : (
          <div className={styles.placeholder}>
            {isGenerating ? "이미지 생성중…" : "이미지가 없습니다."}
          </div>
        )}
      </div>

      {/* ── 일기 카드 ───────────────────────── */}
      <div className={styles["diary-card"]}>
        <div className={styles["diary-date"]}>
          {new Date(diary.created_at).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "short",
          })}
        </div>
        <p className={styles["diary-content"]}>{diary.summary}</p>
      </div>

      {/* ── 하단 버튼 ───────────────────────── */}
      <div className={styles["bottom-buttons"]}>
        <button
          className={`${styles["action-btn"]} ${styles.gen}`}
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          이미지 생성하기
        </button>
        <button
          className={`${styles["action-btn"]} ${styles.save}`}
          onClick={handleSave}
          disabled={!imageUrl}
        >
          저장하기
        </button>
      </div>
    </div>
  );
};

export default ImageGen;