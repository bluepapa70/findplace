# 개발 워크플로우 가이드 — templates/awesome-copilot-main

> 이 폴더에는 언어/플랫폼에 종속되지 않는 **필수** 에이전트·인스트럭션·플러그인·스킬 50개가 개발 순서에 맞춰 정리되어 있습니다.

---

## 목차

1. [Phase 1 — 프로젝트 초기화·컨텍스트 이해](#phase-1--프로젝트-초기화컨텍스트-이해)
2. [Phase 2 — 요구사항 정의·설계](#phase-2--요구사항-정의설계)
3. [Phase 3 — 구현·코딩](#phase-3--구현코딩)
4. [Phase 4 — 테스트·품질 보증](#phase-4--테스트품질-보증)
5. [Phase 5 — 배포·운영](#phase-5--배포운영)
6. [Phase 6 — 유지보수·기술 부채 관리](#phase-6--유지보수기술-부채-관리)
7. [오케스트레이션 (전 단계 통합)](#orchestration--오케스트레이션-전-단계-통합)
8. [자율 해결 (전 단계 보조)](#autonomous--자율-해결)
9. [파일 매핑 요약](#파일-매핑-요약)

---

## Phase 1 — 프로젝트 초기화·컨텍스트 이해

> **목표:** 코드베이스를 이해하고, 아키텍처를 파악하고, 작업 범위를 결정한다.

### Agents

| 파일 | 역할 | 사용 시점 | 사용법 |
|------|------|-----------|--------|
| `arch.agent.md` | 시스템 아키텍처 전반 설계·분석 | 시스템 레벨 아키텍처 결정이 필요할 때 | `@arch` 호출 → 아키텍처 패턴·트레이드오프 분석 |
| `context-architect.agent.md` | 멀티파일 변경 시 컨텍스트·의존성 맵 생성 | 기존 프로젝트 투입 또는 대규모 변경 전 | `@context-architect` 호출 → 변경 대상 파일 지정 → 영향 범위 맵 반환 |

### Instructions

| 파일 | 역할 | 적용 시점 |
|------|------|-----------|
| `context-engineering.instructions.md` | LLM 컨텍스트 윈도우 최적 관리 방법 | 모든 AI 보조 작업의 전제 조건 |
| `instructions.instructions.md` | 인스트럭션 + 프롬프트 파일 작성 통합 가이드 | 새 인스트럭션·프롬프트 추가·수정 시 |
| `agents.instructions.md` | 커스텀 에이전트 파일 작성 규칙 | 새 에이전트를 만들 때 |
| `agent-skills.instructions.md` | 스킬 생성·번들링·프로그레시브 로딩 가이드 | 스킬 팩을 만들 때 |
| `agent-safety.instructions.md` | AI 에이전트 거버넌스·도구 접근 제어·감사 추적 | 에이전트 운영 환경 도입 전 반드시 적용 |

### Plugins

| 폴더 | 역할 | 사용법 |
|------|------|--------|
| `plugins/context-engineering/` | context-map, refactor-plan, what-context-needed 스킬 | `/context-map`, `/refactor-plan`, `/what-context-needed` |

---

## Phase 2 — 요구사항 정의·설계

> **목표:** PRD 작성, 기술 사양서 정의, 구현 계획 수립, 불확실한 기술은 스파이크로 검증한다.

### Agents

| 파일 | 역할 | 사용 시점 | 사용법 |
|------|------|-----------|--------|
| `prd.agent.md` | 제품 요구사항 문서(PRD) 자동 생성 | 새 기능·프로젝트 킥오프 시 | `@prd` 호출 → 기능 요약 → PRD 초안 |
| `specification.agent.md` | 기술 사양서 작성 | PRD 확정 후 기술 세부사항 정의 시 | `@specification` 호출 → PRD 기반 기술 사양 생성 |
| `task-planner.agent.md` | 리서치 기반 태스크 레벨 계획 (구조화된 추적 포함) | 태스크 분해·실행 계획 필요 시 | `@task-planner` 호출 → 세부 태스크 분해 + 추적 파일 생성 |

### Instructions

| 파일 | 역할 | 적용 시점 |
|------|------|-----------|
| `spec-driven-workflow-v1.instructions.md` | 사양 주도 개발 워크플로우 | 사양서→구현→검증 프로세스 체계화 시 |

### Plugins

| 폴더 | 역할 | 사용법 |
|------|------|--------|
| `plugins/project-planning/` | 에픽/피처 분해 → 구현계획 → GitHub 이슈 파이프라인 | `/breakdown-epic-arch`, `/create-implementation-plan`, `/create-github-issues-feature-from-implementation-plan` |
| `plugins/edge-ai-tasks/` | 대규모 코드베이스 대상 Task Research/Planning | `@task-researcher`, `@task-planner` (project-planning과 연동) |
| `plugins/technical-spike/` | 불확실한 기술 결정 전 리서치 체계화 | `/create-technical-spike` → 기술 검증 보고서 |
| `plugins/structured-autonomy/` | 설계→생성→구현 3단계 명시적 분리 워크플로우 | `/structured-autonomy-plan` → `/structured-autonomy-generate` → `/structured-autonomy-implement` |

### Skills (독립)

| 폴더 | 역할 | 사용법 |
|------|------|--------|
| `skills/breakdown-plan/` | 프로젝트 계획 — Epic>Feature>Story 계층 + GitHub 이슈 생성 | `/breakdown-plan` 호출 → 프로젝트 범위 → 계층적 계획 |
| `skills/breakdown-test/` | 테스트 계획 — ISTQB/ISO 25010 기반 품질 보증 문서 | `/breakdown-test` 호출 → 대상 기능 → 테스트 전략·케이스 |
| `skills/architecture-blueprint-generator/` | 코드베이스 분석 → 아키텍처 청사진 문서화 | `/architecture-blueprint-generator` 호출 → 패턴·구조 분석 |
| `skills/create-architectural-decision-record/` | ADR 문서 생성 (AI 최적화 형식) | `/create-architectural-decision-record` 호출 → ADR 파일 생성 |

---

## Phase 3 — 구현·코딩

> **목표:** 계획에 따라 코드를 작성하고, 버전 관리를 체계적으로 수행한다.

### Agents

| 파일 | 역할 | 사용 시점 | 사용법 |
|------|------|-----------|--------|
| `4.1-Beast.agent.md` | 자율 코딩 에이전트 — 리서치, 투두 추적, 디버깅까지 완전 자율 | 복잡한 기술 문제를 자율적으로 해결할 때 | `@4.1-Beast` 호출 → Fetch→Research→Plan→Implement→Debug→Test 자율 실행 |

### Instructions

| 파일 | 역할 | 적용 시점 |
|------|------|-----------|
| `self-explanatory-code-commenting.instructions.md` | 자기 설명적 코드·주석 모범 사례 | 코드 작성 중 주석·네이밍 기준 |

### Skills (독립)

| 폴더 | 역할 | 사용법 |
|------|------|--------|
| `skills/create-github-pull-request-from-specification/` | 사양 기반 GitHub PR 자동 생성 | `/create-github-pull-request-from-specification` 호출 → PR 초안 |
| `skills/review-and-refactor/` | 코드 리뷰 + 리팩토링 통합 수행 | `/review-and-refactor` 호출 → 대상 파일 → 리뷰·개선 |
| `skills/git-commit/` | Conventional Commits 기반 자동 커밋 | `/git-commit` 호출 → 변경 분석 → 규격화된 커밋 |
| `skills/git-flow-branch-creator/` | Git Flow 브랜치 자동 생성 (feature/bugfix/release) | `/git-flow-branch-creator` 호출 → 브랜치 타입 결정·생성 |

---

## Phase 4 — 테스트·품질 보증

> **목표:** 코드 리뷰, 보안 점검, 아키텍처 검증, 테스트 자동화를 수행한다.

### Agents

| 파일 | 역할 | 사용 시점 | 사용법 |
|------|------|-----------|--------|
| `se-security-reviewer.agent.md` | OWASP 기반 보안 코드 리뷰 | PR 제출 전 또는 보안 민감 코드 작성 후 | `@se-security-reviewer` 호출 → 취약점 + 수정 제안 |
| `se-system-architecture-reviewer.agent.md` | 시스템 아키텍처 리뷰 | 주요 설계 변경 후 품질 게이트 | `@se-system-architecture-reviewer` 호출 → 아키텍처 적합성 판정 |
| `devils-advocate.agent.md` | 비판적 평가 — 결함·엣지케이스·리스크 식별 | 설계 결정 확정 전 반대 의견 확인 | `@devils-advocate` 호출 → 위험·대안 제시 |

### Instructions

| 파일 | 역할 | 적용 시점 |
|------|------|-----------|
| `code-review-generic.instructions.md` | 범용 코드 리뷰 가이드라인 (언어 비종속) | 모든 코드 리뷰 시 |
| `security-and-owasp.instructions.md` | OWASP 기반 보안 모범 사례 | 보안 리뷰 시 참조 기준 |

### Plugins

| 폴더 | 역할 | 사용법 |
|------|------|--------|
| `plugins/security-best-practices/` | AI 프롬프트 안전성 리뷰 스킬 | `/ai-prompt-engineering-safety-review` |
| `plugins/testing-automation/` | TDD Red/Green/Refactor + Playwright 테스팅 | `@tdd-red` → `@tdd-green` → `@tdd-refactor`. `/playwright-explore-website`, `/playwright-generate-test` |
| `plugins/software-engineering-team/` | 보안·아키텍처·GitOps·PM 등 7개 전문 리뷰어 | `@se-security-reviewer`, `@se-system-architecture-reviewer` 등 개별 활용 |

---

## Phase 5 — 배포·운영

> **목표:** CI/CD 파이프라인 구성, 쿠버네티스 배포, 운영 자동화.

### Agents

| 파일 | 역할 | 사용 시점 | 사용법 |
|------|------|-----------|--------|
| `devops-expert.agent.md` | DevOps 전체 커버 (Plan→Code→Build→Test→Release→Deploy→Operate→Monitor) | CI/CD 파이프라인 설계·구현 시 | `@devops-expert` 호출 → 배포 전략·파이프라인 설계 |

### Instructions

| 파일 | 역할 | 적용 시점 |
|------|------|-----------|
| `kubernetes-deployment-best-practices.instructions.md` | K8s 배포 모범 사례 | 쿠버네티스 배포 구성 시 |
| `kubernetes-manifests.instructions.md` | K8s 매니페스트 작성 가이드 | YAML 매니페스트 작성 시 (위 파일과 함께 사용) |

---

## Phase 6 — 유지보수·기술 부채 관리

> **목표:** 기술 부채 식별·제거, 코드 정리, 문서화.

### Agents

| 파일 | 역할 | 사용 시점 | 사용법 |
|------|------|-----------|--------|
| `janitor.agent.md` | 기술 부채 제거, 코드 정리, 단순화 (언어 비종속) | 정기 코드 클린업, 리팩터링 스프린트 | `@janitor` 호출 → 대상 영역 → 불필요한 코드·복잡성 제거 |
| `tech-debt-remediation-plan.agent.md` | 기술 부채 전략적 관리 계획 수립 | 부채가 누적되어 전략적 접근이 필요할 때 | `@tech-debt-remediation-plan` 호출 → 우선순위별 부채 해소 로드맵 |

### Skills (독립)

| 폴더 | 역할 | 사용법 |
|------|------|--------|
| `skills/create-readme/` | 프로젝트 README 자동 생성 | `/create-readme` 호출 → 프로젝트 분석 → README.md 생성 |
| `skills/create-oo-component-documentation/` | OO 컴포넌트 문서화 (C4 Model + Arc42) | `/create-oo-component-documentation` 호출 → 상세 문서 |

---

## Orchestration — 오케스트레이션 (전 단계 통합)

> **목표:** 복잡한 프로젝트를 여러 에이전트가 협업하여 자동으로 완수한다.

### GEM Suite (8개 세트 — 반드시 전체 함께 사용)

| 파일 | 역할 |
|------|------|
| `gem-orchestrator.agent.md` | **메인 조율자.** DAG 기반으로 아래 7개 에이전트를 자동 배치·실행 |
| `gem-researcher.agent.md` | 요구사항·코드베이스·문서 조사 |
| `gem-planner.agent.md` | 리서치 결과를 실행 계획으로 변환 |
| `gem-implementer.agent.md` | 계획에 따라 코드 구현 |
| `gem-reviewer.agent.md` | 구현 결과 코드 리뷰 |
| `gem-devops.agent.md` | CI/CD·인프라 구성 |
| `gem-documentation-writer.agent.md` | 문서 자동 작성 |
| `gem-browser-tester.agent.md` | 브라우저 기반 E2E 테스트 |

**사용법:** `@gem-orchestrator` 호출 → 목표 전달 → Researcher→Planner→Implementer→Reviewer→DevOps→Documentation 순 자동 실행

### Plugin

| 폴더 | 역할 | 사용법 |
|------|------|--------|
| `plugins/gem-team/` | GEM Suite 플러그인 패키지 | 위 GEM Suite와 동일 |

---

## 파일 매핑 요약

### Agents — 20개

| 단계 | 에이전트 파일 |
|------|-------------|
| Phase 1 초기화 | arch, context-architect |
| Phase 2 설계 | prd, specification, task-planner |
| Phase 3 구현 | 4.1-Beast |
| Phase 4 품질 | se-security-reviewer, se-system-architecture-reviewer, devils-advocate |
| Phase 5 배포 | devops-expert |
| Phase 6 유지보수 | janitor, tech-debt-remediation-plan |
| 오케스트레이션 | gem-orchestrator, gem-researcher, gem-planner, gem-implementer, gem-reviewer, gem-devops, gem-documentation-writer, gem-browser-tester |

### Instructions — 11개

| 단계 | 인스트럭션 파일 |
|------|---------------|
| Phase 1 초기화 | context-engineering, instructions, agents, agent-skills, agent-safety |
| Phase 2 설계 | spec-driven-workflow-v1 |
| Phase 3 구현 | self-explanatory-code-commenting |
| Phase 4 품질 | code-review-generic, security-and-owasp |
| Phase 5 배포 | kubernetes-deployment-best-practices, kubernetes-manifests |

### Plugins — 9개

| 단계 | 플러그인 폴더 |
|------|-------------|
| Phase 1 초기화 | context-engineering |
| Phase 2 설계 | project-planning, edge-ai-tasks, technical-spike, structured-autonomy |
| Phase 4 품질 | security-best-practices, testing-automation, software-engineering-team |
| 오케스트레이션 | gem-team |

### Skills (독립) — 10개

| 단계 | 스킬 폴더 |
|------|----------|
| Phase 2 설계 | breakdown-plan, breakdown-test, architecture-blueprint-generator, create-architectural-decision-record |
| Phase 3 구현 | create-github-pull-request-from-specification, review-and-refactor, git-commit, git-flow-branch-creator |
| Phase 6 문서 | create-readme, create-oo-component-documentation |

---

## 복사 시 필수 세트 (분리 불가)

| 세트 | 파일 목록 | 이유 |
|------|----------|------|
| **GEM Suite** | gem-orchestrator + 7개 | Orchestrator가 runSubagent로 나머지 7개를 호출 |
| **프로젝트 계획 세트** (plugins) | project-planning + edge-ai-tasks + technical-spike | task-planner/researcher 참조 + technical-spike 에이전트 공유 |
| **K8s 세트** (instructions) | kubernetes-deployment-best-practices + kubernetes-manifests | 배포 전략과 매니페스트 가이드가 상호 참조 |
| **에이전트 기초 세트** (instructions) | agent-safety + agents + agent-skills | 에이전트 생성·운영의 전제 조건 3종 |

---

> **최종 구성:** 에이전트 20 + 인스트럭션 11 + 플러그인 9 + 독립 스킬 10 = **총 50개**
> 축소 기준 및 삭제 사유는 `SELECTION-CRITERIA.md` 참조.
