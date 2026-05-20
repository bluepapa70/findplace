# FindPlace 🍽️

현재 위치 기반으로 주변 맛집을 지도에 표시하고, **뭐먹지?** 버튼 한 번으로 추천 점수 상위 3곳을 알려주는 웹서비스입니다.

## 화면 구성

| 영역 | 설명 |
|------|------|
| 지도 | 현재 위치 중심으로 반경 1km 음식점 마커 표시 |
| 사이드패널 | 거리순 맛집 목록, 카드 클릭 시 지도 마커 연동 |
| 뭐먹지? 버튼 | 추천 점수 기반 TOP 3 모달 표시 |

---

## 빠른 시작

### 1단계. 카카오 API 키 발급

1. [Kakao Developers](https://developers.kakao.com) 접속 후 로그인
2. **내 애플리케이션 → 애플리케이션 추가하기**
3. 앱 이름 입력 후 생성
4. **앱 키** 탭에서 **JavaScript 키** 복사
5. **플랫폼 → Web → 사이트 도메인** 에 `http://localhost:3000` 추가

### 2단계. API 키 설정

```bash
# js/config.js 파일을 생성하고 키를 입력합니다
# (이 파일은 .gitignore에 포함되어 원격 저장소에 올라가지 않습니다)
cp js/config.js.example js/config.js   # 또는 직접 생성
```

`js/config.js` 파일을 열고 `YOUR_KAKAO_JAVASCRIPT_KEY` 를 실제 JavaScript 키로 교체:

```javascript
window.KAKAO_MAP_KEY = '실제_발급받은_JavaScript_키_입력';
```

### 3단계. 로컬 서버 실행

브라우저에서 `file://`로 직접 열면 Geolocation이 동작하지 않으므로 반드시 로컬 서버를 통해 접속해야 합니다.

**방법 A — Node.js 서버 (권장)**

```bash
npm install
npm start
# http://localhost:3000 접속
```

**방법 B — Python 내장 서버**

```bash
python -m http.server 3000
# http://localhost:3000 접속
```

**방법 C — VS Code Live Server 확장**

`index.html` 우클릭 → *Open with Live Server*

---

## 파일 구조

```
findplace/
├── index.html              # 메인 진입점
├── css/
│   ├── style.css           # 전역 스타일, CSS 변수
│   ├── map.css             # 지도·사이드바·카드 스타일
│   └── modal.css           # 추천 모달 스타일
├── js/
│   ├── config.js           # 카카오 API 키 (gitignore)
│   ├── location.js         # Geolocation 모듈
│   ├── restaurant.js       # 카카오 Places 검색
│   ├── recommendation.js   # 추천 점수 계산
│   ├── map.js              # 지도 초기화·마커 관리
│   └── app.js              # 앱 오케스트레이터
├── server.js               # 선택적 Express 프록시 서버
├── package.json
├── .env.example            # 환경변수 템플릿
└── .gitignore
```

---

## 추천 점수 계산식

$$
\text{score} = \text{rating} \times \log_{10}(\text{reviewCount} + 1) \times (0.4 + 0.6 \times \text{distanceFactor})
$$

| 변수 | 설명 |
|------|------|
| `rating` | 별점 (3.5 ~ 5.0) |
| `reviewCount` | 리뷰 수 (로그 스케일 정규화) |
| `distanceFactor` | 거리 가중치 — 가까울수록 1에 가까움 |

> **참고**: 카카오 Places API는 평점을 직접 제공하지 않아, 현재는 place ID 기반 결정적 의사 값을 사용합니다.
> 실제 서비스 적용 시 `server.js`를 통해 외부 평점 API(Naver, Google 등)와 연동하세요.

---

## 선택 기능: Express 프록시 서버

`server.js`는 카카오 REST API를 서버 측에서 호출하는 프록시입니다.  
실제 평점 데이터 연동 시 활성화하세요.

```bash
# .env 파일 생성
cp .env.example .env
# KAKAO_REST_KEY=실제_REST_API_키 입력 후 저장

npm start
```

---

## 브라우저 지원

Chrome, Edge, Firefox, Safari (최신 버전)  
모바일: iOS Safari, Android Chrome
rest api key = 8bd4640deb588cd07bb9bdfb5f852e65