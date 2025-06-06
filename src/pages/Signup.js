import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import PreviousArrow from "../components/PreviousArrow";
import { UserContext } from "./UserContext";

const Signup = () => {
    const navigate = useNavigate();
    const { setIsLoading } = useContext(UserContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");

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
        setIsLoading(true);

        try {
            const response = await fetch(
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
            setIsLoading(false);
        }
    };

    return (
        <div className={styles["record-edit-container"]}>
            {/* 🔄 수정: 단일 PreviousArrow만 있는 navigation-bar */}
            <div className={styles["navigation-bar"]}>
                <div className={styles["nav-left"]}>
                    <PreviousArrow />
                </div>
            </div>

            <div className={styles["frame-12"]}>
                <h1 className={styles["div2"]}>회원가입</h1>
                {error && <p className={styles["error-message"]}>{error}</p>}
                <form className={styles["frame-7"]} onSubmit={handleSubmit}>
                    <div className={styles["text-field"]}>
                        <label htmlFor="username" className={styles["label"]}>
                            활동명
                        </label>
                        <div className={styles["input"]}>
                            <input
                                type="text"
                                id="username"
                                className={styles["value"]}
                                placeholder="사용자 이름 입력"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className={styles["text-field"]}>
                        <label htmlFor="email" className={styles["label"]}>
                            이메일
                        </label>
                        <div className={styles["input"]}>
                            <input
                                type="email"
                                id="email"
                                className={styles["value"]}
                                placeholder="이메일 입력"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className={styles["password-field"]}>
                        <label htmlFor="password" className={styles["label"]}>
                            비밀번호
                        </label>
                        <div className={styles["input"]}>
                            <input
                                type="password"
                                id="password"
                                className={styles["value"]}
                                placeholder="비밀번호 입력"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className={styles["password-field"]}>
                        <label
                            htmlFor="confirmPassword"
                            className={styles["label"]}
                        >
                            비밀번호 확인
                        </label>
                        <div className={styles["input"]}>
                            <input
                                type="password"
                                id="confirmPassword"
                                className={styles["value"]}
                                placeholder="비밀번호 확인"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className={styles["button"]}>
                        <span className={styles["label2"]}>회원가입</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Signup;
