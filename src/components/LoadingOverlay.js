import React, { useContext } from "react";
import "./LoadingOverlay.css";
import { UserContext } from "../pages/UserContext";
import orbImage from "../assets/images/emotion-orbs.png"; // 이미지 import 방식

const LoadingOverlay = () => {
  const { isLoading } = useContext(UserContext);

  if (!isLoading) return null;

  return (
    <div className="loading-overlay">
      <img src={orbImage} alt="로딩 중" className="spinner" />
    </div>
  );
};

export default LoadingOverlay;
