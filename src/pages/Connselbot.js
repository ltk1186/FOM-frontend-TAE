import React, { useState, useRef, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import PreviousArrow from "../components/PreviousArrow";
import HomeButton from "../components/HomeButton";

import styles from "./Connselbot.module.css";

const Connselbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const textareaRef = useRef(null);

    const { user, setIsLoading } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();

    const messagesEndRef = useRef(null);

    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }

        setIsLoading(false);
    }, [user, navigate, setIsLoading]);

    useEffect(() => {
        console.log(location.state);
        if (location.state?.prompt) {
            sendMessage(location.state.prompt);
            // 여기서 prompt를 비워줌 (초과전송 방지)
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const sendMessage = async (message) => {
        if (!message.trim()) return;

        setMessages((prev) => [...prev, { role: "user", content: message }]);
        setLoading(true);

        try {
            const res = await axios.post(
                "https://fomeapi.eastus2.cloudapp.azure.com/chat/",
                { text: message }
            );

            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: res.data.response },
            ]);
        } catch (error) {
            console.error("Error fetching chatbot response:", error);
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "죄송합니다, 응답을 받을 수 없습니다.",
                },
            ]);
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
        if (e.key === "Enter" && !loading && !e.shiftKey) {
            e.preventDefault();
            sendMessage(input);
        } else if (e.key === "Enter" && e.shiftKey) {
            e.preventDefault();
            setInput((prev) => prev + "\n");
            adjustTextareaHeight();
        }
    };

    return (
        <div className={styles["body-area"]}>
            <div className={styles["navigation-bar"]}>
                <div className={styles["nav-left"]}>
                    <PreviousArrow />
                </div>
                <div className={styles["nav-center"]}>마음상담</div>
                <div className={styles["nav-right"]}>
                    <HomeButton />
                </div>
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
                    <div ref={messagesEndRef} />
                </div>
                {loading && (
                    <div className={styles.loading}>Bot is typing...</div>
                )}
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
                        onClick={() => sendMessage(input)}
                        disabled={loading}
                    />
                </div>
            </div>
        </div>
    );
};

export default Connselbot;
