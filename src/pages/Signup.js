import React, { useState, useContext, useEffect } from "react"; // 🔹 useEffect 추가
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Login.css를 그대로 사용
import backgroundImage from "../assets/images/login-1.png";
import PreviousArrow from "../components/PreviousArrow";
import HomeButton from "../components/HomeButton";
import { UserContext } from "./UserContext"; // 🔹 추가

const Signup = () => {
    const navigate = useNavigate();
    const { setIsLoading } = useContext(UserContext); // 🔹 추가

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");

    // 🔹 페이지 진입 시 로딩 해제
    useEffect(() => {
        setIsLoading(false);
    }, [setIsLoading]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("비밀번호가 일치하지 않습니다.");
            return;
        }

        setError("");
        setIsLoading(true); // 🔹 로딩 시작

        try {
            const response = await fetch(
                // "https://ms-fom-backend-hwcudkcfgedgcagj.eastus2-01.azurewebsites.net/api/signup",
                "https://fombackend.azurewebsites.net/api/signup",
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

            if (response.ok) {
                const data = await response.json();
                console.log("회원가입 성공:", data);
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
        } finally {
            setIsLoading(false); // 🔹 로딩 종료
        }
    };

    return (
        <div
            className="record-edit-container"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div className="top-buttons">
                <PreviousArrow />
                <div className="right-buttons">
                    <HomeButton />
                </div>
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
