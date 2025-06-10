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
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false); // 🔹 키보드 열림 여부 상태

  const { user, setIsLoading } = useContext(UserContext); // 🔹 setIsLoading 추가
  const navigate = useNavigate();
  const location = useLocation();

  const diaries = useMemo(
    () => location.state?.diaries || [],
    [location.state?.diaries]
  );
  const [summary, setSummary] = useState("");

  // 🔄 수정: 스크롤 여부 감지 상태 추가
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  // 🔽 VisualViewport API를 활용한 소프트 키보드 감지
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
      handleViewportResize(); // 초기 상태 감지
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener(
          "resize",
          handleViewportResize
        );
        window.visualViewport.removeEventListener(
          "scroll",
          handleViewportResize
        );
      }
    };
  }, []);

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

    setIsLoading(true);
    try {
      await axios.put(
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
      // ✅ 저장 후 오늘 날짜를 포함한 캘린더로 이동
      const getTodayString = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const dd = String(today.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
      };
      navigate("/calendar", { state: { selectedDate: getTodayString() } });
    } catch (error) {
      console.error("DB 저장 오류:", error);
      alert("일기 저장에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // const handleGoBack = () => {
  //   setIsLoading(true); // 🔹 뒤로 가기 로딩
  //   navigate(-1);
  // };

  // const handleGoReport = () => {
  //   setIsLoading(true); // 🔹 포미와 이야기하기 로딩
  //   navigate("/report");
  // };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div
      className={`${styles["summary-page"]} ${
        isKeyboardOpen ? styles["keyboard-open"] : ""
      }`}
    >
      {" "}
      {/* ✅ className 수정 */}
      {/* 🔄 수정: navigation-bar 통일 */}
      <div
        className={`${styles["navigation-bar"]} ${
          isScrolled ? styles["scrolled"] : ""
        }`}
      >
        <div className={styles["nav-left"]}>
          <PreviousArrow />
        </div>
        <div className={styles["nav-right"]}>
          <div className={styles["button-settings"]}>
            <Settings />
          </div>
          <div className={styles["button-home"]}>
            <HomeButton />
          </div>
        </div>
      </div>
      <img src={Smiley} alt="스마일" className={styles["summary-smiley"]} />{" "}
      {/* ✅ */}
      <textarea
        className={styles["summary-textarea"]}
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />
      <div className={styles["summary-buttons"]}>
        <button onClick={handleAIClick} className={styles["diary-complete"]}>
          AI 일기 완성
        </button>
        <button onClick={handleSave} className={styles["diary-save"]}>
          저장
        </button>
      </div>
    </div>
  );
};

export default RecordSummary;
