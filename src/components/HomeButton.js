// src/components/HomeButton.js
import React from "react";
import { useNavigate } from "react-router-dom";
import homeIcon from "../assets/images/home0.svg";

const HomeButton = () => {
  const navigate = useNavigate();

  return (
    <img
      src={homeIcon}
      alt="홈으로"
      style={{ width: "24px", height: "24px", cursor: "pointer" }}
      onClick={() => navigate("/")}
    />
  );
};

export default HomeButton;
