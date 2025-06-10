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
import Smiley from "../assets/images/image-50.png";
import { UserContext } from "./UserContext";
import axios from "axios";

const RecordDiary = () => {
  const { user, setIsLoading } = useContext(UserContext); // 🔹 추가
  const navigate = useNavigate();
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [diaries, setDiaries] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false); // 🔹 추가: 스크롤 여부 상태
  const [confirmDelete, setConfirmDelete] = useState(false); // ✅ 삭제 확인 팝업 상태 추가

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0); // 🔹 스크롤 여부 판단
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ 팝업이 뜰 때 body 스크롤 방지
  useEffect(() => {
    if (confirmDelete) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = ""; // 컴포넌트 언마운트 시 복원
    };
  }, [confirmDelete]);

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
    setConfirmDelete(false); // ✅ 팝업 닫기
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
      <div
        className={`${styles["navigation-bar"]} ${
          isScrolled ? styles["scrolled"] : ""
        }`}
      >
        {/* 🔄 구조를 좌/중앙/우 3분할 */}
        <div className={styles["nav-left"]}>
          <PreviousArrow />
        </div>

        {isDeleteMode && (
          <div className={styles["nav-center"]}>
            <button
              className={styles["delete-count-button"]}
              onClick={() => setConfirmDelete(true)} // ✅ 팝업 띄우기
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

        <div className={styles["nav-right"]}>
          <button
            className={`${styles["trash-button"]} ${styles["button-trash"]}`}
            onClick={toggleDeleteMode}
          >
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
          <div className={styles["button-settings"]}>
            <Settings />
          </div>
          <div className={styles["button-home"]}>
            <HomeButton />
          </div>
        </div>
      </div>

      <div className={styles["diary-list"]}>
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
        일기 완성
      </button>
      {/* ✅ 삭제 확인 팝업창 */}
      {confirmDelete && (
        <div
          className={styles["popup-overlay"]}
          onClick={() => setConfirmDelete(false)}
        >
          <div
            className={styles["popup-content"]}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={Smiley}
              alt="삭제 확인"
              className={styles["popup-image"]}
            />
            <div className={styles["popup-info"]}>
              <span className={styles["popup-message"]}>
                정말 삭제하시겠어요?
              </span>
            </div>
            <div className={styles["popup-actions"]}>
              <button
                className={styles["popup-btn"]}
                onClick={handleBulkDelete}
              >
                예
              </button>
              <button
                className={styles["popup-btn"]}
                onClick={() => setConfirmDelete(false)}
              >
                아니요
              </button>
            </div>
          </div>
        </div>
      )}

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
            navigate("/calendar", { state: { selectedDate: "_blank" } }); // ✅ 팝업 방지
          }}
        />
      </div>
    </div>
  );
};

export default RecordDiary;
