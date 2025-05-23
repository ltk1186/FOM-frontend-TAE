// src/pages/RecordGen.js
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./RecordGen.css";
import backgroundImage from "../assets/images/login-2.png";
import PreviousArrow from "../components/PreviousArrow";
import HomeButton from "../components/HomeButton";
import Settings from "../components/Settings";

const RecordGen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const textareaRef = useRef(null);

  const [logTitle, setLogTitle] = useState("");
  const [logContent, setLogContent] = useState("");
  const [isRecording, setIsRecording] = useState(location.state?.mic || false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const recognitionRef = useRef(null);
  const isRecognizingRef = useRef(false);

  // 키보드 상태 감지
  useEffect(() => {
    const handleResize = () => {
      setIsKeyboardOpen(window.innerHeight < 500); // 높이 기준 조절 가능
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
  }, []);

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

  const handleSave = () => {
    const newDiary = {
      id: Date.now().toString(),
      createdAt: new Date().toLocaleString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
      title: logTitle || "제목 없음",
      content: logContent || "내용 없음",
    };

    const existing = JSON.parse(localStorage.getItem("diaries") || "[]");
    localStorage.setItem("diaries", JSON.stringify([newDiary, ...existing]));
    navigate("/recorddiary");
  };

  return (
    <div
      className={`record-edit-container ${
        isKeyboardOpen ? "keyboard-open" : ""
      }`}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="top-buttons">
        <PreviousArrow />
        <div className="right-buttons">
          <Settings />
          <HomeButton />
        </div>
      </div>

      <div className="record-edit-box">
        <div className="log-time-label">제목을 입력하세요</div>
        <input
          className="log-title"
          placeholder="제목"
          value={logTitle}
          onChange={(e) => setLogTitle(e.target.value)}
        />
        <textarea
          className="log-content"
          ref={textareaRef}
          placeholder="일기 내용을 입력하세요"
          value={logContent}
          onChange={(e) => setLogContent(e.target.value)}
        />
      </div>

      {location.state?.mic && (
        <button
          className={`record-toggle-btn ${isRecording ? "on" : "off"}`}
          onClick={handleToggleMic}
        >
          🎤
        </button>
      )}

      <div className="record-edit-footer">
        <button className="cancel-button" onClick={handleCancel}>
          취소
        </button>
        <button className="save-button" onClick={handleSave}>
          저장하기
        </button>
      </div>
    </div>
  );
};

export default RecordGen;
