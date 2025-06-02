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
  const [showPassword, setShowPassword] = useState(false);
  const [referenceText, setReferenceText] = useState("");
  const [customText, setCustomText] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const navigate = useNavigate();
  const user_id = user?.user_id || "local_test_user";

  const templateStyles = [
    {
      id: "style1",
      name: "밝고 경쾌한 문체",
      color: "yellow",
      text: "안녕! 나는 포미야! 반가워~",
    },
    {
      id: "style2",
      name: "감정적이고 서정적인 문체",
      color: "purple",
      text: "안녕하세요, 저는 포미라고 해요. 오늘도 당신의 하루가 따뜻하길 바라요.",
    },
    {
      id: "style3",
      name: "딱딱하고 형식적인 문체",
      color: "blue",
      text: "안녕하십니까. 제 이름은 포미입니다.",
    },
    {
      id: "style4",
      name: "귀엽고 아기자기한 문체",
      color: "pink",
      text: "안뇽! 포미 등장했뽀이~ 💛 나랑 놀자앙!",
    },
    {
      id: "style5",
      name: "유쾌하고 장난기 가득한 문체",
      color: "green",
      text: "야호~ 포미 입장! 심심한 사람, 여기 붙어라!",
    },
  ];

  useEffect(() => {
    if (!user_id) {
      navigate("/login");
      return;
    }

    const fetchUserInfo = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `https://fombackend.azurewebsites.net/api/users/${user_id}`
        );
        const userData = response.data;

        setEmail(userData.email || "");
        setOriginalEmail(userData.email || "");
        setSelectedStyle(userData.reference_text ? "custom" : "");
        setCustomText(userData.reference_text || "");
      } catch (error) {
        console.error("회원 정보 불러오기 실패:", error);
        alert("회원 정보를 불러오는 데 실패했습니다.");
      }
      setIsLoading(false);
    };

    fetchUserInfo();
  }, [user_id, navigate, setIsLoading]);

  const handleToggleEdit = () => {
    if (editable) {
      setEmail(originalEmail);
      setPassword("");
      setEditable(false);
    } else {
      setEditable(true);
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
      alert("회원 정보가 수정되었습니다.");
    } catch (error) {
      console.error("회원정보 수정 에러:", error);
      alert("회원정보 수정 실패");
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
    <div className={styles["settings-container"]}>
      {" "}
      {/* ✅ */}
      <div className={styles["top-buttons"]}>
        <PreviousArrow />
        <h2 className={styles["settings-title"]}>설정</h2>
        <div className={styles["right-buttons"]}>
          <HomeButton />
        </div>
      </div>
      <div className={styles["settings-wrapper"]}>
        <div className={styles["section-wrapper"]}>
          <div className={styles["section-title"]}>사용자 정보</div>
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
              <button
                className={styles["logout-button"]}
                onClick={() => navigate("/logout")}
              >
                로그아웃
              </button>
              {editable && (
                <button
                  className={styles["save-button"]}
                  onClick={handleSaveUserInfo}
                >
                  저장하기
                </button>
              )}
              <button
                className={`${styles["edit-button"]} ${
                  editable ? styles.cancel : ""
                }`}
                onClick={handleToggleEdit}
              >
                {editable ? "수정 취소" : "회원정보 수정"}
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
              <button onClick={handleSaveStyle}>저장하기</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
