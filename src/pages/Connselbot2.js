import React, { useState, useRef, useEffect, useContext } from "react"; // 🔹 useRef 추가
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PreviousArrow from "../components/PreviousArrow";
import HomeButton from "../components/HomeButton";

import styles from "./Connselbot.module.css";

const Connselbot = () => {
  const [messages, setMessages] = useState([]); // 대화 기록
  const [input, setInput] = useState(""); // 입력 필드 상태
  const [loading, setLoading] = useState(false); // 로딩 상태
  const textareaRef = useRef(null); // 🔹 텍스트 영역 참조
  const [isScrolled, setIsScrolled] = useState(false); // 🔄 navigation-bar 리팩토링
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false); // 🔹 키보드 열림 여부

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setLoading(true);

    try {
      const res = await axios.post(
        "https://fomeapi.eastus2.cloudapp.azure.com/chat/",
        { text: input }
      );

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.data.response },
      ]);
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
    } finally {
      setInput("");
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    adjustTextareaHeight();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && loading) {
      e.preventDefault();
      return;
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    } else if (e.key === "Enter" && e.shiftKey) {
      setInput((prev) => prev + "\n");
    }
  };

  const navigate = useNavigate();
  const { user, setIsLoading } = useContext(UserContext); // 🔹 setIsLoading 추가

  useEffect(() => {
    setIsLoading(false);
  }, [setIsLoading]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0); // 🔄 navigation-bar 리팩토링
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔽 VisualViewport API로 키보드 열림 감지
  useEffect(() => {
    const handleViewportResize = () => {
      if (window.visualViewport) {
        const viewportHeight = window.visualViewport.height;
        const windowHeight = window.innerHeight;
        setIsKeyboardOpen(viewportHeight < windowHeight - 100); // 약간 여유
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleViewportResize);
      window.visualViewport.addEventListener("scroll", handleViewportResize);
      handleViewportResize();
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

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div
      className={`${styles["body-area"]} ${
        isKeyboardOpen ? styles["keyboard-open"] : ""
      }`}
    >
      {/* 🔄 navigation-bar 리팩토링 시작 */}
      <div
        className={`${styles["navigation-bar"]} ${
          isScrolled ? styles["scrolled"] : ""
        }`}
      >
        <div className={styles["nav-left"]}>
          <PreviousArrow />
        </div>
        <div className={styles["nav-center"]}>마음상담</div>
        <div className={styles["nav-right"]}>
          <HomeButton />
        </div>
      </div>
      {/* 🔄 navigation-bar 리팩토링 끝 */}

      <div className={styles["chat-container"]}>
        <div className={styles.messages}>
          <div className={styles["date-container"]}>
            {new Date().toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`${styles.message} ${
                msg.role === "user" ? styles.user : styles.assistant
              }`}
            >
              {msg.content}
            </div>
          ))}
          {loading && <div className={styles.loading}>Bot is typing...</div>}
        </div>
        <div className={styles["input-container"]}>
          <textarea
            ref={textareaRef}
            className={styles["input-area"]}
            placeholder="메세지를 입력하세요"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            rows="1"
            disabled={loading}
          />
          <button
            className={styles["send-button"]}
            onClick={sendMessage}
            disabled={loading}
          ></button>
        </div>
      </div>
    </div>
  );
};

export default Connselbot;
