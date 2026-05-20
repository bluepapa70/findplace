# 프로젝트 Copilot 템플릿 설정 가이드 v2.0-beta

이 문서는 `/init-ahnlab` 프롬프트를 사용하여 GitHub Copilot 2층 구조를 **자동으로** 설정하는 방법을 안내합니다.

> ** 핵심 변경**: 수동 가이드 따라하기 → `/init-ahnlab` 한 번으로 전체 자동 설정

핵심 목표는 아래 3가지입니다:
- Copilot이 프로젝트 맥락(보안/규칙/제약)을 정확히 이해하도록 설정한다.
- 팀 규약(코딩 스타일/보안/에러 처리/커밋 규칙)을 일관되게 관리한다.
- 개발 역할(분석/리뷰/기획/테스트/리팩토링)에 맞는 에이전트/지침을 표준화한다.

---

## 0. 용어 정의

- **Instructions (1층)**: 코딩 스타일 및 정적 코딩 원칙 규칙 파일(`*.instructions.md`). `applyTo` 패턴으로 자동 적용.
- **Agent (2층)**: 능동적 작업을 호출하는 과제 파일(`*.agent.md`). 분석/기획/테스트 등 특정 역할 수행.
- **2층 구조**: Instructions(정적 규칙) + Agents(능동 작업)으로 분리 운용하는 아키텍처.
- **CFG 파일**: `.github/copilot-instructions.md`, `code-style-guide.md`, `commit-message.style.md`.
- **AGENTS.md**: 프로젝트 루트에 배치하는 AI coding agent 운영 지침서.
- **템플릿 원본**: `templates/AHNLAB_TEMPLATE_*.md` ? CFG 생성 기준 파일.
- **마스터 소스**: `templates/awesome-copilot-main/` ? 에이전트/지침 파일의 최신 배포 원본.
- **플레이스홀더**: `[프로젝트명]`, `[팀명]`처럼 각괄호 표현식 치환 대상.

---

## A. 빠른 설정 (`/init-ahnlab` 사용)

### 사전 조건 확인

프로젝트에 다음 두 디렉토리가 존재해야 합니다:

```
.github/
├── prompts/
│   └── init-ahnlab.prompt.md    ← VS Code 프롬프트 파일 (필수)
└── templates/
    ├── AHNLAB_TEMPLATE_*.md     ← CFG 생성 기준 파일 (필수)
    └── awesome-copilot-main/
        ├── agents/              ← 20개 에이전트 마스터 소스 (필수)
        ├── instructions/        ← 12개 지침 마스터 소스 (필수)
        ├── skills/              ← 10개 skill 폴더
        └── plugins/             ← 9개 plugin 폴더
```

---

### 실행 방법

1. **VS Code**에서 프로젝트를 엽니다.
2. **Copilot Chat**을 엽니다 (`Ctrl+Alt+I`).
3. 입력창에 `/init-ahnlab` 을 입력하고 **Enter** 를 누릅니다.

Copilot이 자동으로:
- 에이전트 파일 20개를 `.github/agents/` 에 배포합니다.
- 지침 파일 12개를 `.github/instructions/` 에 배포합니다.
- 프로젝트 소스 코드를 분석하여 CFG 파일 3개를 생성합니다.
- 프로젝트 문서를 `.github/docs/` 에 자동 생성합니다 (최대 14개).
- 프로젝트 루트에 `AGENTS.md` 를 생성합니다.
- 설정 정합성을 검증하고 감사 보고서를 저장합니다.

---

## B. Instructions (1층) ? 정적 규칙

Instructions는 Copilot이 **자동으로 적용**하는 정적 규칙입니다.

| 파일명 | 경로 | 설명 |
|--------|------|------|
| agent-safety | `.github/instructions/agent-safety.instructions.md` | AI 에이전트 안전 경계 및 정책 적용 |
| agent-skills | `.github/instructions/agent-skills.instructions.md` | Agent Skills 작성 가이드라인 |
| agents | `.github/instructions/agents.instructions.md` | 커스텀 에이전트 파일 작성 가이드라인 |
| code-review-generic | `.github/instructions/code-review-generic.instructions.md` | 범용 코드 리뷰 기준 |
| context-engineering | `.github/instructions/context-engineering.instructions.md` | Copilot 효율 극대화를 위한 컨텍스트 관리 |
| instructions | `.github/instructions/instructions.instructions.md` | 커스텀 인스트럭션 파일 작성 가이드라인 |
| kubernetes-deployment-best-practices | `.github/instructions/kubernetes-deployment-best-practices.instructions.md` | Kubernetes 배포 베스트 프랙티스 |
| kubernetes-manifests | `.github/instructions/kubernetes-manifests.instructions.md` | Kubernetes YAML 매니페스트 작성 규칙 |
| markdown | `.github/instructions/markdown.instructions.md` | 마크다운 문서 작성 규칙 |
| security-and-owasp | `.github/instructions/security-and-owasp.instructions.md` | 보안 코딩 및 OWASP Top 10 가이드 |
| self-explanatory-code-commenting | `.github/instructions/self-explanatory-code-commenting.instructions.md` | 자기 설명적 코드 주석 가이드라인 |
| spec-driven-workflow-v1 | `.github/instructions/spec-driven-workflow-v1.instructions.md` | 스펙 기반 개발 워크플로우 |

---

## B-2. 자동 생성 문서 (Phase 3.5)

`/init-ahnlab` 실행 시 프로젝트 분석 결과를 기반으로 `.github/docs/` 에 문서가 자동 생성됩니다.

**Tier 1 — 핵심 (항상 생성)**

| 파일명 | 설명 |
|--------|------|
| `PROJECT_OVERVIEW.md` | 프로젝트 개요 (목적, 기술 스택, 주요 기능) |
| `ARCHITECTURE.md` | 아키텍처 개요 (계층 구조, Mermaid 다이어그램) |
| `DIRECTORY_STRUCTURE.md` | 소스 디렉토리 구조 및 모듈별 역할 |
| `CODING_GUIDELINES.md` | 통합 코딩 가이드라인 |
| `SECURITY_GUIDELINES.md` | 보안 가이드라인 (OWASP, 입력 검증) |

**Tier 2 — 권장 (조건부 생성)**

| 파일명 | 설명 |
|--------|------|
| `API_REFERENCE.md` | API/인터페이스 레퍼런스 |
| `BUILD_AND_DEPLOY.md` | 빌드/배포 절차 |
| `CONTRIBUTING.md` | 기여 가이드 (브랜치/커밋/리뷰 규칙) |
| `TROUBLESHOOTING.md` | 트러블슈팅 가이드 |
| `GLOSSARY.md` | 프로젝트 용어 사전 |

**Tier 3 — 선택 (대규모 프로젝트)**

| 파일명 | 설명 |
|--------|------|
| `DEPENDENCY_MAP.md` | 모듈 간 의존성 맵 (Mermaid) |
| `TECH_DEBT_REPORT.md` | 기술 부채 현황 |
| `RELEASE_NOTES_TEMPLATE.md` | 릴리즈 노트 템플릿 |
| `ONBOARDING.md` | 신규 개발자 온보딩 가이드 |

---

## B-3. Skills — 재사용 가능한 작업 단위

Skills는 에이전트가 호출하는 **재사용 가능한 작업 단위**입니다. `templates/awesome-copilot-main/skills/` 에 10개 폴더로 제공됩니다.

| 폴더명 | 설명 |
|--------|------|
| architecture-blueprint-generator | 코드베이스를 분석하여 기술 스택·아키텍처 패턴을 감지하고 상세 아키텍처 문서 및 다이어그램을 생성 |
| breakdown-plan | Epic > Feature > Story/Enabler > Test 계층 구조의 종합 프로젝트 계획 및 의존성/우선순위 자동 생성 |
| breakdown-test | 종합 테스트 전략, 작업 분해, 품질 검증 계획 생성 |
| create-architectural-decision-record | AI 최적화 방식의 ADR(아키텍처 결정 기록) 문서 생성 |
| create-github-pull-request-from-specification | 명세 파일 기반 GitHub Pull Request 생성 (pull_request_template.md 활용) |
| create-oo-component-documentation | 객체지향 컴포넌트에 대한 표준화된 문서 생성 |
| create-readme | 프로젝트 README.md 파일 생성 |
| git-commit | Conventional Commit 메시지 분석·스테이징·생성을 포함한 git commit 실행 |
| git-flow-branch-creator | git status/diff를 분석하여 nvie Git Flow 모델에 맞는 브랜치 생성 |
| review-and-refactor | 정의된 지침에 따라 프로젝트 코드 리뷰 및 리팩토링 수행 |

---

## B-4. Plugins — 멀티 에이전트 워크플로우 번들

Plugins는 관련 에이전트·지침을 묶은 **멀티 에이전트 워크플로우 번들**입니다. `templates/awesome-copilot-main/plugins/` 에 9개 폴더로 제공됩니다.

| 폴더명 | 설명 |
|--------|------|
| context-engineering | 컨텍스트 엔지니어링 워크플로우 플러그인 |
| edge-ai-tasks | microsoft/edge-ai 기반 AI 작업 플러그인 |
| gem-team | Gem Team 멀티 에이전트 오케스트레이션 플러그인 |
| project-planning | 프로젝트 계획 및 관리 플러그인 |
| security-best-practices | 보안 및 코드 품질 플러그인 |
| software-engineering-team | 소프트웨어 엔지니어링 팀 플러그인 |
| structured-autonomy | 구조화된 자율 작업 플러그인 |
| technical-spike | 기술 스파이크 플러그인 |
| testing-automation | 테스트 및 테스트 자동화 플러그인 |

---

## C. Agents (2층) ? 능동 작업

Agents는 사용자가 **선택하여 호출**하는 능동 과제입니다.

| 파일명 | 경로 | 설명 |
|--------|------|------|
| arch | `.github/agents/arch.agent.md` | 아키텍처 설계 패턴 및 NFR 분석, 다이어그램 생성 |
| context-architect | `.github/agents/context-architect.agent.md` | 멀티파일 변경 계획 및 의존성 식별 |
| devils-advocate | `.github/agents/devils-advocate.agent.md` | 아이디어의 결함/리스크/엣지케이스 비판적 검토 |
| devops-expert | `.github/agents/devops-expert.agent.md` | DevOps 인피니티 루프 기반 자동화/CI/CD 전문가 |
| gem-browser-tester | `.github/agents/gem-browser-tester.agent.md` | E2E 브라우저 자동화 테스트 및 UI/UX 검증 |
| gem-devops | `.github/agents/gem-devops.agent.md` | 컨테이너/CI·CD 파이프라인/인프라 배포 관리 |
| gem-documentation-writer | `.github/agents/gem-documentation-writer.agent.md` | 기술 문서 생성 및 코드-문서 동기화 |
| gem-implementer | `.github/agents/gem-implementer.agent.md` | TDD 기반 코드 구현 및 품질 보증 |
| gem-orchestrator | `.github/agents/gem-orchestrator.agent.md` | 멀티 에이전트 워크플로우 조율 (팀 리드) |
| gem-planner | `.github/agents/gem-planner.agent.md` | DAG 기반 계획 수립 및 프리모템 분석 |
| gem-researcher | `.github/agents/gem-researcher.agent.md` | 코드베이스 컨텍스트 수집 및 패턴 분석 |
| gem-reviewer | `.github/agents/gem-reviewer.agent.md` | 보안 게이트키퍼 (OWASP, 시크릿, 컴플라이언스) |
| janitor | `.github/agents/janitor.agent.md` | 기술 부채 제거/정리/간소화 |
| prd | `.github/agents/prd.agent.md` | 제품 요구사항 문서(PRD) 작성 |
| se-security-reviewer | `.github/agents/se-security-reviewer.agent.md` | OWASP Top 10/Zero Trust 기반 보안 코드 리뷰 |
| se-system-architecture-reviewer | `.github/agents/se-system-architecture-reviewer.agent.md` | Well-Architected 프레임워크 기반 아키텍처 리뷰 |
| specification | `.github/agents/specification.agent.md` | 기능 명세 문서 생성/업데이트 |
| task-planner | `.github/agents/task-planner.agent.md` | 실행 가능한 구현 계획 수립 |
| tech-debt-remediation-plan | `.github/agents/tech-debt-remediation-plan.agent.md` | 기술 부채 해소 계획 생성 |
| ultimate-beast-mode | `.github/agents/ultimate-beast-mode.agent.md` | 고급 투명 사고 기반 분석/디버깅 |

---

## D. 2층 구조 개요

**Instructions (1층)** → **자동 적용** → 모든 요청에서 기본 규칙 준수
**Agents (2층)** → **선택 호출** → 특정 작업 수행 역할

활용 예시:
- Copilot이 코드 작성할 때 → security-patterns, error-handling, markdown **자동 적용**
- 테스트 코드 생성 필요 → `@test-generator` 에이전트 **선택 호출**
- 핵심 설계 결정 → `@plan` 에이전트로 기획 **선택 호출**

---

## E. 검증 및 보고서

### 목적

`/init-ahnlab` 완료 후 `@implementation-auditor` 에이전트가 구현 정합성을 자동 검증합니다.

### 보고서 출력 위치

```
.github/templates/AUDIT_REPORT_YYYY-MM-DD.md
```

### 별도 검증 실행

Copilot Chat에서 `@implementation-auditor` 에이전트를 선택한 후 입력:

```
Run audit
```

### 판정별 후속 조치

| 판정 | 조건 | 후속 조치 |
|------|------|----------|
| **PASS** | 모든 체크리스트 통과 | Git 커밋으로 진행 |
| **CONDITIONAL** | 형식 경미 불일치 또는 선택 항목 누락 | 이슈 수정 후 `Run audit` 재실행 |
| **FAIL** | 필수 파일 누락, 플레이스홀더 미치환, 구조 위반 | 이슈 수정 후 `Run audit` 재실행 |

---

## F. 새 프로젝트에 배포하는 경우

새 프로젝트에 이 설정 패키지를 배포하려면:

1. 배포할 프로젝트에 `.github/` 폴더를 생성합니다.
2. 다음 두 폴더를 복사합니다:

   ```
   (배포 패키지)/
   ├── .github/templates/       → (대상 프로젝트)/.github/templates/
   └── .github/prompts/         → (대상 프로젝트)/.github/prompts/
   ```

3. 대상 프로젝트에서 VS Code를 열고 `/init-ahnlab` 을 실행합니다.

---

## G. 버전 정보

| 버전 | 날짜 | 주요 변경 |
|------|------|-----------|
| v2.0 | 2026-03-19 | `/init-ahnlab` 프롬프트 기반 자동 설정, templates/awesome-copilot-main/ 통합 구조 |
| v1.5 | 2026-03-18 | AHNLAB_TEMPLATE_ 접두사 통일, QUICKSTART.md 추가 |
| v1.4 | 2026-03-18 | AGT-10 implementation-auditor 추가, 검증 보고서 자동화 |
| v1.3 | 2026-03-16 | Agents 9개 + Instructions 5개 (2층 구조 완성) |
| v1.2 | 2026-03-13 | AGENTS.md 도입, Instructions 세분화 |
| v1.1 | 2026-02-27 | chatmodes → agents로 전환 |
| v1.0 | 2026-01-05 | 초기 릴리즈 |

---

## H. 참고 자료

- [CHANGELOG.md](./CHANGELOG.md) - 상세 버전 이력
- [QUICKSTART.md](./QUICKSTART.md) - 3단계 빠른 시작 가이드
- [init-ahnlab.prompt.md](../prompts/init-ahnlab.prompt.md) - 자동 설정 프롬프트 원본
- [awesome-copilot-main/agents/](./awesome-copilot-main/agents/) - 에이전트 마스터 소스 (20개)
- [awesome-copilot-main/instructions/](./awesome-copilot-main/instructions/) - 지침 마스터 소스 (12개)
- [awesome-copilot-main/skills/](./awesome-copilot-main/skills/) - Skills 마스터 소스 (10개)
- [awesome-copilot-main/plugins/](./awesome-copilot-main/plugins/) - Plugins 마스터 소스 (9개)
- [docs/](../docs/) - 자동 생성 프로젝트 문서 (최대 14개)

---

**마지막 업데이트**: 2026-03-19
**버전**: v2.0-beta
**상태**: 완성
