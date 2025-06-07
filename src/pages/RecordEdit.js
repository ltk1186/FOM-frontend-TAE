import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./RecordEdit.module.css"; // 🔄 변경됨
// import backgroundImage from "../assets/images/login-1.png"; // ❌ 제거됨
import PreviousArrow from "../components/PreviousArrow";
import HomeButton from "../components/HomeButton";
import Settings from "../components/Settings";
import { UserContext } from "./UserContext";
import trashIcon from "../assets/images/trash.png";
import axios from "axios";

const RecordEdit = () => {
  const { user, setIsLoading } = useContext(UserContext); // 🔹 setIsLoading 추가
  const navigate = useNavigate();
  const location = useLocation();

  const diaryId = location.state?.id;
  const diaryTitle = location.state?.title || "";
  const diaryContent = location.state?.content || "";

  const [logTime, setLogTime] = useState("");
  const [logTitle, setLogTitle] = useState(diaryTitle);
  const [logContent, setLogContent] = useState(diaryContent);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // ✅ 삭제 확인 팝업 상태

  // 🔄 수정: 스크롤 시 navigation-bar 스타일 적용을 위한 상태
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const createdAt = new Date();
    const formattedCreatedAt = `${createdAt.getFullYear()}-${String(
      createdAt.getMonth() + 1
    ).padStart(2, "0")}-${String(createdAt.getDate()).padStart(
      2,
      "0"
    )} ${String(createdAt.getHours()).padStart(2, "0")}:${String(
      createdAt.getMinutes()
    ).padStart(2, "0")}:${String(createdAt.getSeconds()).padStart(2, "0")}`;

    setLogTime(formattedCreatedAt);

    // 예외처리: state가 없다면 목록페이지로 이동
    if (!location.state) {
      setIsLoading(true); // 🔹 이동 시 로딩
      navigate("/recorddiary");
    }

    // 🔹 정상 진입 시 로딩 해제
    setIsLoading(false);
  }, [location.state, navigate, setIsLoading]);

  const handleSave = async () => {
    if (!diaryId) {
      alert("수정할 일기의 ID정보가 없습니다.");
      return;
    }

    const isoLogTime = new Date(logTime).toISOString();

    setIsLoading(true); // 🔹 저장 로딩 시작
    try {
      await axios.put(
        `https://fombackend.azurewebsites.net/api/temp_diary/${diaryId}`,
        {
          title: logTitle,
          content: logContent,
          created_at: isoLogTime,
        }
      );
      navigate("/recorddiary");
    } catch (error) {
      console.error("DB 수정 오류:", error);
    } finally {
      setIsLoading(false); // 🔹 저장 로딩 종료
    }
  };

  const handleDelete = async () => {
    if (!diaryId) {
      console.log(diaryId);
      return;
    }

    setIsLoading(true); // 🔹 삭제 로딩 시작
    try {
      await axios.delete(
        `https://fombackend.azurewebsites.net/api/temp_diary/delete?temp_diary_id=${diaryId}`
      );
      navigate("/recorddiary");
    } catch (error) {
      console.error("DB 삭제 오류:", error);
    } finally {
      setIsLoading(false); // 🔹 삭제 로딩 종료
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div
      className={styles["record-edit-container"]} // 🔄 변경됨
      // style={{ backgroundImage: `url(${backgroundImage})` }} // ❌ 제거됨: 전역 배경으로 대체
    >
      {/* 🔄 수정: navigation-bar 통일 */}
      <div
        className={`${styles["navigation-bar"]} ${
          isScrolled ? styles["scrolled"] : ""
        }`}
      >
        <div className={styles["nav-left"]}>
          <PreviousArrow />
        </div>
        <div className={styles["nav-right"]}>
          <div className={styles["button-settings"]}>
            <Settings />
          </div>
          <div className={styles["button-home"]}>
            <HomeButton />
          </div>
        </div>
      </div>

      <div className={styles["record-edit-box"]}>
        {" "}
        {/* 🔄 변경됨 */}
        <div className={styles["log-time"]}>{logTime}</div>
        <input
          className={styles["log-title"]}
          value={logTitle}
          onChange={(e) => setLogTitle(e.target.value)}
          placeholder="제목을 입력하세요"
        />
        <textarea
          className={styles["log-content"]}
          value={logContent}
          onChange={(e) => setLogContent(e.target.value)}
          placeholder="내용을 입력하세요"
        />
      </div>

      <div className={styles["record-edit-footer"]}>
        {" "}
        {/* 🔄 변경됨 */}
        <button
          className={styles["delete-button"]}
          onClick={() => setShowDeleteConfirm(true)} // ✅ 팝업 표시
        >
          <img src={trashIcon} alt="삭제" className="trash-icon" />
        </button>
        <button className={styles["save-button"]} onClick={handleSave}>
          저장
        </button>
      </div>
      {/* ✅ 삭제 확인 팝업창 */}
      {showDeleteConfirm && (
        <div
          className={styles["popup-overlay"]}
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className={styles["popup-content"]}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={trashIcon}
              alt="삭제 확인"
              className={styles["popup-image"]}
            />
            <div className={styles["popup-info"]}>
              <span className={styles["popup-message"]}>
                정말 삭제하시겠어요?
              </span>
            </div>
            <div className={styles["popup-actions"]}>
              <button className={styles["popup-btn"]} onClick={handleDelete}>
                예
              </button>
              <button
                className={styles["popup-btn"]}
                onClick={() => setShowDeleteConfirm(false)}
              >
                아니요
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordEdit;
