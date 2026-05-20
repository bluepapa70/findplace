# AhnLab Copilot Configuration Kit — Copilot Instructions

## Project Overview

AhnLab Copilot Configuration Kit은 GitHub Copilot 2세대 체계(Instructions + Agents + Skills + Plugins)를
신규/기존 프로젝트에 자동으로 배포하기 위한 설정 배포 패키지입니다.

`/init-ahnlab` 슬래시 커맨드 한 번으로 `.github/` 하위 전체 Copilot 구성을 자동 생성합니다.

### 기술 스택
- 언어: Markdown (`.md`)
- 도구: GitHub Copilot Chat, VS Code
- 주요 산출물: `.github/agents/`, `.github/instructions/`, `.github/skills/`, `.github/plugins/`
- 배포 방식: Copilot Chat 슬래시 커맨드 (`/init-ahnlab`)

---

## 코딩 스타일 가이드

### 기본 원칙

이 레포지토리의 모든 Markdown 문서와 설정 파일은 다음 문서를 준수해야 합니다.

**통합 가이드 문서: `.github/code-style-guide.md`**

### 핵심 준수 사항

#### 필수 참조 문서
- **`.github/code-style-guide.md`** — Markdown 작성 스타일 가이드
- **`.github/instructions/markdown.instructions.md`** — Markdown 작성 규칙
- **`AGENTS.md`** — 배포 절차 및 에이전트 운영 지침서

---

## 커밋 메시지 스타일 가이드

커밋 메시지는 **`.github/commit-message.style.md`** 파일의 형식을 따릅니다.

---

## 디렉토리 구조

### 프로젝트 최상위 구조
```
AhnLab-Copilot-Kit/
├── .github/                    # GitHub/Copilot 설정 (배포 결과물)
│   ├── copilot-instructions.md # 이 파일
│   ├── code-style-guide.md
│   ├── commit-message.style.md
│   ├── agents/                 # 배포된 에이전트 파일 (20개)
│   ├── instructions/           # 배포된 인스트럭션 파일 (12개)
│   ├── skills/                 # 배포된 스킬 디렉토리 (10개)
│   ├── plugins/                # 배포된 플러그인 디렉토리 (9개)
│   ├── docs/                   # 자동 생성된 프로젝트 문서
│   ├── prompts/                # Copilot Chat 슬래시 커맨드 프롬프트
│   └── templates/              # 원본 템플릿 소스 (수정 금지)
│       ├── AHNLAB_TEMPLATE_*.md
│       └── awesome-copilot-main/
│           ├── agents/         # 에이전트 마스터 소스
│           ├── instructions/   # 인스트럭션 마스터 소스
│           ├── skills/         # 스킬 마스터 소스
│           └── plugins/        # 플러그인 마스터 소스
├── prompts/                    # 루트 레벨 프롬프트 (배포 전 원본)
├── templates/                  # 루트 레벨 템플릿 (배포 전 원본)
├── AGENTS.md                   # AI 에이전트 운영 지침서
└── QUICKSTART.md               # 빠른 시작 가이드
```

### 주요 컴포넌트 설명

**templates/awesome-copilot-main/** — 에이전트/인스트럭션/스킬/플러그인 원본 마스터 소스.
- 절대 직접 수정하지 않습니다. 수정 시 배포 무결성에 영향을 줍니다.
- 주요 파일: `agents/*.agent.md`, `instructions/*.instructions.md`

**prompts/init-ahnlab.prompt.md** — 핵심 배포 슬래시 커맨드.
- 이 파일이 `/init-ahnlab` 커맨드를 정의합니다.

**templates/AHNLAB_TEMPLATE_*.md** — CFG 파일 생성용 기반 템플릿.
- Phase 3에서 플레이스홀더를 채워 `.github/` 배포 파일로 변환됩니다.

---

### 보안 관련 주의사항

**템플릿 무결성**
- `templates/awesome-copilot-main/` 내 파일은 원본 그대로 유지해야 합니다.
- 배포 파일(`.github/agents/` 등)에만 프로젝트 특화 내용을 추가합니다.
- 프로젝트 특화 추가 시 원본 내용 뒤에 구분자(`---`)와 함께 추가합니다.

---

**마지막 업데이트**: 2026-05-20
**문서 버전**: 2.0-beta
**적용 범위**: AhnLab Copilot Configuration Kit 전체
