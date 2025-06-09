import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./SettingsPage.module.css"; // ✅ 모듈 import
import PreviousArrow from "../components/PreviousArrow";
import HomeButton from "../components/HomeButton";
import eyeOpenIcon from "../assets/images/eye-open0.svg";

const SettingsPage = () => {
  const { user, setIsLoading } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [editable, setEditable] = useState(false);
  const [imageEditable, setImageEditable] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [referenceText, setReferenceText] = useState("");
  const [customText, setCustomText] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [nation, setNation] = useState("");
  const [sex, setSex] = useState("");
  const [age, setAge] = useState("");
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false); // 🔹 키보드 열림 여부 상태

  const navigate = useNavigate();
  const user_id = user?.user_id || "local_test_user";

  const [isScrolled, setIsScrolled] = useState(false); // 🔄 수정: 스크롤 여부
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const templateStyles = [
    {
      id: "style1",
      name: "밝고 경쾌한 문체",
      color: "yellow",
      text: "오늘도 햇살이 반짝이고 있어! 괜히 기분이 좋아지는 하루였어 :) 작은 일에도 웃음이 나고, 왠지 모르게 힘이 솟았던 날! 내일도 이렇게 즐거우면 좋겠다!",
    },
    {
      id: "style2",
      name: "감성적이고 서정적인 문체",
      color: "purple",
      text: "창밖에 부는 바람이 오늘따라 유난히 따뜻하게 느껴졌어요. 하루를 되돌아보며 마음속에 조용히 스며든 감정들을 꾹 눌러 담아봅니다. 평범한 하루였지만, 그 안에 담긴 소중한 순간들을 잊지 않으려 해요.",
    },
    {
      id: "style3",
      name: "격식 있고 딱딱한 문체",
      color: "blue",
      text: "금일은 특별한 사건 없이 무난하게 하루를 보냈습니다. 일정에 따라 업무를 수행하였으며, 별다른 이상 사항은 없었습니다. 일과를 마친 후에는 휴식을 취하며 하루를 정리하였습니다.",
    },
    {
      id: "style4",
      name: "귀엽고 발랄한 문체",
      color: "pink",
      text: "꺄아~ 오늘 완전 꿀잼이었지 뭐야! 😝 친구들이랑 수다도 떨고 맛난 것도 먹고, 진짜진짜 행복한 하루였당~ 내일은 또 어떤 재미난 일이 기다리고 있을까? 두근두근!! 💖",
    },
    {
      id: "style5",
      name: "유쾌하고 장난스러운 문체",
      color: "green",
      text: "오늘 하루 완전 빵빵 터졌지 뭐야! 🤣 별거 아닌 일에도 웃음 터지고, 혼자 상상하다 웃다가 괜히 민망~ 그래도 이런 하루가 최고지! 세상아, 내일도 웃길 준비됐나?! 😎",
    },
  ];

  const fetchUserInfo = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://fombackend.azurewebsites.net/api/users/${user_id}`
      );
      const userData = response.data;
      console.log(userData);
      setEmail(userData.email || "");
      setOriginalEmail(userData.email || "");

      setNation(userData.nation || "");
      setSex(userData.sex || "");
      setAge(userData.age || "");

      const matchedStyle = templateStyles.find(
        (style) => style.text.trim() === (userData.reference_text || "").trim()
      );

      if (matchedStyle) {
        setSelectedStyle(matchedStyle.id);
        setCustomText("");
      } else {
        setSelectedStyle("custom");
        setCustomText(userData.reference_text || "");
      }
    } catch (error) {
      console.error("회원 정보 불러오기 실패:", error);
      alert("회원 정보를 불러오는 데 실패했습니다.");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!user_id) {
      navigate("/login");
      return;
    }
    fetchUserInfo();
  }, [user_id, navigate, setIsLoading]);

  // 🔽 VisualViewport API를 활용한 소프트 키보드 감지
  useEffect(() => {
    const handleViewportResize = () => {
      if (window.visualViewport) {
        const viewportHeight = window.visualViewport.height;
        const windowHeight = window.innerHeight;
        setIsKeyboardOpen(viewportHeight < windowHeight - 100); // 100px 여유
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleViewportResize);
      window.visualViewport.addEventListener("scroll", handleViewportResize);
      handleViewportResize(); // 초기 상태 감지
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener(
          "resize",
          handleViewportResize
        );
        window.visualViewport.removeEventListener(
          "scroll",
          handleViewportResize
        );
      }
    };
  }, []);

  const handleToggleEdit = () => {
    if (editable) {
      setEmail(originalEmail);
      setPassword("");
      setEditable(false);
    } else {
      setEditable(true);
    }
  };

  const handleToggleImageEdit = () => {
    if (imageEditable) {
      setImageEditable(false);
      fetchUserInfo(); // 취소 시 원래 값 복원
    } else {
      setImageEditable(true);
    }
  };

  const handleSaveUserInfo = async () => {
    setIsLoading(true);
    try {
      const updateData = { email };
      if (password) updateData.password = password;

      await axios.put(
        `https://fombackend.azurewebsites.net/api/users/${user_id}`,
        updateData
      );

      setEditable(false);
      setOriginalEmail(email);
      setPassword("");
      alert("로그인 정보가 수정되었습니다.");
    } catch (error) {
      console.error("로그인 수정 에러:", error);
      alert("로그인 수정 실패");
    }
    setIsLoading(false);
  };

  const handleSaveImageSetting = async () => {
    setIsLoading(true);
    try {
      await axios.put(
        "https://fombackend.azurewebsites.net/api/image/setting",
        {
          user_id,
          nation,
          sex,
          age: Number(age),
        }
      );
      setImageEditable(false);
      alert("사용자 정보가 수정되었습니다.");
    } catch (error) {
      console.error("사용자 정보 수정 실패:", error);
      alert("사용자 정보 수정 실패");
    }
    setIsLoading(false);
  };

  const handleSaveStyle = async () => {
    const selectedText =
      selectedStyle === "custom"
        ? customText
        : templateStyles.find((s) => s.id === selectedStyle)?.text;

    setIsLoading(true);
    try {
      await axios.put(
        `https://fombackend.azurewebsites.net/api/users/reference/${user_id}`,
        { reference_text: selectedText }
      );
      alert("문체가 저장되었습니다.");
    } catch (error) {
      console.error("문체 저장 에러:", error);
      alert("문체 저장 실패");
    }
    setIsLoading(false);
  };

  return (
    <div
      className={`${styles["settings-container"]} ${
        isKeyboardOpen ? styles["keyboard-open"] : ""
      }`}
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
          <div className={styles["button-home"]}>
            <HomeButton />
          </div>
        </div>
      </div>

      <div className={styles["settings-wrapper"]}>
        {/* ✅ 추가: 설정 타이틀 */}
        <div className={styles["settings-title"]}>설정</div>

        <div className={styles["section-wrapper"]}>
          <div className={styles["section-title"]}>로그인 정보</div>
          <div className={styles["settings-box"]}>
            <label className={styles["label"]}>이메일</label>
            <input
              className={
                editable ? `${styles.input} ${styles.editable}` : styles.input
              }
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              readOnly={!editable}
            />
            <label className={styles["label"]}>
              비밀번호 (새 비밀번호 입력)
            </label>
            <div className={styles["password-wrapper"]}>
              <input
                className={
                  editable ? `${styles.input} ${styles.editable}` : styles.input
                }
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                readOnly={!editable}
              />
              {editable && (
                <img
                  src={eyeOpenIcon}
                  alt="비밀번호 보기"
                  className={`${styles["eye-icon"]} ${
                    showPassword ? styles.active : ""
                  }`}
                  onClick={() => setShowPassword((prev) => !prev)}
                />
              )}
            </div>
            <div className={styles["button-group"]}>
              {!editable && ( // 🔹 수정: editable 아닐 때만 로그아웃 버튼 표시
                <button
                  className={styles["logout-button"]}
                  onClick={() => navigate("/logout")}
                >
                  로그아웃
                </button>
              )}
              {editable && (
                <button
                  className={styles["save-button"]}
                  onClick={handleSaveUserInfo}
                >
                  저장
                </button>
              )}
              <button
                className={`${styles["edit-button"]} ${
                  editable ? styles.cancel : ""
                }`}
                onClick={handleToggleEdit}
              >
                {editable ? "수정 취소" : "수정"}
              </button>
            </div>
          </div>
        </div>

        <div className={styles["section-wrapper"]}>
          <div className={styles["section-title"]}>사용자 정보</div>
          <div className={styles["settings-box"]}>
            <label className={styles["label"]}>국적</label>
            <input
              className={
                imageEditable
                  ? `${styles.input} ${styles.editable}`
                  : styles.input
              }
              type="text"
              value={nation}
              onChange={(e) => setNation(e.target.value)}
              readOnly={!imageEditable}
            />

            <label className={styles["label"]}>성별</label>
            <input
              className={
                imageEditable
                  ? `${styles.input} ${styles.editable}`
                  : styles.input
              }
              type="text"
              value={sex}
              onChange={(e) => setSex(e.target.value)}
              readOnly={!imageEditable}
            />

            <label className={styles["label"]}>나이</label>
            <input
              className={
                imageEditable
                  ? `${styles.input} ${styles.editable}`
                  : styles.input
              }
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              readOnly={!imageEditable}
            />

            {/* 🔽 버튼 그룹: 저장/취소 or 수정 진입 */}
            <div className={styles["button-group"]}>
              {imageEditable && (
                <button
                  className={styles["save-button"]}
                  onClick={handleSaveImageSetting}
                >
                  저장
                </button>
              )}
              <button
                className={`${styles["edit-button"]} ${
                  imageEditable ? styles.cancel : ""
                }`}
                onClick={handleToggleImageEdit}
              >
                {imageEditable ? "수정 취소" : "수정"}
              </button>
            </div>
          </div>
        </div>

        <div className={styles["section-wrapper"]}>
          <div className={styles["section-title"]}>일기 문체</div>
          <div className={styles["settings-box"]}>
            <div className={styles["style-options"]}>
              {templateStyles.map((style) => (
                <div key={style.id} className={styles["style-option"]}>
                  <label
                    className={`${styles["option-label"]} ${
                      styles[style.color]
                    }`}
                  >
                    <input
                      type="radio"
                      name="style"
                      value={style.id}
                      checked={selectedStyle === style.id}
                      onChange={() => setSelectedStyle(style.id)}
                    />
                    {style.name}
                  </label>
                  <p className={styles["example-text"]}>{style.text}</p>
                </div>
              ))}
              <div className={styles["style-option"]}>
                <label className={`${styles["option-label"]} ${styles.brown}`}>
                  <input
                    type="radio"
                    name="style"
                    value="custom"
                    checked={selectedStyle === "custom"}
                    onChange={() => setSelectedStyle("custom")}
                  />
                  사용자 지정 문체
                </label>
                {selectedStyle === "custom" && (
                  <textarea
                    className={styles["custom-textbox"]}
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="문체를 입력하세요..."
                  />
                )}
              </div>
            </div>
            <div className={styles["style-save"]}>
              <button onClick={handleSaveStyle}>저장</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
