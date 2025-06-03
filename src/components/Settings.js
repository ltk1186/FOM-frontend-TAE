import React from "react";
import { useNavigate } from "react-router-dom";
import settingIcon from "../assets/images/setting.png";

const Settings = () => {
  const navigate = useNavigate();

  return (
    <img
      src={settingIcon}
      alt="설정"
      style={{
        width: "18px",
        height: "19px",
        marginLeft: "12px",
        cursor: "pointer",
        userSelect: "none",
        verticalAlign: "middle",
        marginTop: "3px",
      }}
      onClick={() => navigate("/settings")}
    />
  );
};

export default Settings;
