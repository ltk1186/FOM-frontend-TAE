import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginIntro.css";
import character from "../assets/images/image-50.png";
import { UserContext } from "./UserContext"; // 🔹 추가

const LoginIntro = () => {
  const navigate = useNavigate();
  const { setIsLoading } = useContext(UserContext); // 🔹 추가

  // 🔹 페이지 진입 시 로딩 해제
  useEffect(() => {
    setIsLoading(false);
  }, [setIsLoading]);

  const handleNavigate = (path) => {
    setIsLoading(true); // 🔹 로딩 시작
    navigate(path);
  };

  return (
    <div className="login-intro">
      <img src={character} alt="마스코트" className="bouncy-character" />

      <h1 className="intro-title">오늘 하루가 궁금해요</h1>

      <button className="intro-button" onClick={() => handleNavigate("/login")}>
        로그인
      </button>

      <p className="signup-text">
        계정이 없으신가요?{" "}
        <span className="signup-link" onClick={() => handleNavigate("/signup")}>
          회원가입
        </span>
      </p>
    </div>
  );
};

export default LoginIntro;
