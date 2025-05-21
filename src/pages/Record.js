import React, { useState, useRef, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // CSS 적용됨
import ChevronLeft from "../assets/images/chevron-left0.svg";

const Record = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    useEffect(() => {
        if (!user) {
            alert("로그인 후 사용할 수 있습니다!");
            navigate("/login");
        }
    }, [user, navigate]);

    const [message, setMessage] = useState("");
    const [chatList, setChatList] = useState([]);
    const [listening, setListening] = useState(false);
    const chatContainerRef = useRef(null);
    const recognition = useRef(null);

    const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

    useEffect(() => {
        if (!SpeechRecognition) {
            alert("브라우저에서 음성인식을 지원하지 않습니다.");
            return;
        }

        recognition.current = new SpeechRecognition();
        recognition.current.lang = "ko-KR";
        recognition.current.interimResults = false;

        recognition.current.onresult = (event) => {
            const speechToText = event.results[0][0].transcript;
            setMessage((prevMsg) => `${prevMsg} ${speechToText}`.trim());
        };

        recognition.current.onend = () => {
            setListening(false);
        };
    }, []);

    const handleSpeechInput = () => {
        if (recognition.current && !listening) {
            recognition.current.start();
            setListening(true);
        }
    };

    const handleSendMessage = () => {
        if (message.trim() === "") return;
        setChatList((prev) => [...prev, message]);
        setMessage("");
    };

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop =
                chatContainerRef.current.scrollHeight;
        }
    }, [chatList]);

    if (!user) {
        return null;
    }

    return (
        <div className="login-2">
            <div className="nav-back">
                <img
                    src={ChevronLeft}
                    alt="뒤로가기"
                    className="chevron-left"
                    onClick={() => window.history.back()}
                />
            </div>
            <div className="home" onClick={() => navigate("/")}>
                🏠
            </div>

            <div className="frame-12">
                <h2 className="div2">{user.email}님의 음성 일기 💬</h2>

                <div
                    className="frame-7"
                    style={{ maxHeight: "400px", overflowY: "auto" }}
                    ref={chatContainerRef}
                >
                    {chatList.map((msg, index) => (
                        <div className="text-field" key={index}>
                            <div className="input">
                                <span className="value">{msg}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="frame-10">
                    <input
                        type="text"
                        placeholder="음성으로 입력하거나 텍스트로 작성"
                        className="input value"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />

                    <button className="button" onClick={handleSendMessage}>
                        <span className="label2">저장하기</span>
                    </button>
                    <button className="button2" onClick={handleSpeechInput}>
                        {listening ? "🎙️ 듣는 중..." : "🎤 음성 입력"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Record;
