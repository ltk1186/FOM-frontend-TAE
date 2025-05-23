// src/pages/Calender.js
import React, { useState, useContext, useEffect } from "react";
import Calendar from "react-calendar";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
import "react-calendar/dist/Calendar.css";
import "./Login.css";
import ChevronLeft from "../assets/images/chevron-left0.svg";

const Diarylist = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    if (!user) {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  }, [user, navigate]);

  // 만약 유저 로그인 확인이 안 된 상태에서는 컴포넌트를 렌더링하지 않음.
  if (!user) {
    return null;
  }

  return (
    <div className="login-2">
      {/* 뒤로가기 버튼 */}
      <div className="nav-back">
        <img
          src={ChevronLeft}
          alt="뒤로가기"
          className="chevron-left"
          onClick={() => navigate(-1)}
        />
      </div>
      <div className="home" onClick={() => navigate("/")}>
        🏠
      </div>

      {/* 유저 일기 페이지 */}
      <div className="frame-12">
        <h2 className="div2">{user.email}님의 일기 📖</h2>

        {/* 달력 컴포넌트 */}
        <div className="frame-7">
          <Calendar
            onChange={(newDate) => setDate(newDate)} // 달력 날짜 변경 핸들러
            value={date} // 현재 선택된 날짜
            formatDay={(locale, date) => date.getDate()} // 날짜만 표시
          />
          <div className="selected-date">
            선택한 날짜: {date.toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Diarylist;
