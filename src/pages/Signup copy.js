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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("비밀번호가 일치하지 않습니다.");
            return;
        }
        setError(""); // 오류 메시지 초기화
        console.log(
            "Email:",
            email,
            "Username:",
            username,
            "Password:",
            password
        );
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
