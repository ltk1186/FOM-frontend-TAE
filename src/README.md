## 프론트엔드 폴더 구조 설명

# 프로젝트 폴더 구조

my-react-app/
├── public/ # 정적 파일 (HTML, favicon 등)
│ └── index.html
│
├── src/ # 애플리케이션 소스 폴더
│ ├── assets/ # 이미지 및 리소스
│ │ └── images/ # 앱에서 사용되는 캐릭터, 배경, 아이콘 이미지 추가 됨
│ │ ├── image-50.png
│ │ ├── login-2.png
│ │ └── chevron-left0.svg
│ │
│ ├── components/ # 재사용 가능한 UI 컴포넌트
│ │ └── DiaryCard.js # (예정) 일기 카드 컴포넌트
│ │
│ ├── pages/ # 주요 화면(페이지) 컴포넌트 (그 외 .css 파일도 있음)
│ │ ├── Login.js # 로그인 페이지
│ │ ├── Signup.js # 회원가입 페이지
│ │ ├── LoginIntro.js # 인트로 화면 (앱 시작 화면)
│ │ ├── Record.js # 일기 작성/조회 화면
│ │ └── 그 외 .css # 각 .js에 해당하는 .css 파일들
│ │
│ ├── api/ # 서버 API 통신 로직 (예정)
│ │
│ ├── App.js # 전체 라우팅 정의 및 앱 구성
│ ├── index.js # React 앱 진입점
│ ├── index.css # 전역 스타일 (폰트, 네비게이션, 초기화 등)
│ ├── Login.css # 로그인 화면 스타일
│ ├── Signup.css # 회원가입 화면 스타일
│ └── var.css # 전역 색상/폰트 등 CSS 변수 정의
│
├── package.json # 프로젝트 메타 정보 및 의존성 관리
├── package-lock.json # 의존성 잠금 파일
└── README.md # 프로젝트 설명 문서

---

## 주요 페이지 설명

| 페이지          | 설명                                                  |
| --------------- | ----------------------------------------------------- |
| `LoginIntro.js` | 첫 화면 – "오늘 하루가 궁금해요" 메시지와 로그인 버튼 |
| `Login.js`      | 로그인 입력창, 비밀번호 확인 포함                     |
| `Signup.js`     | 이름, 이메일, 비밀번호 입력 + 이용약관 동의 포함      |
| `Record.js`     | (예정) 일기 작성/기록 기능 페이지                     |
