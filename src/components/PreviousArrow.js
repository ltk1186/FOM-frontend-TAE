// src/components/PreviousArrow.js
import React from "react";
import { useNavigate } from "react-router-dom";
import chevronLeft from "../assets/images/chevron-left0.svg";

const PreviousArrow = () => {
  const navigate = useNavigate();

  return (
    <img
      src={chevronLeft}
      alt="뒤로가기"
      style={{ width: "24px", height: "24px", cursor: "pointer" }}
      onClick={() => navigate(-1)}
    />
  );
};

export default PreviousArrow;
