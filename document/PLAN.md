# FindPlace — 위치 기반 맛집 추천 서비스 개발 계획

> **작성일**: 2026-05-20 | **버전**: 1.0
> 현재 위치 기반 맛집 지도 + "뭐먹지" 추천 버튼 웹서비스

---

## 1. 서비스 개요

### 핵심 기능
| 기능 | 설명 |
|------|------|
| 현재 위치 탐지 | 브라우저 Geolocation API로 사용자 위치 파악 |
| 맛집 지도 표시 | 반경 내 맛집을 지도 마커로 시각화 |
| 뭐먹지 버튼 | 최근 추천 점수 상위 3곳을 카드형 UI로 추천 |
| 상세 정보 | 식당 이름, 카테고리, 거리, 평점, 리뷰 수 표시 |

### 서비스 플로우

```
사용자 접속
    ↓
위치 권한 요청 (Geolocation API)
    ↓
현재 위치 중심으로 지도 렌더링 (카카오맵 SDK)
    ↓
주변 맛집 검색 (카카오 로컬 API)
    ↓
지도에 마커 표시 + 목록 사이드패널
    ↓
[뭐먹지] 버튼 클릭
    ↓
평점 × 리뷰수 기반 추천 점수 계산
    ↓
상위 3곳 추천 카드 모달 표시
```

---

## 2. 기술 스택

### Frontend (순수 웹 기술 — 빌드 도구 없음)
| 항목 | 선택 | 이유 |
|------|------|------|
| 마크업 | HTML5 | 의존성 없는 단순 구조 |
| 스타일 | CSS3 (CSS Variables) | 빌드 불필요, 모바일 반응형 |
| 로직 | Vanilla JavaScript (ES Modules) | 외부 프레임워크 없이 빠른 구동 |
| 지도 | **카카오맵 JavaScript SDK v3** | 국내 POI 데이터 최다, 한국어 지원 |
| 식당 데이터 | **카카오 로컬 REST API** | 카테고리 검색, 장소 상세, 평점 포함 |

> **대안**: Naver Maps API (카카오 API 키 없을 경우 대체 가능)

### 백엔드
- **없음 (서버리스 정적 웹앱)**: 카카오 API 직접 호출로 백엔드 불필요
- API 키 보호를 위해 `.env` 분리 및 CORS 주의 필요

---

## 3. 디렉토리 구조

```
findplace/
├── index.html                  # 메인 진입점
├── css/
│   ├── style.css               # 전역 스타일, CSS 변수
│   ├── map.css                 # 지도 컴포넌트 스타일
│   └── modal.css               # 추천 모달 스타일
├── js/
│   ├── config.js               # API 키 및 환경 설정 (gitignore)
│   ├── app.js                  # 앱 초기화, 이벤트 오케스트레이션
│   ├── location.js             # Geolocation API 래퍼
│   ├── map.js                  # 카카오맵 초기화, 마커 관리
│   ├── restaurant.js           # 카카오 로컬 API 호출, 데이터 파싱
│   └── recommendation.js       # 추천 점수 계산, 상위 3곳 선정
├── .env.example                # API 키 템플릿 (커밋 포함)
├── .gitignore                  # config.js, .env 제외
└── README.md                   # 실행 방법 가이드
```

---

## 4. 핵심 모듈 설계

### 4-1. location.js — 위치 탐지
```
getCurrentPosition()
  → navigator.geolocation.getCurrentPosition()
  → 성공: { lat, lng } 반환
  → 실패: 기본 좌표 (서울 시청) 폴백
```

### 4-2. map.js — 지도 관리
```
initMap(lat, lng)
  → 카카오맵 생성, 현재 위치 마커 표시

addRestaurantMarkers(restaurants)
  → 맛집별 커스텀 마커 추가
  → 클릭 시 InfoWindow로 기본 정보 표시

clearMarkers()
  → 기존 마커 전체 제거 후 재렌더링
```

### 4-3. restaurant.js — 맛집 데이터
```
searchNearby(lat, lng, radius=1000)
  → 카카오 로컬 API: /v2/local/search/category.json
  → category_group_code=FD6 (음식점)
  → 반환: [ { id, name, address, lat, lng, rating, reviewCount, url } ]
```

> 카카오 로컬 API의 place_url, x, y, category_name 필드 활용

### 4-4. recommendation.js — 추천 점수 계산

**추천 점수 공식:**
$$
\text{score} = \text{rating} \times \log_{10}(\text{reviewCount} + 1) \times \text{distanceFactor}
$$

| 변수 | 설명 |
|------|------|
| `rating` | 카카오 평점 (0~5) |
| `reviewCount` | 리뷰 수 (log 스케일로 정규화) |
| `distanceFactor` | 가까울수록 1.0에 가깝게 (1 - distance/maxRadius) |

```
getTopRecommendations(restaurants, count=3)
  → 점수 계산 후 내림차순 정렬
  → 상위 count개 반환
```

---

## 5. UI/UX 구성

### 레이아웃 (모바일 우선 반응형)

```
┌────────────────────────────────────┐
│  헤더: FindPlace 🍽️                │
├──────────────┬─────────────────────┤
│              │  사이드패널 (데스크탑) │
│   카카오맵    │  - 맛집 목록 리스트  │
│   (전체화면)  │  - 거리 / 평점 표시  │
│              │                     │
│   [뭐먹지?]  │                     │
│    버튼       │                     │
└──────────────┴─────────────────────┘

[뭐먹지] 클릭 시 → 추천 모달 오버레이
┌────────────────────────────────┐
│  🏆 오늘의 맛집 추천 TOP 3      │
│  ─────────────────────────     │
│  1위 ⭐4.8 | 리뷰 320개         │
│     맛있는 한식집               │
│     📍 도보 3분 (230m)          │
│     [카카오맵에서 보기]          │
│  ─────────────────────────     │
│  2위 ⭐4.6 | 리뷰 180개         │
│  3위 ⭐4.5 | 리뷰 250개         │
└────────────────────────────────┘
```

### 색상 팔레트
| 변수 | 값 | 용도 |
|------|----|------|
| `--primary` | `#FF6B35` | 메인 강조색 (식욕 자극 오렌지) |
| `--secondary` | `#2C3E50` | 텍스트, 헤더 배경 |
| `--accent` | `#F7DC6F` | 별점, 하이라이트 |
| `--bg` | `#F8F9FA` | 사이드패널 배경 |

---

## 6. 외부 API 연동

### 카카오 Developer 설정 (사전 조건)
1. [Kakao Developers](https://developers.kakao.com) 계정 생성
2. 애플리케이션 등록 → **JavaScript 키** 획득
3. 플랫폼 → 웹 → 도메인 등록 (로컬: `http://localhost`)
4. **카카오 로컬 API**: REST API 키 획득 (서비스 → 추가)

### API 호출 흐름
```
카카오맵 SDK (스크립트 로드)
  └─ appkey: JavaScript 키

카카오 로컬 REST API
  POST /v2/local/search/category.json
  Headers: Authorization: KakaoAK {REST_API_KEY}
  Params: category_group_code=FD6, x={lng}, y={lat}, radius={m}, sort=distance
```

> **CORS 이슈**: 카카오 로컬 API는 서버사이드 호출 권장.
> 브라우저 직접 호출 시 CORS 에러 발생 → 해결 방안: JSONP 또는 간단한 프록시 서버

### CORS 해결 옵션
| 방법 | 난이도 | 설명 |
|------|--------|------|
| A. 카카오맵 SDK 내 Places 서비스 | ★☆☆ | SDK 자체 지원, 별도 API 키 불필요 |
| B. Node.js Express 프록시 | ★★☆ | 가벼운 백엔드 추가 |
| C. Vercel Edge Function | ★★☆ | 무료 서버리스 배포 |

**→ 선택: A안 (카카오맵 SDK Places 서비스)** — 가장 단순, 추가 서버 불필요

---

## 7. 구현 태스크 (tasks.md)

### Phase 1: 프로젝트 초기화
- [ ] 디렉토리 구조 생성
- [ ] `index.html` 기본 골격 작성
- [ ] CSS 변수 및 기본 스타일 설정
- [ ] 카카오맵 SDK 스크립트 로드 연결
- [ ] `.gitignore`, `.env.example` 작성

### Phase 2: 위치 및 지도
- [ ] `location.js` — Geolocation API 구현 + 에러 폴백
- [ ] `map.js` — 카카오맵 초기화, 현재 위치 마커
- [ ] 현재 위치 중심 지도 렌더링 확인

### Phase 3: 맛집 데이터
- [ ] `restaurant.js` — 카카오 Places 서비스 키워드/카테고리 검색
- [ ] 검색 결과 파싱 (이름, 주소, 좌표, 카테고리, URL)
- [ ] 지도에 맛집 마커 표시 + InfoWindow

### Phase 4: 사이드패널 목록
- [ ] 맛집 카드 리스트 HTML/CSS
- [ ] 마커 클릭 ↔ 목록 카드 연동 하이라이트

### Phase 5: 뭐먹지 추천 기능
- [ ] `recommendation.js` — 추천 점수 알고리즘 구현
- [ ] 상위 3곳 추출 로직
- [ ] 추천 모달 UI 구현
- [ ] [뭐먹지?] 버튼 클릭 이벤트 연결

### Phase 6: 마무리
- [ ] 모바일 반응형 CSS 점검
- [ ] 로딩 스피너, 에러 메시지 UX
- [ ] README.md 작성 (API 키 설정 방법 포함)
- [ ] 로컬 테스트 및 검증

---

## 8. 기술 리스크 및 대응

| 리스크 | 가능성 | 대응 |
|--------|--------|------|
| Geolocation 권한 거부 | 중 | 서울 시청 좌표로 폴백, 수동 위치 입력 UI |
| 카카오 API 평점 미제공 | 중 | Places API 응답에 평점 없을 경우 리뷰 수만으로 정렬 |
| CORS 에러 | 낮음 | Places SDK 사용으로 우회 |
| API 키 노출 | 높음 | config.js gitignore, README에 설정 가이드 명시 |

---

## 9. 확장 로드맵 (v2+)

| 기능 | 설명 |
|------|------|
| 필터링 | 카테고리(한식/중식/일식), 거리 반경 조절 |
| 즐겨찾기 | LocalStorage 기반 저장 |
| 공유 기능 | URL 파라미터로 추천 결과 공유 |
| 다크모드 | CSS Variables로 간단 구현 |
| PWA | 오프라인 지원, 홈 화면 설치 |

---

## 10. 실행 방법 (예상)

```bash
# 1. Kakao Developers에서 API 키 발급
# 2. config.js에 키 입력
# 3. 로컬 서버 실행 (파일 직접 열기 시 CORS 문제)
npx serve .
# 또는
python -m http.server 3000
# 4. http://localhost:3000 접속
```

---

**다음 단계**: Phase 1부터 순서대로 구현 시작
