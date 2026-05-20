# CHANGELOG
---

## [2.0.0-beta] - 2025 

> **awesome-copilot 1.0 통합 + VS Code Agents 구조 전환 + 자동 설정 프롬프트 도입**

### Added (신규 추가)

#### 자동화 및 온보딩
- **`QUICKSTART.md`** — 3단계 빠른 시작 가이드 신규 추가
  - `init-ahnlab` 프롬프트 기반 전체 자동 설정 흐름 안내
  - Phase 0~4 단계별 자동 배포 절차 포함
- **`prompts/init-ahnlab.prompt.md`** — 자동 설정 프롬프트 신규 추가
  - Phase 0: 프로젝트 분석 / Phase 1: Instructions 배포 / Phase 2: Agents 배포
  - Phase 3: Skills & Plugins 배포 / Phase 4: AGENTS.md 생성
  - 구버전의 수동 복사+치환 방식을 완전히 대체

#### 신규 템플릿 파일
- **`templates/AHNLAB_TEMPLATE_error-handling.instructions.md`** — 에러 처리 패턴 독립 파일 신규 추가
  - 구버전 `TEMPLATE_instructions.md` 내 포함되어 있던 내용을 독립 파일로 분리 및 대폭 확장
  - `do-while(FALSE)`, `goto CleanUp`, RAII, Fast Fail 등 8가지 패턴 포함
  - 언어별 플레이스홀더: `[프로젝트 언어별 에러 코드 타입]`, `[POOL_TAG]` 등
- **`templates/AHNLAB_TEMPLATE_project-root-agents.md`** — 프로젝트 루트 `AGENTS.md` 템플릿 신규 추가
  - Setup Commands, Code Search Procedures, High-Risk Areas, Development Workflow 포함
  - Review Checklist, Reporting Format 섹션 포함
  - 플레이스홀더: `[프로젝트명]`, `[빌드 명령어]`, `[핵심 진입점 파일]` 등
- **`templates/AHNLAB_TEMPLATE_implementation-auditor.agent.md`** — 감사 에이전트 템플릿 신규 추가
  - Copilot 설정 완료 여부를 자동으로 검증하는 에이전트
  - Instructions/Agents/Skills/Plugins 배포 상태, 플레이스홀더 치환 여부 점검
- **`templates/PROJECT_COPILOT_SETUP_GUIDE_utf8.md`** — 기존 설정 가이드의 UTF-8 인코딩 버전 추가
- **`templates/README.TXT`** — 템플릿 디렉토리 사용 안내 파일 추가

#### awesome-copilot 1.0 통합
- **`templates/awesome-copilot-main/`** — awesome-copilot 1.0 전체 콘텐츠 통합
  - `agents/` — 17개 범용 에이전트 파일 (`.agent.md`)
    - `academic-researcher`, `api-developer`, `code-archaeologist`, `code-reviewer` 등
  - `instructions/` — 11개 범용 인스트럭션 파일 (`.instructions.md`)
    - `angular`, `code-review`, `error-handling`, `function-generation` 등
  - `skills/` — 10개 스킬 폴더 (git-master, playwright, frontend-ui-ux 등)
  - `plugins/` — 9개 플러그인 폴더
  - `GUIDE.md` — awesome-copilot 1.0 사용 가이드
  - `SELECTION-CRITERIA.md` — 콘텐츠 선별 기준
  - `CLEANUP-REPORT.md` — 정리 보고서

---

### Changed (변경)

#### 파일명 규칙 변경
| 구버전 파일명 | 신버전 파일명 |
|---|---|
| `TEMPLATE_chatmodes.md` | `AHNLAB_TEMPLATE_agent-roles.md` |
| `TEMPLATE_code-style-guide.md` | `AHNLAB_TEMPLATE_code-style-guide.md` |
| `TEMPLATE_commit-message.style.md` | `AHNLAB_TEMPLATE_commit-message.style.md` |
| `TEMPLATE_copilot-instructions.md` | `AHNLAB_TEMPLATE_copilot-instructions.md` |
| `TEMPLATE_instructions.md` | `AHNLAB_TEMPLATE_instructions.md` |

> **규칙 변경**: `TEMPLATE_` 접두사 → `AHNLAB_TEMPLATE_` 접두사
> 안랩 프로젝트 전용 커스터마이징 템플릿임을 명시

---

#### `TEMPLATE_chatmodes.md` → `AHNLAB_TEMPLATE_agent-roles.md`

**구조 전환: VS Code Chat Mode → VS Code Agent**

| 항목 | 구버전 (`.chatmode.md`) | 신버전 (`.agent.md`) |
|---|---|---|
| 형식 | `.chatmode.md` 파일 | `.agent.md` 파일 |
| 에이전트 수 | 6개 | 7개 (+1) |
| 내용 구조 | 단일 본문 | 원본(awesome-copilot-main) + 프로젝트 추가사항 이중 구조 |

**에이전트 목록 변경:**
- `explainer` — 유지 (내용 업데이트)
- `mentor` — awesome-copilot-main 원본으로 교체 (대폭 상세화)
- `plan` — awesome-copilot-main 원본으로 교체 (대폭 상세화)
- `janitor` — awesome-copilot-main 원본으로 교체 (대폭 상세화)
- `prd` — awesome-copilot-main 원본으로 교체 (대폭 상세화)
- `specification` — awesome-copilot-main 원본으로 교체 (대폭 상세화)
- **`ultimate-beast-mode`** — **신규 추가** (복합 고난도 작업용 에이전트)

---

#### `TEMPLATE_instructions.md` → `AHNLAB_TEMPLATE_instructions.md`

**247줄 → 1,126줄 (4.5배 확장)**

| 섹션 | 구버전 | 신버전 |
|---|---|---|
| `security-patterns.instructions.md` | 기본 보안 패턴 | OWASP Top 10 기반 전체 내용 + C/C++ 특화 추가 |
| `error-handling.instructions.md` | 기본 에러 처리 패턴 | 독립 파일(`AHNLAB_TEMPLATE_error-handling.instructions.md`)로 분리, 본문은 참조 구조 유지 |
| `markdown.instructions.md` | 기본 마크다운 규칙 | GitHub 접근성 5대 원칙 + Doxygen 규칙 추가 |
| `code-review.instructions.md` | **없음** | **신규**: 커널 드라이버 IRQL, 메모리 안전성, 동시성 중심 리뷰 규칙 추가 |
| `function-generation.instructions.md` | **없음** | **신규**: [엔진명], Hungarian Notation, Doxygen 플레이스홀더 포함 |

**내용 구조 변경:**
- 구버전: 단순 단일 본문
- 신버전: `<!-- awesome-copilot-main 기반 원본 내용 -->` + `<!-- [프로젝트명] 추가사항 -->` 이중 구조
  - 원본 범용 내용과 프로젝트 특화 내용을 명확히 구분

---

#### `TEMPLATE_copilot-instructions.md` → `AHNLAB_TEMPLATE_copilot-instructions.md`

**108줄 → 81줄 (경량화 + 구조 개선)**

| 변경 유형 | 내용 |
|---|---|
| **수정** | `security-patterns.md` → `security-patterns.instructions.md` (파일 확장자 규칙 변경) |
| **추가** | `AGENTS.md` 참조 항목 추가 ("에이전트/탐색/작업 규칙 (프로젝트 루트 필수)") |
| **제거** | `### 🔧 빌드 시스템` 섹션 전체 삭제 (AGENTS.md로 이관) |

---

#### `PROJECT_COPILOT_SETUP_GUIDE.md` — 설정 방식 전환

| 항목 | 구버전 | 신버전 |
|---|---|---|
| 설정 방식 | 수동 (templates 복사 → 치환 → 배포) | 자동화 (`init-ahnlab` 프롬프트 기반) |
| 구조 설명 | 단순 파일 배포 | Instructions + Agents 2층 구조 설명 추가 |
| 참조 파일 | 없음 | `QUICKSTART.md`, `prompts/init-ahnlab.prompt.md` 연결 |

---

### Unchanged (변경 없음)

- **`AHNLAB_TEMPLATE_code-style-guide.md`** — 내용 동일, 파일명만 변경 (`TEMPLATE_` → `AHNLAB_TEMPLATE_`)
- **`AHNLAB_TEMPLATE_commit-message.style.md`** — 내용 동일, 파일명만 변경 (`TEMPLATE_` → `AHNLAB_TEMPLATE_`)

---

### Removed (제거)

- **`TEMPLATE_prompts.md`** — 삭제
  - 구버전에서 프롬프트 모음 역할을 하던 파일
  - 신버전에서는 `prompts/init-ahnlab.prompt.md`로 대체 (단일 자동화 프롬프트 방식)

---

## [1.0.0] - 2024 

> **초기 릴리즈 — 수동 플레이스홀더 치환 방식의 Copilot 템플릿 시스템**

### 포함 파일 (7개)

| 파일 | 역할 |
|---|---|
| `PROJECT_COPILOT_SETUP_GUIDE.md` | 수동 3단계 설정 가이드 |
| `TEMPLATE_chatmodes.md` | VS Code Chat Mode 6개 템플릿 |
| `TEMPLATE_code-style-guide.md` | 코드 스타일 가이드 템플릿 |
| `TEMPLATE_commit-message.style.md` | 커밋 메시지 스타일 템플릿 |
| `TEMPLATE_copilot-instructions.md` | Copilot Instructions 구성 템플릿 |
| `TEMPLATE_instructions.md` | Instructions 파일 3종 템플릿 (security/error-handling/markdown) |
| `TEMPLATE_prompts.md` | 프롬프트 모음 템플릿 |

### 특징
- 플레이스홀더(`[프로젝트명]`, `[언어]`, `[빌드 명령어]` 등) 수동 치환 방식
- VS Code Chat Mode(`.chatmode.md`) 기반
- 3단계 수동 설정: templates 복사 → 플레이스홀더 치환 → `.github/` 배포

---

## 마이그레이션 가이드 (v1.0-beta → v2.0-beta)

### 핵심 변경 사항 요약

1. **파일명**: `TEMPLATE_*.md` → `AHNLAB_TEMPLATE_*.md`
2. **Chat Mode → Agent**: `.chatmode.md` → `.agent.md` 형식으로 전환
3. **설정 방식**: 수동 복사+치환 → `init-ahnlab` 프롬프트 자동 설정
4. **구조**: 단일 파일 → awesome-copilot-main 원본 + 프로젝트 추가사항 이중 구조
5. **AGENTS.md**: 신규 필수 파일로 추가 (`AHNLAB_TEMPLATE_project-root-agents.md` 참조)

### 마이그레이션 절차

```
1. QUICKSTART.md 읽기
2. GitHub Copilot Chat에서 init-ahnlab.prompt.md 실행
3. 자동 배포된 파일의 플레이스홀더([...]) 프로젝트에 맞게 치환
4. implementation-auditor 에이전트로 설정 완료 여부 검증
```

---