import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Gallery.module.css";
import PreviousArrow from "../components/PreviousArrow";
import Settings from "../components/Settings";
import HomeButton from "../components/HomeButton";
import { UserContext } from "./UserContext";
import axios from "axios";
import TrashIcon from "../assets/images/trash.png";
import Smiley from "../assets/images/image-50.png";

const Gallery = () => {
  const navigate = useNavigate();
  const { user, setIsLoading } = useContext(UserContext);

  const [selectedTab, setSelectedTab] = useState("my");
  const [myGallery, setMyGallery] = useState([]);
  const [sharedGallery, setSharedGallery] = useState([]);
  const [popupData, setPopupData] = useState(null);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [confirmShare, setConfirmShare] = useState(false);

  useEffect(() => {
    const loadGallery = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `https://fombackend.azurewebsites.net/api/diary/read?user_id=${user.user_id}`
        );
        const data = response.data || [];
        const withShareStatus = data.map((item) => ({
          ...item,
          isShared: false, // 🔄 실제 공유 여부는 서버 연동 시 판단 필요
        }));
        setMyGallery(withShareStatus);

        // 🔽 테스트 코드 시작: 마음 갤러리용 (Share API 구현 전까지)
        setSharedGallery([]); // 실제 API: /api/share/read/all
        // 🔼 테스트 코드 끝
      } catch (error) {
        console.error("❌ 갤러리 로딩 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.user_id) {
      loadGallery();
    }
  }, [user]);

  const handleGoToDiaryList = () => {
    setIsLoading(true);
    navigate("/diarylist");
  };

  const handleDeletePhoto = async (diary_id) => {
    setIsLoading(true);
    try {
      await axios.put(
        `https://fombackend.azurewebsites.net/api/diary/update_photo_null?diary_id=${diary_id}`
      );
      await axios.delete(
        `https://fombackend.azurewebsites.net/api/share/delete?diary_id=${diary_id}`
      );
    } catch (error) {
      console.error("❌ 이미지 삭제 실패:", error);
    }

    setMyGallery((prev) => prev.filter((item) => item.diary_id !== diary_id));
    setSharedGallery((prev) =>
      prev.filter((item) => item.diary_id !== diary_id)
    );
    setPopupData(null);
    setIsLoading(false);
  };

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
    setIsLoading(true);
    try {
      for (const id of selectedIds) {
        await axios.put(
          `https://fombackend.azurewebsites.net/api/diary/update_photo_null?diary_id=${id}`
        );
        await axios.delete(
          `https://fombackend.azurewebsites.net/api/share/delete?diary_id=${id}`
        );
      }
    } catch (error) {
      console.error("❌ 이미지 삭제 실패:", error);
    }

    setMyGallery((prev) =>
      prev.filter((item) => !selectedIds.includes(item.diary_id))
    );
    setSharedGallery((prev) =>
      prev.filter((item) => !selectedIds.includes(item.diary_id))
    );
    setSelectedIds([]);
    setIsDeleteMode(false);
    setIsLoading(false);
  };

  const handleShareConfirm = async () => {
    setIsLoading(true);

    // 🔽 테스트 코드 시작: AutoGen + Share 저장
    const newEntry = {
      diary_id: popupData.diary_id,
      user_id: user?.user_id,
      photo: popupData.photo,
      anonymous_summary: `익명화된 요약: ${popupData.summary}`,
      created_at: new Date().toISOString(),
    };
    setSharedGallery((prev) => [...prev, newEntry]);
    setMyGallery((prev) =>
      prev.map((item) =>
        item.diary_id === popupData.diary_id
          ? { ...item, isShared: true }
          : item
      )
    );
    // 🔼 테스트 코드 끝

    // 🔒 실제 API 연동 예시
    /*
    try {
      const response = await axios.post("https://fombackend.azurewebsites.net/api/share", {
        diary_id: popupData.diary_id,
        user_id: user.user_id,
        photo: popupData.photo,
        anonymous_summary: await autoGen(popupData.summary),
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error("❌ 공유 실패:", error);
    }
    */

    setConfirmShare(false);
    setPopupData(null);
    setIsLoading(false);
  };

  const handleCancelShare = async () => {
    setIsLoading(true);

    // 🔽 테스트 코드 시작
    setSharedGallery((prev) =>
      prev.filter((item) => item.diary_id !== popupData.diary_id)
    );
    setMyGallery((prev) =>
      prev.map((item) =>
        item.diary_id === popupData.diary_id
          ? { ...item, isShared: false }
          : item
      )
    );
    // 🔼 테스트 코드 끝

    // 🔒 실제 API 연동 예시
    /*
    try {
      await axios.delete(
        `https://fombackend.azurewebsites.net/api/share/delete?diary_id=${popupData.diary_id}`
      );
    } catch (error) {
      console.error("❌ 공유 취소 실패:", error);
    }
    */

    setPopupData(null);
    setIsLoading(false);
  };

  const currentGallery =
    selectedTab === "my"
      ? myGallery
      : sharedGallery.filter((item) => {
          const today = new Date();
          const createdAt = new Date(item.created_at);
          const diff = (today - createdAt) / (1000 * 60 * 60 * 24);
          return diff <= 1;
        });

  const placeholders =
    6 - currentGallery.length > 0 ? 6 - currentGallery.length : 0;

  return (
    <div className={styles["gallery-page"]}>
      <div className={styles["top-bar"]}>
        <div className={styles["back-button"]}>
          <PreviousArrow />
        </div>
        <div className={styles["right-buttons"]}>
          <Settings />
          <HomeButton />
        </div>
      </div>

      <div className={styles["tab-menu"]}>
        <button
          className={`${styles["tab-btn"]} ${
            selectedTab === "my" ? styles.active : ""
          }`}
          onClick={() => setSelectedTab("my")}
        >
          나의 감정갤러리
        </button>
        <button
          className={`${styles["tab-btn"]} ${
            selectedTab === "shared" ? styles.active : ""
          }`}
          onClick={() => setSelectedTab("shared")}
        >
          마음 갤러리
        </button>
      </div>

      <div className={styles["gallery-box"]}>
        {currentGallery.length === 0 && (
          <div className={styles["no-image-message"]}>
            갤러리가 비어있습니다.
          </div>
        )}
        {currentGallery.map((entry, idx) => (
          <div
            key={idx}
            className={styles["gallery-item"]}
            onClick={() => !isDeleteMode && setPopupData(entry)}
          >
            <img
              src={entry.photo}
              alt={`감정 이미지 ${idx + 1}`}
              className={styles["gallery-img"]}
            />
            {selectedTab === "my" && entry.isShared && (
              <div className={styles["shared-check"]}>✅</div>
            )}
            {isDeleteMode && selectedTab === "my" && (
              <button
                className={`${styles["select-circle"]} ${
                  selectedIds.includes(entry.diary_id) ? styles["selected"] : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(entry.diary_id);
                }}
              />
            )}
          </div>
        ))}
        {Array.from({ length: placeholders }).map((_, idx) => (
          <div key={`empty-${idx}`} className={styles["gallery-item"]}></div>
        ))}
      </div>

      <div className={styles["bottom-btn-wrapper"]}>
        {selectedTab === "my" && isDeleteMode && (
          <>
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
          </>
        )}
        {selectedTab === "my" && !isDeleteMode && (
          <button className={styles["trash-button"]} onClick={toggleDeleteMode}>
            <img src={TrashIcon} alt="삭제 모드" />
          </button>
        )}
        <button
          className={styles["go-generate-btn"]}
          onClick={handleGoToDiaryList}
        >
          이미지 만들러가기
        </button>
      </div>

      {confirmShare && (
        <div
          className={styles["popup-overlay"]}
          onClick={() => setConfirmShare(false)}
        >
          <div
            className={styles["popup-content"]}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={Smiley}
              alt="공유 아이콘"
              className={styles["popup-image"]}
            />
            <div className={styles["popup-info"]}>
              <span className={styles["popup-message"]}>
                정말정말 공유 할까요?
              </span>
            </div>
            <div className={styles["popup-actions"]}>
              <button
                className={styles["popup-btn"]}
                onClick={handleShareConfirm}
              >
                예
              </button>
              <button
                className={styles["popup-btn"]}
                onClick={() => setConfirmShare(false)}
              >
                아니요
              </button>
            </div>
          </div>
        </div>
      )}

      {popupData && !confirmShare && (
        <div
          className={styles["popup-overlay"]}
          onClick={() => setPopupData(null)}
        >
          <div
            className={styles["popup-float-container"]}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={popupData.photo}
              alt="선택 이미지"
              className={styles["popup-large-img"]}
            />
            <div className={styles["popup-info-bar"]}>
              <span className={styles["popup-date"]}>
                {new Date(popupData.created_at).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  weekday: "short",
                })}
              </span>
              {selectedTab === "my" && (
                <div className={styles["popup-actions"]}>
                  <button
                    className={styles["popup-btn"]}
                    onClick={() => handleDeletePhoto(popupData.diary_id)}
                  >
                    🗑️
                  </button>
                  {!popupData.isShared ? (
                    <button
                      className={styles["popup-btn"]}
                      onClick={() => setConfirmShare(true)}
                    >
                      🔗
                    </button>
                  ) : (
                    <button
                      className={styles["popup-btn"]}
                      onClick={handleCancelShare}
                    >
                      공유 취소
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className={styles["popup-summary"]}>
              {selectedTab === "shared"
                ? popupData.anonymous_summary
                : popupData.summary}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
