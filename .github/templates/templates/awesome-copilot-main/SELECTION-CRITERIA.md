# templates/awesome-copilot-main 선별 기준 및 판정 보고서

> 작성일: 2026-03-23
> 대상: 87개 → **50개** 축소 (37개 제거)

---

## 1. 분류 기준

5가지 기준으로 각 항목을 판정했습니다.

| 기준 | 설명 | 판정 |
|------|------|------|
| **필수** | 개발 워크플로우에서 대체 불가능한 핵심 기능 | 유지 |
| **중복** | 동일 기능의 상위 호환이 이미 존재 | 삭제 |
| **교육** | 학습 보조·온보딩·튜토리얼 용도. 개발 워크플로우 비필수 | 삭제 |
| **특수** | AI 에이전트 운영, AI/ML 전용 등 범용성 낮음 | 삭제 |
| **보조** | 없어도 개발 가능한 부가 기능 (메타 도구, 워크플로우 선택기 등) | 삭제 |

---

## 2. 핵심 축소 결정

### 2.1 오케스트레이션 단일화: GEM만 유지, RUG 삭제

| 항목 | GEM Suite (유지) | RUG Workflow (삭제) |
|------|-----------------|-------------------|
| 에이전트 수 | 8개 | 3개 |
| 파이프라인 | Research→Plan→Implement→Review→DevOps→Doc→Test | SWE→QA |
| DAG 기반 | O | X |
| 문서 자동 작성 | O | X |
| E2E 브라우저 테스트 | O | X |

**결론:** GEM이 RUG의 SWE→QA 기능을 완전히 포함하며, 리서치·문서·DevOps까지 추가 커버.

### 2.2 계획 에이전트 통합: task-planner만 유지

| 에이전트 | 줄 수 | 구조화 수준 | 판정 |
|----------|-------|------------|------|
| `planner` | 18줄 | 4섹션 Markdown | 삭제 — 너무 경량 |
| `plan` | 136줄 | 대화형 문서 | 삭제 — 구조화 미흡 |
| `task-planner` | 405줄 | `.copilot-tracking/` 파일 세트 + 리서치 검증 | **유지** |
| `implementation-plan` | — | YAML/Markdown 템플릿 (AI용) | 삭제 — task-planner 출력 변환 가능 |

### 2.3 리팩토링 스킬 통합: review-and-refactor만 유지

| 스킬 | 범위 | 판정 |
|------|------|------|
| `review-and-refactor` | 코드 리뷰 + 리팩토링 통합 | **유지** — 가장 포괄적 |
| `refactor` | 리팩토링만 (리뷰 없음) | 삭제 — 부분 기능 |
| `refactor-method-complexity-reduce` | 메서드 복잡도만 | 삭제 — 부분 기능 |

### 2.4 Git 스킬 정리: git-commit + git-flow-branch-creator만 유지

| 스킬 | 기능 | 판정 |
|------|------|------|
| `git-commit` | 스테이징 + Conventional Commits 메시지 + 커밋 실행 | **유지** |
| `git-flow-branch-creator` | feature/bugfix/release 브랜치 자동 생성 | **유지** |
| `conventional-commit` | 메시지 생성만 (커밋 미실행) | 삭제 — git-commit에 포함 |

---

## 3. 전체 판정표

### 3.1 Agents (40개 → 20개)

| # | 에이전트 | 판정 | 분류 | 사유 |
|---|----------|------|------|------|
| 1 | `4.1-Beast` | **유지** | 필수 | 자율 코딩 — 대체 불가 |
| 2 | `Principal-software-engineer` | 삭제 | 중복 | arch + devils-advocate가 조언 기능 대체 |
| 3 | `adr-generator` | 삭제 | 중복 | 스킬 create-architectural-decision-record가 동일 기능 |
| 4 | `agent-governance-reviewer` | 삭제 | 특수 | AI 에이전트 운영 전용. 일반 개발 불필요 |
| 5 | `api-architect` | 삭제 | 중복 | arch + specification이 API 설계 포괄 |
| 6 | `arch` | **유지** | 필수 | 시스템 아키텍처 설계 — 핵심 |
| 7 | `blueprint-mode` | 삭제 | 보조 | 워크플로우 선택기. 직접 에이전트 호출이 더 실용적 |
| 8 | `code-tour` | 삭제 | 교육 | CodeTour 생성은 온보딩용. 개발 비필수 |
| 9 | `context-architect` | **유지** | 필수 | 의존성·영향 분석 — 대규모 변경의 전제 |
| 10 | `critical-thinking` | 삭제 | 중복 | devils-advocate가 비판적 평가 + 대안까지 포괄 |
| 11 | `custom-agent-foundry` | 삭제 | 특수 | 커스텀 에이전트 생성. 파워유저 전용 |
| 12 | `devils-advocate` | **유지** | 필수 | 설계 결정의 품질 게이트 — 리스크 식별 |
| 13 | `devops-expert` | **유지** | 필수 | DevOps 전체 커버 (CI/CD, 배포, 모니터링) |
| 14 | `gem-browser-tester` | **유지** | 필수 | GEM Suite 구성원 (세트 필수) |
| 15 | `gem-devops` | **유지** | 필수 | 〃 |
| 16 | `gem-documentation-writer` | **유지** | 필수 | 〃 |
| 17 | `gem-implementer` | **유지** | 필수 | 〃 |
| 18 | `gem-orchestrator` | **유지** | 필수 | 〃 (메인 조율자) |
| 19 | `gem-planner` | **유지** | 필수 | 〃 |
| 20 | `gem-researcher` | **유지** | 필수 | 〃 |
| 21 | `gem-reviewer` | **유지** | 필수 | 〃 |
| 22 | `implementation-plan` | 삭제 | 중복 | task-planner가 더 체계적·완전 |
| 23 | `janitor` | **유지** | 필수 | 코드 정리·단순화 — 유지보수 핵심 |
| 24 | `mentoring-juniors` | 삭제 | 교육 | 멘토링 보조. 핵심 워크플로우 아님 |
| 25 | `meta-agentic-project-scaffold` | 삭제 | 특수 | 멀티에이전트 프로젝트 전용. 범용성 낮음 |
| 26 | `plan` | 삭제 | 중복 | task-planner에 통합 |
| 27 | `planner` | 삭제 | 중복 | 〃 |
| 28 | `prd` | **유지** | 필수 | PRD 생성 — 요구사항 정의 핵심 |
| 29 | `qa-subagent` | 삭제 | 중복 | RUG 세트 → GEM Suite가 상위 호환 |
| 30 | `repo-architect` | 삭제 | 중복 | arch가 시스템+프로젝트 구조 포괄 |
| 31 | `rug-orchestrator` | 삭제 | 중복 | RUG → GEM Suite가 상위 호환 |
| 32 | `se-gitops-ci-specialist` | 삭제 | 중복 | devops-expert가 GitOps/CI/CD 포괄 |
| 33 | `se-responsible-ai-code` | 삭제 | 특수 | AI/ML 전용. 범용 개발 불필요 |
| 34 | `se-security-reviewer` | **유지** | 필수 | 보안 리뷰 — 필수 품질 게이트 |
| 35 | `se-system-architecture-reviewer` | **유지** | 필수 | 아키텍처 리뷰 — 필수 품질 게이트 |
| 36 | `specification` | **유지** | 필수 | 기술 사양서 — 설계 핵심 |
| 37 | `swe-subagent` | 삭제 | 중복 | RUG 세트 → GEM Suite가 상위 호환 |
| 38 | `task-planner` | **유지** | 필수 | 태스크 계획 — 가장 체계적 (405줄) |
| 39 | `task-researcher` | 삭제 | 중복 | gem-researcher가 리서치 포괄 |
| 40 | `tech-debt-remediation-plan` | **유지** | 필수 | 기술 부채 전략 — 장기 유지보수 핵심 |

### 3.2 Instructions (16개 → 11개)

| # | 인스트럭션 | 판정 | 분류 | 사유 |
|---|-----------|------|------|------|
| 1 | `agent-safety` | **유지** | 필수 | 에이전트 거버넌스 기초 |
| 2 | `agent-skills` | **유지** | 필수 | 스킬 생성 가이드 |
| 3 | `agents` | **유지** | 필수 | 에이전트 파일 작성 규칙 |
| 4 | `ai-prompt-engineering-safety-best-practices` | 삭제 | 중복 | agent-safety와 70% 중복 |
| 5 | `code-review-generic` | **유지** | 필수 | 범용 코드 리뷰 — 모든 프로젝트 적용 |
| 6 | `containerization-docker-best-practices` | 삭제 | 보조 | Docker 특정 도구 종속. devops-expert가 커버 |
| 7 | `context-engineering` | **유지** | 필수 | AI 보조 작업의 전제 조건 |
| 8 | `devops-core-principles` | 삭제 | 보조 | 추상적 원칙론. devops-expert 에이전트가 실행 수준 대체 |
| 9 | `instructions` | **유지** | 필수 | 메타 가이드 (인스트럭션+프롬프트 작성) |
| 10 | `kubernetes-deployment-best-practices` | **유지** | 필수 | K8s 배포 — 배포 단계 핵심 |
| 11 | `kubernetes-manifests` | **유지** | 필수 | K8s 매니페스트 — 위와 세트 |
| 12 | `object-calisthenics` | 삭제 | 보조 | OOP 규칙 참조. 보조 자료 |
| 13 | `performance-optimization` | 삭제 | 보조 | 범용적이나 실행력 낮음. 코드 리뷰에서 자연 커버 |
| 14 | `security-and-owasp` | **유지** | 필수 | OWASP 보안 — 보안 리뷰 기준 |
| 15 | `self-explanatory-code-commenting` | **유지** | 필수 | 코드 품질 — 네이밍·주석 기준 |
| 16 | `spec-driven-workflow-v1` | **유지** | 필수 | 사양 주도 개발 프로세스 |

### 3.3 Plugins (12개 → 9개)

| # | 플러그인 | 판정 | 분류 | 사유 |
|---|---------|------|------|------|
| 1 | `awesome-copilot` | 삭제 | 보조 | 메타 발견 도구. GUIDE.md가 동일 역할 |
| 2 | `context-engineering` | **유지** | 필수 | 컨텍스트 관리 스킬 (context-map 등) |
| 3 | `edge-ai-tasks` | **유지** | 필수 | 대규모 코드베이스 태스크 리서치 |
| 4 | `gem-team` | **유지** | 필수 | GEM Suite 플러그인 패키지 |
| 5 | `noob-mode` | 삭제 | 보조 | 접근성 보조. 핵심 개발 아님 |
| 6 | `project-planning` | **유지** | 필수 | 에픽/피처 분해 파이프라인 |
| 7 | `rug-agentic-workflow` | 삭제 | 중복 | GEM Suite가 상위 호환 |
| 8 | `security-best-practices` | **유지** | 필수 | AI 프롬프트 안전성 리뷰 |
| 9 | `software-engineering-team` | **유지** | 필수 | 7개 전문 리뷰어 |
| 10 | `structured-autonomy` | **유지** | 필수 | 설계→생성→구현 워크플로우 |
| 11 | `technical-spike` | **유지** | 필수 | 기술 검증 리서치 |
| 12 | `testing-automation` | **유지** | 필수 | TDD + Playwright 자동화 |

### 3.4 Skills (19개 → 10개)

| # | 스킬 | 판정 | 분류 | 사유 |
|---|------|------|------|------|
| 1 | `add-educational-comments` | 삭제 | 교육 | 학습 보조. 핵심 개발 아님 |
| 2 | `agent-governance` | 삭제 | 특수 | AI 에이전트 거버넌스. 일반 개발 불필요 |
| 3 | `agentic-eval` | 삭제 | 특수 | AI 에이전트 평가 루프. 일반 개발 불필요 |
| 4 | `architecture-blueprint-generator` | **유지** | 필수 | 아키텍처 분석·문서화 |
| 5 | `breakdown-plan` | **유지** | 필수 | 프로젝트 계획 계층 분해 |
| 6 | `breakdown-test` | **유지** | 필수 | 테스트 계획 (ISTQB/ISO) |
| 7 | `code-exemplars-blueprint-generator` | 삭제 | 교육 | 모범 사례 문서화. 보조적 |
| 8 | `comment-code-generate-a-tutorial` | 삭제 | 교육 | 튜토리얼 생성. 보조적 |
| 9 | `conventional-commit` | 삭제 | 중복 | git-commit이 Conventional Commits 포함 |
| 10 | `create-architectural-decision-record` | **유지** | 필수 | ADR 문서 생성 |
| 11 | `create-github-pull-request-from-specification` | **유지** | 필수 | 사양→PR 자동 생성 |
| 12 | `create-oo-component-documentation` | **유지** | 필수 | OO 컴포넌트 문서화 |
| 13 | `create-readme` | **유지** | 필수 | README 생성 |
| 14 | `git-commit` | **유지** | 필수 | Conventional Commits 기반 커밋 |
| 15 | `git-flow-branch-creator` | **유지** | 필수 | Git Flow 브랜치 생성 |
| 16 | `refactor` | 삭제 | 중복 | review-and-refactor가 통합 커버 |
| 17 | `refactor-method-complexity-reduce` | 삭제 | 중복 | 〃 |
| 18 | `review-and-refactor` | **유지** | 필수 | 코드 리뷰 + 리팩토링 통합 |
| 19 | `technology-stack-blueprint-generator` | 삭제 | 보조 | architecture-blueprint가 구조 분석 커버 |

---

## 4. 최종 50개 목록

### Agents (20개)

```
agents/
├── ultimate-beast-mode.agent.md          # 자율 코딩 에이전트
├── arch.agent.md                         # 시스템 아키텍처
├── context-architect.agent.md            # 컨텍스트·의존성 맵
├── devils-advocate.agent.md              # 비판적 평가
├── devops-expert.agent.md                # DevOps 전문가
├── gem-browser-tester.agent.md           # [GEM] 브라우저 테스트
├── gem-devops.agent.md                   # [GEM] DevOps
├── gem-documentation-writer.agent.md     # [GEM] 문서 작성
├── gem-implementer.agent.md              # [GEM] 구현
├── gem-orchestrator.agent.md             # [GEM] 오케스트레이터
├── gem-planner.agent.md                  # [GEM] 계획
├── gem-researcher.agent.md              # [GEM] 리서치
├── gem-reviewer.agent.md                 # [GEM] 코드 리뷰
├── janitor.agent.md                      # 코드 정리
├── prd.agent.md                          # PRD 생성
├── se-security-reviewer.agent.md         # 보안 리뷰
├── se-system-architecture-reviewer.agent.md # 아키텍처 리뷰
├── specification.agent.md                # 기술 사양서
├── task-planner.agent.md                 # 태스크 계획
└── tech-debt-remediation-plan.agent.md   # 기술 부채 전략
```

### Instructions (11개)

```
instructions/
├── agent-safety.instructions.md                          # 에이전트 거버넌스
├── agent-skills.instructions.md                          # 스킬 생성 가이드
├── agents.instructions.md                                # 에이전트 파일 규칙
├── code-review-generic.instructions.md                   # 범용 코드 리뷰
├── context-engineering.instructions.md                   # 컨텍스트 관리
├── instructions.instructions.md                          # 인스트럭션+프롬프트 작성
├── kubernetes-deployment-best-practices.instructions.md  # K8s 배포
├── kubernetes-manifests.instructions.md                  # K8s 매니페스트
├── security-and-owasp.instructions.md                    # OWASP 보안
├── self-explanatory-code-commenting.instructions.md      # 코드 주석
└── spec-driven-workflow-v1.instructions.md               # 사양 주도 워크플로우
```

### Plugins (9개)

```
plugins/
├── context-engineering/       # 컨텍스트 관리 스킬
├── edge-ai-tasks/             # 대규모 코드베이스 태스크 리서치
├── gem-team/                  # 8-에이전트 오케스트레이션
├── project-planning/          # 프로젝트 계획 파이프라인
├── security-best-practices/   # 보안 리뷰 스킬
├── software-engineering-team/ # SE 7개 전문가 팀
├── structured-autonomy/       # 설계→생성→구현 워크플로우
├── technical-spike/           # 기술 스파이크
└── testing-automation/        # TDD + Playwright + 테스트 자동화
```

### Skills — 독립 (10개)

```
skills/
├── architecture-blueprint-generator/                # 아키텍처 청사진 생성
├── breakdown-plan/                                  # 프로젝트 계획 계층 분해
├── breakdown-test/                                  # 테스트 계획 (ISTQB/ISO)
├── create-architectural-decision-record/            # ADR 문서 생성
├── create-github-pull-request-from-specification/   # 사양 기반 PR 생성
├── create-oo-component-documentation/               # OO 컴포넌트 문서화
├── create-readme/                                   # README 생성
├── git-commit/                                      # Conventional Commits 커밋
├── git-flow-branch-creator/                         # Git Flow 브랜치 생성
└── review-and-refactor/                             # 코드 리뷰 + 리팩토링
```

---

## 5. 삭제 통계

| 삭제 분류 | 건수 | 비율 |
|-----------|------|------|
| 중복 (상위 호환 존재) | 18 | 49% |
| 교육/학습 보조 | 7 | 19% |
| 특수 (범용성 부족) | 6 | 16% |
| 보조 (부가 기능) | 6 | 16% |
| **합계** | **37** | **100%** |
