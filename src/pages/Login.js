import React, { useState, useContext, useEffect } from "react"; // useEffect 추가
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import "./Login.css";
import backgroundImage from "../assets/images/login-1.png";
import PreviousArrow from "../components/PreviousArrow";
import HomeButton from "../components/HomeButton";

const Login = () => {
  const navigate = useNavigate();
  const { loginUser, setIsLoading } = useContext(UserContext); // 🔹 setIsLoading 추가

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔹 페이지 진입 시 로딩 해제
  useEffect(() => {
    setIsLoading(false);
  }, [setIsLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true); // 🔹 로딩 시작
    try {
      const response = await axios.post(
        // "http://localhost:8000/api/login",
        "https://ms-fom-backend-hwcudkcfgedgcagj.eastus2-01.azurewebsites.net/api/login",
        {
          email,
          password,
        }
      );

      if (response.data.success) {
        const user_id = response.data.user_id;
        loginUser({ user_id });

        navigate("/homemenu");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error(error);
      alert("로그인 요청 중 오류가 발생했습니다.");
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
          <br></br>
          <button type="submit" className="button">
            <span className="label2">로그인</span>
          </button>
          <p className="signup-text">
            계정이 없으신가요?{" "}
            <span className="signup-link" onClick={() => navigate("/signup")}>
              회원가입
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
