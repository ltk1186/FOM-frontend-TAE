import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Gallery.module.css";
import PreviousArrow from "../components/PreviousArrow";
import Settings from "../components/Settings";
import HomeButton from "../components/HomeButton";
import { UserContext } from "./UserContext";
import axios from "axios";
import TrashIcon from "../assets/images/trash.png"; // ✅ 삭제 아이콘
import Smiley from "../assets/images/image-50.png"; // ✅ 공유 확인 팝업 이미지

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
  const [isScrolled, setIsScrolled] = useState(false); // ✅ 추가: 스크롤 여부 상태
  const [confirmDeleteSingle, setConfirmDeleteSingle] = useState(false); // ✅ 단일 삭제 확인
  const [confirmDeleteBulk, setConfirmDeleteBulk] = useState(false); // ✅ 일괄 삭제 확인
  const [confirmUnshare, setConfirmUnshare] = useState(false); // ✅ 공유 취소 확인

  useEffect(() => {
    const isAnyPopupOpen =
      popupData ||
      confirmShare ||
      confirmDeleteSingle ||
      confirmDeleteBulk ||
      confirmUnshare;

    if (isAnyPopupOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [
    popupData,
    confirmShare,
    confirmDeleteSingle,
    confirmDeleteBulk,
    confirmUnshare,
  ]);

  useEffect(() => {
    const loadGallery = async () => {
      setIsLoading(true);
      try {
        // ✅ diary 데이터 가져오기
        const response = await axios.get(
          `https://fombackend.azurewebsites.net/api/diary/image/read`,
          {
            params: {
              user_id: user?.user_id,
              selected_date: "250603250610", // 👉 날짜 범위
            },
          }
        );
        const diaryList = response.data;

        // 1. shared_diary_id 목록 미리 구하기
        const sharedResponse = await axios.get(
          "https://fombackend.azurewebsites.net/api/shared_diaries/get"
        );
        const sharedData = sharedResponse.data;

        // 👉 diary_id 값이 포함되도록 백엔드 응답 추가 필요 (현재는 없음)
        // 예시: sharedData = [{ diary_id: 1, photo: ..., content: ... }]
        const sharedDiaryIds = sharedData
          .filter((entry) => entry.diary_id !== null)
          .map((entry) => entry.diary_id);

        // 2. myGallery 생성 시 공유 여부 반영
        const galleryData = diaryList
          .filter((entry) => entry.photo)
          .map((entry) => ({
            photo: entry.photo,
            created_at: entry.created_at,
            summary: entry.content,
            diary_id: entry.diary_id,
            isShared: sharedDiaryIds.includes(entry.diary_id),
          }))
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // 🔹 최신순 정렬 추가

        setMyGallery(galleryData);

        // ✅ sharedGallery 구성
        const formattedShared = sharedData
          .map((entry) => ({
            photo: entry.photo,
            created_at: entry.created_at || new Date(), // 백엔드에 따라 조정
            anonymous_summary: entry.content,
            diary_id: entry.diary_id,
          }))
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // 🔹 최신순 정렬 추가

        setSharedGallery(formattedShared);
      } catch (error) {
        console.error("❌ 갤러리 로딩 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadGallery();
  }, [user]);

  // ✅ 추가: 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGoToDiaryList = () => {
    setIsLoading(true);
    navigate("/diarylist");
  };

  const handleDeletePhoto = async (diary_id) => {
    setIsLoading(true);

    try {
      // 먼저 공유 취소 시도 (존재하지 않아도 무시)
      await axios.put(
        `https://fombackend.azurewebsites.net/api/share_diary/cancel/${diary_id}`
      );

      // 그 다음 diary 삭제
      await axios.delete(
        "https://fombackend.azurewebsites.net/api/diary/delete",
        { params: { diary_id } }
      );

      // UI 상태 업데이트
      setMyGallery((prev) => prev.filter((item) => item.diary_id !== diary_id));
      if (popupData) {
        setSharedGallery((prev) =>
          prev.filter((item) => item.photo !== popupData.photo)
        );
      }

      setPopupData(null);
    } catch (error) {
      console.error("❌ 삭제 처리 중 오류:", error);
    } finally {
      setIsLoading(false);
    }
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
    setMyGallery((prev) =>
      prev.filter((item) => !selectedIds.includes(item.diary_id))
    );

    setSharedGallery((prev) =>
      prev.filter((item) => !selectedIds.includes(item.diary_id))
    );

    for (const id of selectedIds) {
      await axios.delete(
        "https://fombackend.azurewebsites.net/api/diary/delete",
        { params: { diary_id: id } }
      );
      await axios.delete(
        "https://fombackend.azurewebsites.net/api/share/delete",
        { params: { diary_id: id } }
      );
    }

    setSelectedIds([]);
    setIsDeleteMode(false);
    setIsLoading(false);
  };

  const handleShareConfirm = async () => {
    setIsLoading(true);
    await axios.post(
      "https://fombackend.azurewebsites.net/api/share_diary/create",
      {
        diary_id: popupData.diary_id,
        created_at: new Date().toISOString(),
      }
    );

    // 갤러리 상태 업데이트
    setSharedGallery((prev) => [
      ...prev,
      {
        diary_id: popupData.diary_id,
        photo: popupData.photo,
        content: popupData.summary, // anonymous_summary 대신 summary
        created_at: new Date().toISOString(),
        flag: true,
      },
    ]);

    setMyGallery((prev) =>
      prev.map((item) =>
        item.diary_id === popupData.diary_id
          ? { ...item, isShared: true }
          : item
      )
    );

    setConfirmShare(false);
    setPopupData(null);
    setIsLoading(false);
  };

  const handleCancelShare = async () => {
    setIsLoading(true);
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
    await axios.put(
      `https://fombackend.azurewebsites.net/api/share_diary/cancel/${popupData.diary_id}`
    );
    setSharedGallery((prev) =>
      prev.filter((item) => item.photo !== popupData.photo)
    );
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
      {/* 🔄 navigation-bar로 통일된 상단바 구조 시작 */}
      <div
        className={`${styles["navigation-bar"]} ${
          isScrolled ? styles["scrolled"] : ""
        }`}
      >
        <div className={styles["nav-left"]}>
          <PreviousArrow />
        </div>

        <div className={styles["nav-center"]}>
          {/* 중앙 영역이 필요하면 여기에 추가 */}
        </div>

        <div className={styles["nav-right"]}>
          <Settings />
          <HomeButton />
        </div>
      </div>
      {/* 🔼 navigation-bar로 통일된 상단바 구조 끝 */}

      {/* 🔹 탭 메뉴 */}
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

      {/* 🔹 갤러리 박스 */}
      <div className={styles["gallery-box"]}>
        {currentGallery.length === 0 && selectedTab === "my" && (
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

      {/* 🔹 하단 버튼 */}
      <div className={styles["bottom-btn-wrapper"]}>
        {selectedTab === "my" && isDeleteMode && (
          <>
            <button
              className={styles["delete-count-button"]}
              onClick={() => setConfirmDeleteBulk(true)}
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
          갤러리 이미지 생성
        </button>
      </div>

      {/* 🔹 공유 확인 팝업 */}
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
              <span className={styles["popup-message"]}>정말 공유할까요?</span>
            </div>
            <div className={styles["popup-actions"]}>
              <button
                className={styles["popup-btn-yes"]}
                onClick={handleShareConfirm}
              >
                예
              </button>
              <button
                className={styles["popup-btn-no"]}
                onClick={() => setConfirmShare(false)}
              >
                아니요
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 상세 이미지 팝업 ― 박스 없는 형식으로 변경 */}
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
                    className={styles["popup-btn-delete"]}
                    onClick={() => setConfirmDeleteSingle(true)}
                  >
                    삭제
                  </button>

                  {!popupData.isShared ? (
                    <button
                      className={styles["popup-btn-share"]}
                      onClick={() => setConfirmShare(true)}
                    >
                      공유
                    </button>
                  ) : (
                    <button
                      className={styles["popup-btn-cancel"]}
                      onClick={() => setConfirmUnshare(true)}
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
      {/* ✅ 단일 삭제 확인 */}
      {confirmDeleteSingle && (
        <div
          className={styles["popup-overlay"]}
          onClick={() => setConfirmDeleteSingle(false)}
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
              <span className={styles["popup-message"]}>정말 삭제할까요?</span>
            </div>
            <div className={styles["popup-actions"]}>
              <button
                className={styles["popup-btn-yes"]}
                onClick={() => {
                  handleDeletePhoto(popupData.diary_id);
                  setConfirmDeleteSingle(false);
                }}
              >
                예
              </button>
              <button
                className={styles["popup-btn-no"]}
                onClick={() => setConfirmDeleteSingle(false)}
              >
                아니요
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ 공유 취소 확인 */}
      {confirmUnshare && (
        <div
          className={styles["popup-overlay"]}
          onClick={() => setConfirmUnshare(false)}
        >
          <div
            className={styles["popup-content"]}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={Smiley}
              alt="공유 취소"
              className={styles["popup-image"]}
            />
            <div className={styles["popup-info"]}>
              <span className={styles["popup-message"]}>정말 취소할까요?</span>
            </div>
            <div className={styles["popup-actions"]}>
              <button
                className={styles["popup-btn-yes"]}
                onClick={() => {
                  handleCancelShare();
                  setConfirmUnshare(false);
                }}
              >
                예
              </button>
              <button
                className={styles["popup-btn-no"]}
                onClick={() => setConfirmUnshare(false)}
              >
                아니요
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ bulk 삭제 확인 */}
      {confirmDeleteBulk && (
        <div
          className={styles["popup-overlay"]}
          onClick={() => setConfirmDeleteBulk(false)}
        >
          <div
            className={styles["popup-content"]}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={Smiley}
              alt="일괄 삭제"
              className={styles["popup-image"]}
            />
            <div className={styles["popup-info"]}>
              <span className={styles["popup-message"]}>
                {selectedIds.length}개 항목을 정말 삭제할까요?
              </span>
            </div>
            <div className={styles["popup-actions"]}>
              <button
                className={styles["popup-btn-yes"]}
                onClick={() => {
                  handleBulkDelete();
                  setConfirmDeleteBulk(false);
                }}
              >
                예
              </button>
              <button
                className={styles["popup-btn-no"]}
                onClick={() => setConfirmDeleteBulk(false)}
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

export default Gallery;
