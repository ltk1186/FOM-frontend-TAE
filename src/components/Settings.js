// src/components/Settings.js
import React from "react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();

  return (
    <span
      role="img"
      aria-label="설정"
      style={{
        fontSize: "20px",
        marginLeft: "12px",
        cursor: "pointer",
        userSelect: "none",
      }}
      onClick={() => navigate("/settings")}
    >
      ⚙️
    </span>
  );
};

export default Settings;
