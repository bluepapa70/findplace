# AhnLab Copilot Configuration Kit — Agent Instructions

> **생성일**: 2026-05-20 | **버전**: 2.0-beta
> AI coding agent가 이 레포지토리에서 작업할 때 따라야 하는 핵심 가이드라인입니다.
> 하위 디렉토리별 상세 가이드는 각 디렉토리의 `AGENTS.md`를 참조하세요.

---

## 프로젝트 개요

**AhnLab Copilot Configuration Kit**은 GitHub Copilot 2세대 체계(Instructions + Agents + Skills + Plugins)를
신규/기존 프로젝트에 자동으로 배포하기 위한 설정 배포 패키지입니다. 이 프로젝트는 다음 구성요소를 포함합니다.

- **`/init-ahnlab` 커맨드** — Copilot Chat 슬래시 커맨드로 전체 설정 자동 배포
- **에이전트 소스 (20개)** — `templates/awesome-copilot-main/agents/`에 위치한 마스터 에이전트 파일
- **인스트럭션 소스 (12개)** — `templates/awesome-copilot-main/instructions/`에 위치한 마스터 규칙 파일
- **Skills (10개) / Plugins (9개)** — 재사용 가능한 스킬 및 플러그인 모음
- **AHNLAB_TEMPLATE_*.md** — 프로젝트 맞춤 CFG 파일 생성용 기반 템플릿

---

## 프로젝트 구조

```
c:\CodeTemp\  (프로젝트 루트)
├── .github/                        # GitHub/Copilot 설정 (배포 결과물)
│   ├── agents/                     # 배포된 에이전트 (20개)
│   ├── instructions/               # 배포된 인스트럭션 (12개)
│   ├── skills/                     # 배포된 스킬 (10개)
│   ├── plugins/                    # 배포된 플러그인 (9개)
│   ├── docs/                       # 자동 생성 문서 (Phase 3.5)
│   ├── prompts/                    # Copilot Chat 슬래시 커맨드
│   ├── templates/                  # 원본 템플릿 소스 (수정 금지)
│   ├── copilot-instructions.md
│   ├── code-style-guide.md
│   └── commit-message.style.md
├── prompts/                        # 루트 레벨 프롬프트 (배포 전 원본)
│   └── init-ahnlab.prompt.md       # ← /init-ahnlab 커맨드 정의 파일
├── templates/                      # 루트 레벨 템플릿 (배포 전 원본)
│   ├── AHNLAB_TEMPLATE_*.md        # CFG 생성 기반 템플릿
│   └── awesome-copilot-main/       # 에이전트/인스트럭션 마스터 소스
├── AGENTS.md                       # 이 파일
└── QUICKSTART.md
```

### 주요 진입점 (Entry Points)

| 파일/경로 | 역할 |
|-----------|------|
| `prompts/init-ahnlab.prompt.md` | `/init-ahnlab` 슬래시 커맨드 정의 — 전체 배포 프로세스 진입점 |
| `templates/awesome-copilot-main/agents/` | 에이전트 마스터 소스 — Phase 1 복사 대상 |
| `templates/awesome-copilot-main/instructions/` | 인스트럭션 마스터 소스 — Phase 2 복사 대상 |
| `templates/AHNLAB_TEMPLATE_copilot-instructions.md` | copilot-instructions.md 생성 템플릿 |
| `templates/AHNLAB_TEMPLATE_project-root-agents.md` | AGENTS.md 생성 템플릿 |
| `QUICKSTART.md` | 사용자 빠른 시작 가이드 |

---

## 빌드 명령어

### 필수 환경
- **VS Code** 최신 버전 — Copilot Chat 실행 환경
- **GitHub Copilot Chat 확장** — `/init-ahnlab` 커맨드 실행
- 환경변수: 별도 환경변수 불필요

### 배포 실행 (빌드에 해당)

```powershell
# STEP 1: 사전 조건 확인 — templates/ 및 prompts/ 폴더 존재 여부
Test-Path ".\templates\awesome-copilot-main\agents"
Test-Path ".\prompts\init-ahnlab.prompt.md"

# STEP 2: .github/ 구조 설정 (미설정 시)
Copy-Item -Path ".\templates" -Destination ".\.github\templates" -Recurse -Force
Copy-Item -Path ".\prompts"   -Destination ".\.github\prompts"   -Recurse -Force
```

**STEP 3**: VS Code Copilot Chat에서 `/init-ahnlab` 입력 후 Enter

**산출물**: `.github/agents/` (20개), `.github/instructions/` (12개), `.github/skills/` (10개), `.github/plugins/` (9개), `.github/docs/` (최대 14개), `AGENTS.md`, `.github/templates/AUDIT_REPORT_*.md`

### 재배포 (기존 파일 교체)

```powershell
# 배포 결과물 초기화 후 재실행
Remove-Item ".\.github\agents" -Recurse -Force
Remove-Item ".\.github\instructions" -Recurse -Force
# 이후 /init-ahnlab 재실행
```

> **검증 방법**: Phase 5 감사 완료 후 `.github/templates/AUDIT_REPORT_YYYY-MM-DD.md`에서 PASS 확인.

---

## 개발 워크플로우

### 새로운 기능/수정 작업 절차

1. **탐색**: `templates/awesome-copilot-main/` 구조 파악 및 영향 범위 분석
2. **계획**: 원본 수정 최소화 — 프로젝트 특화 내용은 맨 끝 구분자 이후에만 추가
3. **구현**: 단일 책임, 기존 패턴 확인 후 구현 (`AHNLAB_TEMPLATE_*.md` 패턴 참조)
4. **검증**: `/init-ahnlab` 재실행 → Phase 5 감사 PASS 확인
5. **커밋**: `.github/commit-message.style.md` 형식 준수

### 템플릿 파일 추가 절차

**새 에이전트 추가 시:**
1. `templates/awesome-copilot-main/agents/`에 `*.agent.md` 파일 추가
2. `prompts/init-ahnlab.prompt.md`의 Phase 5 검증 대상 목록 업데이트
3. `/init-ahnlab` 재실행으로 `.github/agents/`에 자동 배포 확인

**새 AHNLAB_TEMPLATE 추가 시:**
1. `templates/AHNLAB_TEMPLATE_새파일명.md` 생성 (플레이스홀더 `[대괄호]` 포함)
2. `prompts/init-ahnlab.prompt.md`의 Phase 3 섹션에 처리 규칙 추가
3. Phase 5 검증 대상에 추가

### 배포/검증 워크플로우

```
템플릿 수정 →
/init-ahnlab 실행 →
.github/ 구조 확인 →
Phase 5 감사 리포트 PASS 확인 →
Git 커밋
```

---

## 코드 스타일 가이드라인

**스타일**: Markdown, **2 스페이스** 들여쓰기 (YAML frontmatter), 섹션당 하나의 역할, 중첩 3레벨 이하.

### 명명 규칙

| 항목 | 규칙 | 예시 |
|------|------|------|
| 에이전트 파일 | `kebab-case.agent.md` | `se-security-reviewer.agent.md` |
| 인스트럭션 파일 | `kebab-case.instructions.md` | `code-review-generic.instructions.md` |
| 템플릿 파일 | `AHNLAB_TEMPLATE_kebab-case.md` | `AHNLAB_TEMPLATE_copilot-instructions.md` |
| 스킬 디렉토리 | `kebab-case/` | `breakdown-plan/` |
| 플레이스홀더 | `[대괄호]` | `[프로젝트명]`, `[날짜]` |

### 에러 처리 패턴

**Phase 스킵 패턴** (선택사항 Phase에서 소스 미존재 시):
```markdown
⚠️  [Phase X.X] 폴더가 없습니다. 해당 배포를 스킵합니다.
```

**멱등성 패턴** (기존 파일 존재 시):
```powershell
if (-not (Test-Path $dest)) {
    Copy-Item $src -Destination $dest
}
# 존재하면 건너뜀 (덮어쓰기 금지)
```

### 금지 행동 및 대체 방법

| 금지 행동 | 대체 방법 |
|-----------|-----------|
| `awesome-copilot-main/` 내 파일 직접 수정 | `.github/agents/`의 배포 파일 맨 끝에 구분자 이후 추가 |
| `Copy-Item -Force`로 기존 파일 덮어쓰기 | `if (-not (Test-Path $dest))` 조건부 복사 |
| 플레이스홀더 미치환 상태로 커밋 | Phase 5 감사 후 PASS 확인 후 커밋 |

---

## 고위험 영역 (High-Risk Areas)

> 아래 영역 작업 시 반드시 주의가 필요합니다.

| 파일/모듈 | 위험 요소 | 필수 확인 사항 |
|-----------|----------|--------------|
| `templates/awesome-copilot-main/` | 원본 수정 시 배포 무결성 파괴 | 절대 직접 수정 금지. 배포 파일에만 추가. |
| `prompts/init-ahnlab.prompt.md` | Phase 순서 변경 시 의존성 오류 | Phase 번호 및 순서 유지 |
| `templates/AHNLAB_TEMPLATE_*.md` | 플레이스홀더 형식 변경 시 치환 실패 | `[대괄호]` 형식 유지 |
| `.github/copilot-instructions.md` | 프로젝트 전역 Copilot 지침 — 잘못된 내용이 모든 응답에 영향 | 내용 정확성 검토 필수 |

### 절대 하면 안 되는 것

- `templates/awesome-copilot-main/` 내 파일을 직접 수정하지 않습니다.
- `/init-ahnlab` 실행 중 기존 `.github/agents/` 파일을 `-Force` 옵션으로 덮어쓰지 않습니다.
- 플레이스홀더(`[대괄호]`)가 남아 있는 상태로 CFG 파일을 커밋하지 않습니다.
- Phase 5 감사 FAIL 상태로 배포를 완료로 처리하지 않습니다.

---

## 커밋 메시지 스타일

```
<type>(<scope>): <subject>  ← 50자 이내, 한글 또는 영어, 명령형

[변경 동기]    변경이 발생한 이유와 문제를 간결하게 서술한다.
[해결 방법]    실제 변경 내용을 구체적으로 서술한다.
[관련 파일]    수정된 주요 파일 목록
[테스트 결과]  테스트 환경: VS Code + Copilot Chat
               Test Step) 1.준비 2./init-ahnlab 실행 3.결과 확인 4.감사 PASS
```

| Type | 의미 | Scope 예시 |
|------|------|-----------|
| `feat` / `fix` / `refactor` / `security` / `docs` / `chore` | 기능/버그/리팩/보안/문서/빌드 | `agents` / `instructions` / `phase3` / `templates` / `init` |

---

## Pull Request 가이드라인

> **중요**: 모든 Pull Request는 **`develop`** 브랜치를 대상으로 합니다.

1. **검증**: `/init-ahnlab` 실행 후 Phase 5 감사 PASS 확인
2. **스타일 준수**: `.github/code-style-guide.md` Markdown 규칙 확인
3. **원본 보존**: `templates/awesome-copilot-main/` 파일 미수정 확인
4. **플레이스홀더**: 모든 `[대괄호]` 치환 완료 확인
5. **설명**: 변경 내용 및 이유를 명확히 작성

### 커밋 전 체크리스트

- [ ] `/init-ahnlab` 실행 성공 (오류 없음)
- [ ] `.github/templates/AUDIT_REPORT_YYYY-MM-DD.md` PASS 확인
- [ ] 원본 템플릿 파일 미수정 확인
- [ ] 플레이스홀더 `[대괄호]` 미잔류 확인
- [ ] 커밋 메시지 형식 준수 (`.github/commit-message.style.md`)

### 코드 리뷰 체크리스트

**코드 품질:**
- [ ] `.github/code-style-guide.md` Markdown 규칙 준수
- [ ] 에이전트/인스트럭션 원본 내용 보존 여부
- [ ] 자동 생성 파일에 `<!-- Auto-generated by /init-ahnlab -->` 주석 포함

**보안:**
- [ ] `templates/awesome-copilot-main/` 원본 파일 미수정
- [ ] 민감 정보(API 키 등) 미포함
- [ ] 구분자(`---` + `<!-- [Project-Specific Additions] -->`) 형식 준수

**빌드/테스트:**
- [ ] `/init-ahnlab` 실행 성공
- [ ] Phase 5 감사 PASS

---

## 기여 안내

관련 가이드:
- [CONTRIBUTING.md](.github/docs/CONTRIBUTING.md) — 기여 가이드라인
- [CODING_GUIDELINES.md](.github/docs/CODING_GUIDELINES.md) — 코딩 표준
- [SECURITY_GUIDELINES.md](.github/docs/SECURITY_GUIDELINES.md) — 보안 정책
- [`.github/commit-message.style.md`](.github/commit-message.style.md) — 커밋 메시지 형식

## 프로젝트 문서 참조

| 문서 | 설명 | 경로 |
|------|------|------|
| `ARCHITECTURE.md` | 아키텍처 개요 | `.github/docs/ARCHITECTURE.md` |
| `CODING_GUIDELINES.md` | 통합 코딩 가이드라인 | `.github/docs/CODING_GUIDELINES.md` |
| `CONTRIBUTING.md` | 기여 가이드 | `.github/docs/CONTRIBUTING.md` |
| `DIRECTORY_STRUCTURE.md` | 디렉토리 구조 및 역할 설명 | `.github/docs/DIRECTORY_STRUCTURE.md` |
| `PROJECT_OVERVIEW.md` | 프로젝트 개요 | `.github/docs/PROJECT_OVERVIEW.md` |
| `RELEASE_NOTES_TEMPLATE.md` | 릴리즈 노트 템플릿 | `.github/docs/RELEASE_NOTES_TEMPLATE.md` |
| `SECURITY_GUIDELINES.md` | 보안 가이드라인 | `.github/docs/SECURITY_GUIDELINES.md` |

---

**마지막 업데이트**: 2026-05-20
**버전**: 2.0-beta
**담당**: AhnLab Copilot Configuration Kit coding agent 가이드
