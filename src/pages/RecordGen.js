import React, { useEffect, useRef, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./RecordGen.module.css"; // 🔄 CSS 모듈로 변경
// import backgroundImage from "../assets/images/login-2.png"; // ❌ 제거됨
import PreviousArrow from "../components/PreviousArrow";
import HomeButton from "../components/HomeButton";
import Settings from "../components/Settings";
import { UserContext } from "./UserContext";
import micIcon from "../assets/images/mic.png";
import axios from "axios";

const RecordGen = () => {
  const { user, setIsLoading } = useContext(UserContext); // 🔹 추가됨
  const navigate = useNavigate();
  const location = useLocation();
  const textareaRef = useRef(null);

  const [logTitle, setLogTitle] = useState("");
  const [logContent, setLogContent] = useState("");
  const [isRecording, setIsRecording] = useState(location.state?.mic || false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const recognitionRef = useRef(null);
  const isRecognizingRef = useRef(false);

  // 🔄 수정: 스크롤 여부 상태
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsKeyboardOpen(window.innerHeight < 500);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    textareaRef.current?.focus();

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("이 브라우저는 음성 인식을 지원하지 않습니다.");
      return;
    }

    const recog = new SpeechRecognition();
    recog.lang = "ko-KR";
    recog.continuous = true;
    recog.interimResults = false;

    recog.onstart = () => {
      isRecognizingRef.current = true;
    };

    recog.onend = () => {
      isRecognizingRef.current = false;
    };

    recog.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript.trim() + " ";
        }
      }
      if (transcript.trim()) {
        setLogContent((prev) => prev + (prev ? " " : "") + transcript.trim());
      }
    };

    recognitionRef.current = recog;

    if (location.state?.mic) {
      try {
        recog.start();
      } catch (e) {
        console.warn("초기 STT 시작 실패:", e.message);
      }
    }

    return () => {
      recog.stop();
    };
  }, [location.state?.mic]);

  // 🔹 페이지 진입 후 로딩 해제
  useEffect(() => {
    setIsLoading(false);
  }, [setIsLoading]);

  const handleToggleMic = () => {
    const recog = recognitionRef.current;
    if (!recog) return;

    if (isRecording) {
      recog.stop();
      setIsRecording(false);
    } else {
      if (!isRecognizingRef.current) {
        try {
          recog.start();
          setIsRecording(true);
        } catch (e) {
          console.warn("녹음 재시작 실패:", e.message);
        }
      }
    }
  };

  const handleCancel = () => {
    recognitionRef.current?.stop();
    navigate("/recorddiary");
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

    const newDiary = {
      id: Date.now().toString(),
      createdAt: formattedCreatedAt,
      title: logTitle || "제목 없음",
      content: logContent || "내용 없음",
    };

    setIsLoading(true); // 🔹 저장 시작 시 로딩 표시

    try {
      const response = await axios.post(
        "https://fombackend.azurewebsites.net/api/temp_diary/create",
        {
          user_id: user.user_id,
          title: newDiary.title,
          content: newDiary.content,
          created_at: newDiary.createdAt,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("✅ DB 저장 성공:", response.data);
    } catch (error) {
      console.error("DB 저장 오류:", error);
    } finally {
      setIsLoading(false); // 🔹 저장 완료 시 로딩 해제
      navigate("/recorddiary"); // 🔹 로딩 해제 후 이동
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div
      className={`${styles["record-edit-container"]} ${
        isKeyboardOpen ? styles["keyboard-open"] : ""
      }`} // 🔄 className 수정
    >
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

      <div className={styles["record-edit-box"]}>
        {" "}
        {/* 🔄 */}
        <div className={styles["log-time-label"]}>제목을 입력하세요</div>
        <input
          className={styles["log-title"]}
          placeholder="제목"
          value={logTitle}
          onChange={(e) => setLogTitle(e.target.value)}
        />
        <textarea
          className={styles["log-content"]}
          ref={textareaRef}
          placeholder="일기 내용을 입력하세요"
          value={logContent}
          onChange={(e) => setLogContent(e.target.value)}
        />
      </div>

      {location.state?.mic && (
        <button
          className={`${styles["record-toggle-btn"]} ${
            isRecording ? styles["on"] : styles["off"]
          }`} // 🔄
          onClick={handleToggleMic}
        >
          <img src={micIcon} alt="Mic" className={styles["mic-icon"]} />
        </button>
      )}

      <div className={styles["record-edit-footer"]}>
        {" "}
        {/* 🔄 */}
        <button className={styles["cancel-button"]} onClick={handleCancel}>
          취소
        </button>
        <button className={styles["save-button"]} onClick={handleSave}>
          저장
        </button>
      </div>
    </div>
  );
};

export default RecordGen;
