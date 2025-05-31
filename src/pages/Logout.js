// src/pages/Logout.js
import React, { useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const { logoutUser, setIsLoading } = useContext(UserContext); // 🔹 setIsLoading 추가
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true); // 🔹 로딩 시작
    logoutUser(); // 로그아웃 (Context 비우기)
    navigate("/login"); // 로그아웃 후 로그인 페이지로 이동
  }, [logoutUser, navigate, setIsLoading]);

  return null; // 렌더링할 요소가 없으므로 null 사용
};

export default Logout;
