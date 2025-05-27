import React, { useEffect, useState, useContext, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./RecordSummary.css";
import Smiley from "../assets/images/image-50.png";
import ChevronLeft from "../assets/images/chevron-left0.svg";
import HomeIcon from "../assets/images/home0.svg";
import { UserContext } from "./UserContext";
import axios from "axios";

const RecordSummary = () => {
    const { user } = useContext(UserContext);
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

                return `${formattedDate}\n${entry.content}\n---\n`;
            })
            .join("\n");

        setSummary(formatted);
    }, [diaries]);

    const handleAIClick = async () => {
        try {
            const response = await axios.post(
                "https://ms-fom-backend-hwcudkcfgedgcagj.eastus2-01.azurewebsites.net/api/diary_writing",
                { entries: diaries }, // ✅ 여기서 곧바로 diaries 사용 가능!
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            setSummary(response.data.generatedDiary);
        } catch (error) {
            alert("AI 요청 실패!");
        }
    };

    if (!user) {
        navigate("/login");
        return null;
    }

    return (
        <div className="summary-page">
            <div className="summary-header">
                <img
                    src={ChevronLeft}
                    alt="뒤로가기"
                    onClick={() => navigate(-1)}
                />
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
                <button onClick={() => alert("DB 저장 구현 예정")}>
                    저장하기
                </button>
                <button onClick={() => navigate("/report")}>
                    포미와 이야기하기
                </button>
            </div>
        </div>
    );
};

export default RecordSummary;
