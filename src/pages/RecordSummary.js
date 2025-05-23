import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RecordSummary.css";
import Smiley from "../assets/images/image-50.png";
import ChevronLeft from "../assets/images/chevron-left0.svg";
import HomeIcon from "../assets/images/home0.svg";

const RecordSummary = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState("");

  // ✅ localStorage에서 기존 일지 불러오기
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("diaries") || "[]");

    const formatted = stored
      .map((entry) =>
        `${entry.createdAt}\n${entry.title}\n${entry.content}\n-----\n`
      )
      .join("\n");

    setSummary(formatted);
  }, []);

  // ✅ AI 버튼 클릭 시 JSON 배열로 파싱 & 전송
  const handleAIClick = async () => {
    const stored = JSON.parse(localStorage.getItem("diaries") || "[]");

    try {
      const response = await fetch("https://your-api-endpoint.com/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ entries: stored }),
      });

      const data = await response.json();
      setSummary(data.generatedDiary); // 🔁 결과 텍스트 박스에 표시
    } catch (error) {
      alert("AI 요청 실패!");
    }
  };

  return (
    <div className="summary-page">
      {/* 상단 네비 */}
      <div className="summary-header">
        <img src={ChevronLeft} alt="뒤로가기" onClick={() => navigate(-1)} />
        <img src={HomeIcon} alt="홈" onClick={() => navigate("/")} />
      </div>

      <img src={Smiley} alt="스마일" className="summary-smiley" />

      <textarea
        className="summary-textarea"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />

      <div className="summary-buttons">
        <button onClick={handleAIClick}>AI 일기 완성</button>
        <button onClick={() => alert("DB 저장 구현 예정")}>저장하기</button>
        <button onClick={() => navigate("/report")}>포미와 이야기하기</button>
      </div>
    </div>
  );
};

export default RecordSummary;
