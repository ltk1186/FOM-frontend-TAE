import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import "./Login.css";
import ChevronLeft from "../assets/images/chevron-left0.svg";

const Login = () => {
    const navigate = useNavigate();
    const { loginUser } = useContext(UserContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                //"http://localhost:8000/api/login",
                "https://ms-fom-backend-hwcudkcfgedgcagj.eastus2-01.azurewebsites.net/api/login",
                {
                    email,
                    password,
                }
            );

            if (response.data.success) {
                loginUser({ email });
                navigate("/"); // 홈 페이지로 이동
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error(error);
            alert("로그인 요청 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="login-2">
            <div className="div">
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
            </div>
        </div>
    );
};

export default Login;
