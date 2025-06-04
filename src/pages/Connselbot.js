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

    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        textarea.style.height = "auto"; // 높이를 기본값으로 초기화
        textarea.style.height = `${textarea.scrollHeight}px`; // 내용에 맞춰 높이 조정
    };

    const sendMessage = async () => {
        if (!input.trim()) return; // 빈 입력 방지

        // 메시지 전송
        setMessages((prev) => [...prev, { role: "user", content: input }]);
        setLoading(true);

        try {
            const res = await axios.post(
                "https://fomeapi.eastus2.cloudapp.azure.com/chat/",
                { text: input }
            );

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

    const handleInputChange = (e) => {
        setInput(e.target.value); // 입력 값 갱신
        adjustTextareaHeight(); // 높이 조정 함수 호출
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && e.shiftKey) {
            e.preventDefault();
            setInput((prevInput) => prevInput + "\n"); // 개행 추가
        } else if (e.key === "Enter") {
            e.preventDefault();
            sendMessage(); // 메시지 전송 시작
        }
    };

    const navigate = useNavigate();
    const { user, setIsLoading } = useContext(UserContext); // 🔹 setIsLoading 추가

    useEffect(() => {
        setIsLoading(false);
    }, [setIsLoading]);

    if (!user) {
        navigate("/login");
        return null;
    }

    return (
        <div className={styles["body-area"]}>
            <div className={styles["top-buttons"]}>
                <PreviousArrow />
                <div className={styles["right-buttons"]}>
                    <HomeButton />
                </div>
            </div>
            <div className={styles["date-container"]}>
                {new Date().toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })}
            </div>
            <div className={styles["chat-container"]}>
                <div className={styles.messages}>
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`${styles.message} ${
                                msg.role === "user"
                                    ? styles.user
                                    : styles.assistant
                            }`}
                        >
                            {msg.content}
                        </div>
                    ))}
                    {loading && (
                        <div className={styles.loading}>Bot is typing...</div>
                    )}
                </div>
                <div className={styles["input-container"]}>
                    <textarea
                        ref={textareaRef} // 참조 설정
                        className={styles["input-area"]}
                        placeholder="Type a message..."
                        value={input}
                        onChange={handleInputChange} // 입력 시 높이 조정
                        onKeyDown={handleKeyPress} // 엔터 키 이벤트 처리
                        rows="1" // 기본 1 줄
                    />

                    <button
                        className={styles["send-button"]}
                        onClick={sendMessage}
                    ></button>
                </div>
            </div>
        </div>
    );
};

export default Connselbot;
