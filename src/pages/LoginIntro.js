import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginIntro.module.css"; // 🔄 변경됨
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
    <div className={styles["login-intro"]}>
      {" "}
      {/* 🔄 변경됨 */}
      <img
        src={character}
        alt="마스코트"
        className={styles["bouncy-character"]} // 🔄 변경됨
      />
      <h1 className={styles["intro-title"]}>오늘 하루가 궁금해요</h1>{" "}
      {/* 🔄 변경됨 */}
      <button
        className={styles["intro-button"]} // 🔄 변경됨
        onClick={() => handleNavigate("/login")}
      >
        로그인
      </button>
      <p className={styles["signup-text"]}>
        {" "}
        {/* 🔄 변경됨 */}
        계정이 없으신가요?{" "}
        <span
          className={styles["signup-link"]} // 🔄 변경됨
          onClick={() => handleNavigate("/signup")}
        >
          회원가입
        </span>
      </p>
    </div>
  );
};

export default LoginIntro;
