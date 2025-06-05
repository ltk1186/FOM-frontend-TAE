import React, { useEffect, useState, useContext, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./RecordSummary.module.css"; // ✅ CSS 모듈 import로 변경
import Smiley from "../assets/images/image-50.png";
import PreviousArrow from "../components/PreviousArrow";
import Settings from "../components/Settings";
import HomeButton from "../components/HomeButton";
import { UserContext } from "./UserContext";
import axios from "axios";

const RecordSummary = () => {
  const { user, setIsLoading } = useContext(UserContext); // 🔹 setIsLoading 추가
  const navigate = useNavigate();
  const location = useLocation();

  const diaries = useMemo(
    () => location.state?.diaries || [],
    [location.state?.diaries]
  );
  const [summary, setSummary] = useState("");

  useEffect(() => {
    const formatted = diaries
      .map((entry) => {
        const formattedDate = entry.created_at
          ? new Date(entry.created_at).toLocaleString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "날짜 없음";

        return `${formattedDate}\n\n${entry.content}\n`;
      })
      .join("\n");

    setSummary(formatted);
  }, [diaries]);

  // 🔹 페이지 진입 시 로딩 해제
  useEffect(() => {
    setIsLoading(false);
  }, [setIsLoading]);

  const handleAIClick = async () => {
    setIsLoading(true); // 🔹 로딩 시작
    try {
      const response = await axios.post(
        // "https://ms-fom-backend-hwcudkcfgedgcagj.eastus2-01.azurewebsites.net/generate_diary",
        "https://fombackend.azurewebsites.net/generate_diary",
        { user_id: user.user_id, question_text: summary },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setSummary(response.data["일기 변환"]);
    } catch (error) {
      console.error("AI 편집 실패:", error);
      alert("AI 요청에 실패했습니다.");
    } finally {
      setIsLoading(false); // 🔹 로딩 종료
    }
  };

  const handleSave = async () => {
    const createdAt = new Date();
    const formattedCreatedAt = `${createdAt.getFullYear()}-${String(
      createdAt.getMonth() + 1
    ).padStart(2, "0")}-${String(createdAt.getDate()).padStart(
      2,
      "0"
    )} ${String(createdAt.getHours()).padStart(2, "0")}:${String(
      createdAt.getMinutes()
    ).padStart(2, "0")}:${String(createdAt.getSeconds()).padStart(2, "0")}`;

    setIsLoading(true); // 🔹 로딩 시작
    try {
      await axios.post(
        // "https://ms-fom-backend-hwcudkcfgedgcagj.eastus2-01.azurewebsites.net/api/diary/create/",
        "https://fombackend.azurewebsites.net/api/diary/create",
        {
          user_id: user.user_id,
          content: summary || "내용 없음",
          created_at: formattedCreatedAt,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      navigate("/recorddiary");
    } catch (error) {
      console.error("DB 저장 오류:", error);
      alert("일기 저장에 실패했습니다.");
    } finally {
      setIsLoading(false); // 🔹 로딩 종료
    }
  };

  const handleGoBack = () => {
    setIsLoading(true); // 🔹 뒤로 가기 로딩
    navigate(-1);
  };

  const handleGoReport = () => {
    setIsLoading(true); // 🔹 포미와 이야기하기 로딩
    navigate("/report");
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className={styles["summary-page"]}>
      {" "}
      {/* ✅ className 수정 */}
      <div className={styles["summary-header"]}>
        <PreviousArrow />
        <div className={styles["header-right-buttons"]}>
          <Settings />
          <HomeButton />
        </div>
      </div>
      <img src={Smiley} alt="스마일" className={styles["summary-smiley"]} />{" "}
      {/* ✅ */}
      {/* ✅ */}
      <textarea
        className={styles["summary-textarea"]}
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />
      <div className={styles["summary-buttons"]}>
        {" "}
        {/* ✅ */}
        <button onClick={handleAIClick}>AI 일기 완성</button>
        <button onClick={handleSave}>저장하기</button>
        <button onClick={handleGoReport}>포미와 이야기하기</button>
      </div>
    </div>
  );
};

export default RecordSummary;
