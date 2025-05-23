import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Login.css를 그대로 사용
import ChevronLeft from "../assets/images/chevron-left0.svg";

const Signup = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 비밀번호 확인 로직
        if (password !== confirmPassword) {
            setError("비밀번호가 일치하지 않습니다.");
            return;
        }
        setError(""); // 기존 오류 메시지 초기화

        try {
            // FastAPI 요청 (회원가입 데이터를 백엔드로 전달)
            const response = await fetch(
                "https://ms-fom-backend-hwcudkcfgedgcagj.eastus2-01.azurewebsites.net/api/signup",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username,
                        email,
                        password,
                    }),
                }
            );

            // 백엔드 응답 확인
            if (response.ok) {
                const data = await response.json();
                console.log("회원가입 성공:", data);

                // 홈 페이지로 이동
                navigate("/login");
            } else {
                const errorData = await response.json();
                console.error("회원가입 실패:", errorData);
                setError(
                    errorData.detail || "회원가입 중 문제가 발생했습니다."
                );
            }
        } catch (err) {
            console.error("네트워크 또는 서버 오류:", err);
            setError("서버와 연결하지 못했습니다. 다시 시도 해주세요.");
        }
    };

    return (
        <div className="login-2">
            {" "}
            {/* Login.css에서 상단 클래스 재활용 */}
            <div className="nav-back">
                <img
                    src={ChevronLeft}
                    alt="뒤로가기"
                    className="chevron-left"
                    onClick={() => navigate(-1)}
                />
            </div>
            <div className="home" onClick={() => navigate("/")}>
                🏠
            </div>
            <div className="frame-12">
                <h1 className="div2">회원가입</h1>{" "}
                {/* Login.css의 .div2 스타일 재사용 */}
                {error && <p className="error-message">{error}</p>}
                <form className="frame-7" onSubmit={handleSubmit}>
                    <div className="text-field">
                        <label htmlFor="username" className="label">
                            활동명
                        </label>
                        <div className="input">
                            <input
                                type="text"
                                id="username"
                                className="value"
                                placeholder="사용자 이름 입력"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="text-field">
                        <label htmlFor="email" className="label">
                            이메일
                        </label>
                        <div className="input">
                            <input
                                type="email"
                                id="email"
                                className="value"
                                placeholder="이메일 입력"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="password-field">
                        <label htmlFor="password" className="label">
                            비밀번호
                        </label>
                        <div className="input">
                            <input
                                type="password"
                                id="password"
                                className="value"
                                placeholder="비밀번호 입력"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="password-field">
                        <label htmlFor="confirmPassword" className="label">
                            비밀번호 확인
                        </label>
                        <div className="input">
                            <input
                                type="password"
                                id="confirmPassword"
                                className="value"
                                placeholder="비밀번호 확인"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="button">
                        <span className="label2">회원가입</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Signup;
