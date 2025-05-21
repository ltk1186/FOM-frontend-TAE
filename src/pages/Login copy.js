import React, { useState } from "react";
import "./Login.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Email:", email, "Password:", password);
    };

    return (
        <div className="login-2">
            <div className="div">
                <div className="chevron-left">◀</div>
                <div className="home">🏠</div>
            </div>
            <div className="frame-12">
                <div className="div2">로그인</div>
                <form className="frame-7" onSubmit={handleSubmit}>
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

                    <button type="submit" className="button">
                        <span className="label2">로그인</span>
                    </button>
                </form>

                <div className="frame-9">
                    <div className="horizontal-divider">
                        <div className="line"></div>
                    </div>
                    <div className="or">또는</div>
                    <div className="horizontal-divider">
                        <div className="line"></div>
                    </div>
                </div>

                <div className="frame-10">
                    <button className="button2">
                        <span className="icon2">🔵</span>
                        <span className="label3">Facebook으로 로그인</span>
                    </button>
                    <button className="button2">
                        <span className="icon3">🟢</span>
                        <span className="label3">Google로 로그인</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
