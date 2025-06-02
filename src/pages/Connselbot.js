import React, { useState } from "react";
import axios from "axios";
import PreviousArrow from "../components/PreviousArrow";
import HomeButton from "../components/HomeButton";

import styles from "./Connselbot.module.css"; // 🔄 변경됨

const Connselbot = () => {
  const [messages, setMessages] = useState([]); // 대화 기록
  const [input, setInput] = useState(""); // 입력 필드 상태
  const [loading, setLoading] = useState(false); // 로딩 상태

  const sendMessage = async () => {
    if (!input.trim()) return; // 빈 입력 방지

    // 메시지 전송
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:8000/chat/", {
        text: input,
      });

      // 응답 추가
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.data.response },
      ]);
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
    } finally {
      setInput(""); // 입력 상태 초기화
      setLoading(false); // 로딩 상태 해제
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage(); // Enter 키 입력 시 메시지 전송
    }
  };

  return (
    <div className={styles["body-area"]}>
      <div className={styles["top-buttons"]}>
        {" "}
        {/* 🔄 변경됨 */}
        <PreviousArrow />
        <div className={styles["right-buttons"]}>
          {" "}
          {/* 🔄 변경됨 */}
          <HomeButton />
        </div>
      </div>
      {/* ✅ 오늘 날짜 표시 영역 */}
      <div className={styles["date-container"]}>
        {" "}
        {/* 🔄 변경됨 */}
        {new Date().toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>
      <div className={styles["chat-container"]}>
        {" "}
        {/* 🔄 변경됨 */}
        <div className={styles.messages}>
          {" "}
          {/* 🔄 변경됨 */}
          {/* 메시지 기록 */}
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`${styles.message} ${
                msg.role === "user" ? styles.user : styles.assistant
              }`} // 🔄 변경됨
            >
              {msg.content}
            </div>
          ))}
          {/* 로딩 상태 표시 */}
          {loading && (
            <div className={styles.loading}>Bot is typing...</div>
          )}{" "}
          {/* 🔄 변경됨 */}
        </div>
        {/* 입력 영역 */}
        <div className={styles["input-container"]}>
          {" "}
          {/* 🔄 변경됨 */}
          <input
            className={styles["input-area"]} // 🔄 변경됨
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button className={styles["mic-button"]}></button> {/* 🔄 변경됨 */}
          <button
            className={styles["send-button"]}
            onClick={sendMessage}
          ></button>{" "}
          {/* 🔄 변경됨 */}
        </div>
      </div>
    </div>
  );
};

export default Connselbot;
