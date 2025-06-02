import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Gallery.module.css";
import PreviousArrow from "../components/PreviousArrow";
import Settings from "../components/Settings";
import HomeButton from "../components/HomeButton";
import { UserContext } from "./UserContext";
// import axios from "axios"; // 🔹 실제 백엔드 연동 시 사용
// 샘플 이미지 import -> 나중에 삭제
import sample1 from "../assets/images/sample1.jpg";
import sample2 from "../assets/images/sample2.jpg";
import sample3 from "../assets/images/sample3.jpg";
import sample4 from "../assets/images/sample4.jpg";
import sample5 from "../assets/images/sample5.jpg";
import sample6 from "../assets/images/sample6.jpg";

const Gallery = () => {
  const navigate = useNavigate();
  const { user, setIsLoading } = useContext(UserContext);

  const [selectedTab, setSelectedTab] = useState("my");
  const [myGallery, setMyGallery] = useState([]);
  const [sharedGallery, setSharedGallery] = useState([]);

  useEffect(() => {
    const loadGallery = async () => {
      setIsLoading(true);

      try {
        // 🔽 테스트 코드 시작 (sample 이미지 고정)
        const sampleImages1 = [
          sample1,
          sample2,
          sample3,
          sample4,
          sample5,
          sample6,
        ];
        const sampleImages2 = [
          sample6,
          sample5,
          sample4,
          sample3,
          sample2,
          sample1,
        ];
        setMyGallery(sampleImages1);
        setSharedGallery(sampleImages2);
        // 🔼 테스트 코드 끝

        // 🔒 실제 백엔드 연동 코드 (axios 방식)
        /*
        const response = await axios.get(
          `https://your-backend-api.com/api/diary_photos?user_id=${user.user_id}`
        );
        const myPhotoList = response.data.my_photos.map((blob) =>
          URL.createObjectURL(new Blob([blob], { type: "image/jpeg" }))
        );
        const sharedPhotoList = response.data.shared_photos.map((blob) =>
          URL.createObjectURL(new Blob([blob], { type: "image/jpeg" }))
        );
        setMyGallery(myPhotoList);
        setSharedGallery(sharedPhotoList);
        */
      } catch (error) {
        console.error("❌ 갤러리 로딩 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadGallery();
  }, [setIsLoading, user]);

  const handleGoToDiaryList = () => {
    setIsLoading(true);
    navigate("/diarylist");
  };

  return (
    <div className={styles["gallery-page"]}>
      {/* 🔹 상단 네비게이션 */}
      <div className={styles["top-bar"]}>
        <div className={styles["back-button"]}>
          <PreviousArrow />
        </div>
        <div className={styles["right-buttons"]}>
          <Settings />
          <HomeButton />
        </div>
      </div>

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
        {/* 이미지가 없을 때도 빈 박스 유지 */}
        {(selectedTab === "my" ? myGallery : sharedGallery).length === 0
          ? Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className={styles["gallery-item"]}></div>
            ))
          : (selectedTab === "my" ? myGallery : sharedGallery).map(
              (img, idx) => (
                <div key={idx} className={styles["gallery-item"]}>
                  <img
                    src={img}
                    alt={`감정 이미지 ${idx + 1}`}
                    className={styles["gallery-img"]}
                  />
                </div>
              )
            )}
      </div>

      {/* 🔹 하단 버튼 */}
      <div className={styles["bottom-btn-wrapper"]}>
        <button
          className={styles["go-generate-btn"]}
          onClick={handleGoToDiaryList}
        >
          이미지 만들러가기
        </button>
      </div>
    </div>
  );
};

export default Gallery;
