import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./RecordDiary.module.css"; // 🔄 변경됨
import PreviousArrow from "../components/PreviousArrow";
import HomeButton from "../components/HomeButton";
import Settings from "../components/Settings";
import MicIcon from "../assets/images/group-70.svg";
import CalendarIcon from "../assets/images/group-90.svg";
import WriteIcon from "../assets/images/Group 19.svg";
import TrashIcon from "../assets/images/trash.png";
import { UserContext } from "./UserContext";
import axios from "axios";

const RecordDiary = () => {
  const { user, setIsLoading } = useContext(UserContext); // 🔹 추가
  const navigate = useNavigate();
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [diaries, setDiaries] = useState([]);

  useEffect(() => {
    const fetchDiaries = async (userID) => {
      setIsLoading(true); // 🔹 로딩 시작
      try {
        const response = await axios.get(
          `https://fombackend.azurewebsites.net/api/temp_diary/read?user_id=${userID}`
        );
        setDiaries(response.data);
        console.log("✅ diaries 데이터 가져오기 성공:", response.data);
      } catch (error) {
        console.error(
          "❌ diaries API 에러:",
          error.response?.data || error.message
        );
      } finally {
        setIsLoading(false); // 🔹 로딩 종료
      }
    };

    if (user?.user_id) {
      fetchDiaries(user.user_id);
    } else {
      console.warn("⚠️ 사용자 아이디가 없습니다.");
    }
  }, [user?.user_id, setIsLoading]);

  const toggleDeleteMode = () => {
    setIsDeleteMode((prev) => !prev);
    setSelectedIds([]);
  };

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    setIsLoading(true); // 🔹 삭제 중 로딩
    for (const id of selectedIds) {
      try {
        await axios.delete(
          `https://fombackend.azurewebsites.net/api/temp_diary/delete?temp_diary_id=${id}`
        );
        console.log(`✅ ID ${id} 삭제 성공`);
      } catch (error) {
        console.error(`❌ ID ${id} 삭제 실패:`, error);
      }
    }

    try {
      const response = await axios.get(
        `https://fombackend.azurewebsites.net/api/temp_diary/read?user_id=${user.user_id}`
      );
      setDiaries(response.data);
    } catch (error) {
      console.error("❌ diaries 재조회 실패:", error);
    }

    setSelectedIds([]);
    setIsDeleteMode(false);
    setIsLoading(false); // 🔹 삭제 후 로딩 종료
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className={styles["diary-page"]}>
      {" "}
      {/* 🔄 변경됨 */}
      <div className={styles["top-buttons"]}>
        {" "}
        {/* 🔄 변경됨 */}
        <PreviousArrow />
        {isDeleteMode && (
          <div className={styles["delete-controls"]}>
            {" "}
            {/* 🔄 변경됨 */}
            <button
              className={styles["delete-count-button"]}
              onClick={handleBulkDelete}
            >
              {selectedIds.length}개 항목 삭제
            </button>
            <button
              className={styles["cancel-delete-button"]}
              onClick={toggleDeleteMode}
            >
              취소
            </button>
          </div>
        )}
        <div className={styles["right-buttons"]}>
          {" "}
          {/* 🔄 변경됨 */}
          <button className={styles["trash-button"]} onClick={toggleDeleteMode}>
            <img
              src={TrashIcon}
              alt="삭제 모드"
              style={{
                width: "20px",
                height: "20px",
                marginTop: "2px",
              }}
            />
          </button>
          <Settings />
          <HomeButton />
        </div>
      </div>
      <div className={styles["diary-list"]}>
        {" "}
        {/* 🔄 변경됨 */}
        {diaries.length === 0 ? (
          <p className={styles["empty-message"]}>작성된 일지가 없습니다.</p>
        ) : (
          diaries.map((diary) => (
            <div
              className={styles["diary-card"]}
              key={diary.temp_diary_id}
              onClick={() =>
                !isDeleteMode &&
                (() => {
                  setIsLoading(true); // 🔹 클릭 시 로딩
                  navigate("/recordedit", {
                    state: {
                      id: diary.temp_diary_id,
                      title: diary.title,
                      content: diary.content,
                    },
                  });
                })()
              }
            >
              {isDeleteMode && (
                <button
                  className={`${styles["select-circle"]} ${
                    selectedIds.includes(diary.temp_diary_id)
                      ? styles["selected"]
                      : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(diary.temp_diary_id);
                  }}
                />
              )}
              <div className={styles["diary-date"]}>
                {diary.created_at
                  ? new Date(diary.created_at).toLocaleString("ko-KR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "날짜 없음"}
              </div>
              <div className={styles["diary-title"]}>{diary.title}</div>
              <div className={styles["diary-content"]}>{diary.content}</div>
            </div>
          ))
        )}
      </div>
      <button
        className={styles["add-diary-btn"]}
        onClick={() => {
          setIsLoading(true); // 🔹 요약 이동 시 로딩
          navigate("/recordsummary", { state: { diaries } });
        }}
      >
        일기 완성하기
      </button>
      <div className={styles["bottom-icons"]}>
        <img
          src={WriteIcon}
          alt="텍스트 작성"
          className={styles["fab-button"]}
          onClick={() => {
            setIsLoading(true); // 🔹 텍스트 작성 이동
            navigate("/recordgen");
          }}
        />
        <img
          src={MicIcon}
          alt="음성 입력"
          className={styles["fab-button"]}
          onClick={() => {
            setIsLoading(true); // 🔹 음성 입력 이동
            navigate("/recordgen", { state: { mic: true } });
          }}
        />
        <img
          src={CalendarIcon}
          alt="캘린더"
          className={styles["fab-button"]}
          onClick={() => {
            setIsLoading(true); // 🔹 캘린더 이동
            navigate("/calendar");
          }}
        />
      </div>
    </div>
  );
};

export default RecordDiary;
