import React, { useState, useContext, useEffect } from "react"; // useEffect 추가
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import styles from "./Login.module.css"; // 🔄 변경됨
// import backgroundImage from "../assets/images/login-1.png"; // ❌ 제거됨
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
        "https://fombackend.azurewebsites.net/api/login",
        { email, password }
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
      className={styles["record-edit-container"]} // 🔄 변경됨
      // style={{ backgroundImage: `url(${backgroundImage})` }} // ❌ 제거됨: 전역 배경으로 대체
    >
      <div className={styles["top-buttons"]}>
        {" "}
        {/* 🔄 변경됨 */}
        <PreviousArrow />
        <div className={styles["right-buttons"]}>
          {" "}
          {/* 🔄 변경됨 */}
          <HomeButton />
        </div>
      </div>

      <div className={styles["frame-12"]}>
        {" "}
        {/* 🔄 변경됨 */}
        <div className={styles.div2}>로그인</div> {/* 🔄 변경됨 */}
        <form className={styles["frame-7"]} onSubmit={handleSubmit}>
          {" "}
          {/* 🔄 변경됨 */}
          <div className={styles["text-field"]}>
            {" "}
            {/* 🔄 변경됨 */}
            <label htmlFor="email" className={styles.label}>
              {" "}
              {/* 🔄 변경됨 */}
              이메일
            </label>
            <div className={styles.input}>
              {" "}
              {/* 🔄 변경됨 */}
              <input
                type="email"
                id="email"
                className={styles.value} // 🔄 변경됨
                placeholder="이메일 입력"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className={styles["password-field"]}>
            {" "}
            {/* 🔄 변경됨 */}
            <label htmlFor="password" className={styles.label}>
              {" "}
              {/* 🔄 변경됨 */}
              비밀번호
            </label>
            <div className={styles.input}>
              {" "}
              {/* 🔄 변경됨 */}
              <input
                type="password"
                id="password"
                className={styles.value} // 🔄 변경됨
                placeholder="비밀번호 입력"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <br />
          <button type="submit" className={styles.button}>
            {" "}
            {/* 🔄 변경됨 */}
            <span className={styles.label2}>로그인</span> {/* 🔄 변경됨 */}
          </button>
          <p className={styles["signup-text"]}>
            {" "}
            {/* 🔄 변경됨 */}
            계정이 없으신가요?{" "}
            <span
              className={styles["signup-link"]} // 🔄 변경됨
              onClick={() => navigate("/signup")}
            >
              회원가입
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
