# templates/awesome-copilot-main 중복 정리 보고서

> 정리 일자: 2026-03-23
> 1차 정리: Agents 44 / Instructions 17 / Plugins 13 → 중복 6개 제거 + Skills 19개 추가 = **87개**
> 2차 축소: 87개 → **50개** (필수 항목만 선별, 37개 추가 제거)
> 최종: Agents 20 / Instructions 11 / Plugins 9 / Skills 10 = **50개**

---

## 1. 삭제된 파일 및 근거

### 1.1 Agents — 4개 삭제

#### (1) Thinking-Beast-Mode.agent.md / Ultimate-Transparent-Thinking-Beast-Mode.agent.md

| 항목 | 4.1-Beast (유지) | Thinking-Beast-Mode (삭제) | Ultimate (삭제) |
|------|-----------------|---------------------------|-----------------|
| 핵심 기능 | Fetch→Research→Plan→Implement→Debug→Test 자율 루프 | 동일 | 동일 |
| 투두 추적 | Emoji 기반 진행 상태 관리 | 동일 | 동일 |
| 인터넷 리서치 | fetch_webpage 도구 활용 | 동일 | 동일 |
| 차이점 | 실용적·직관적 워크플로우 명세 (v3.1) | "양자 인지 아키텍처", "헌법적 분석" 등 수사적 표현 추가 | "비상 프로토콜", "인지 오버클럭" 등 더 극단적 표현 |
| 줄 수 | 168줄 | 174줄 | 192줄 |

**결론:** 세 에이전트의 실행 로직(URL 수집→리서치→계획→구현→디버그→테스트)은 동일. Thinking/Ultimate은 동일 기능에 철학적·수사적 표현만 추가한 것으로, 실질적 기능 차이 없음. 4.1-Beast가 가장 실용적이고 유지보수 용이.

---

#### (2) blueprint-mode-codex.agent.md

| 항목 | blueprint-mode (유지) | blueprint-mode-codex (삭제) |
|------|----------------------|---------------------------|
| 버전 | v39 | v1 |
| 모델 | GPT-5 | GPT-5-Codex (Preview) |
| 워크플로우 | Loop/Debug/Express/Main 4종 | 동일 |
| Self-Reflection | 6개 카테고리 1-10 척도 평가 + 3회 반복 검증 | **미포함 (제거됨)** |
| 줄 수 | 173줄 | 112줄 |

**결론:** Codex 버전은 blueprint-mode의 축소판으로, Self-Reflection(품질 게이팅)이 제거되어 기능이 열위. blueprint-mode v39가 완전 상위 호환.

---

#### (3) mentor.agent.md

| 항목 | mentoring-juniors (유지) | mentor (삭제) |
|------|------------------------|---------------|
| 줄 수 | 180줄 | 34줄 |
| 방법론 | PEAR Loop (Plan→Explore→Analyze→Rewrite) | "소크라테스식 질문" (비구조적) |
| 단서 시스템 | 점진적 3단계 힌트 제공 | 없음 |
| 검증 | 5단계 이해도 검증 | 없음 |
| 딜리버리 밸런스 | 학습 vs 납기 매트릭스 | 없음 |
| 추가 기법 | 고무 오리 디버깅, 5 Whys | 없음 |

**결론:** mentoring-juniors(Sensei)가 구조화된 방법론, 검증 체계, 균형 매트릭스를 갖춘 완전한 멘토링 시스템. mentor는 34줄의 비구조적 가이드로 기능 부족.

---

### 1.2 Instructions — 1개 삭제 (통합)

#### prompt.instructions.md → instructions.instructions.md에 통합

| 항목 | instructions (유지·확장) | prompt (삭제·통합) |
|------|------------------------|-------------------|
| 대상 | `.instructions.md` 파일 | `.prompt.md` 파일 |
| 프론트매터 가이드 | description, applyTo | description, name, agent, model, tools |
| 파일 구조 가이드 | 섹션 구성, 예시 패턴 | 섹션 구성, 입력 처리, 도구 권한 |
| 네이밍 규칙 | kebab-case, `.github/instructions/` | kebab-case, `.github/prompts/` |
| 중복 비율 | — | 프론트매터·구조·네이밍·유지보수 섹션 **40~50% 중복** |

**결론:** 두 파일의 구조 가이드·네이밍 규칙·유지보수 섹션이 거의 동일. `instructions.instructions.md`에 "Copilot Prompt Files Guidelines" 섹션을 추가하여 프롬프트 고유 내용(agent/model/tools 프론트매터, 입력 처리, 도구 권한 등)을 통합. `applyTo` 패턴도 `**/*.instructions.md, **/*.prompt.md`로 확장.

---

### 1.3 Plugins — 1개 삭제

#### polyglot-test-agent 삭제 → testing-automation으로 대체

| 항목 | testing-automation (유지) | polyglot-test-agent (삭제) |
|------|-------------------------|--------------------------|
| TDD 에이전트 | Red/Green/Refactor 3종 | 없음 |
| Playwright | explore-website, generate-test | 없음 |
| 안전성 리뷰 | ai-prompt-engineering-safety-review | 없음 |
| 단위 테스트 | csharp-nunit, java-junit | 7개 언어 (C#/TS/JS/Python/Go/Rust/Java) |
| 에이전트 수 | 4개 에이전트 + 5개 스킬 | 8개 에이전트 + 1개 스킬 |

**결론:** testing-automation이 TDD 워크플로우, E2E 테스팅, 안전성 리뷰까지 더 넓은 범위를 커버. polyglot-test-agent의 다언어 단위 테스트 기능은 유용하나, testing-automation의 TDD 에이전트가 언어에 구애받지 않는 방법론을 제공하므로 대체 가능.

---

## 2. 유지하되 역할 구분이 필요한 유사 그룹

### 2.1 계획 에이전트 3종 (모두 유지)

| 에이전트 | 용도 | 규모 | 출력 형식 |
|----------|------|------|-----------|
| `planner.agent.md` | 빠른 경량 구현 계획 | 18줄 | 4섹션 Markdown |
| `plan.agent.md` | 전략적 아키텍처 설계 토론 | 136줄 | 대화형 분석 문서 |
| `task-planner.agent.md` | 구조화된 태스크 계획 (리서치 검증 필수) | 405줄 | `.copilot-tracking/` 파일 세트 |

**차이:** 규모·용도·출력 형식이 모두 다름. planner=빠른 계획, plan=전략 토론, task-planner=엔터프라이즈급 구조화.

### 2.2 아키텍트 3종 (모두 유지)

| 에이전트 | 관점 | 주요 산출물 |
|----------|------|------------|
| `arch.agent.md` | 클라우드/시스템 아키텍처 설계 | 아키텍처 다이어그램, NFR 분석 |
| `repo-architect.agent.md` | 프로젝트 디렉토리 구조 설계 | .github/ 스캐폴딩, 파일 조직 |
| `context-architect.agent.md` | 기존 코드 변경 전 영향도 분석 | 의존성 맵, 변경 순서 계획 |

**차이:** arch=새 시스템 설계, repo-architect=프로젝트 구조, context-architect=기존 코드 분석. 레벨이 다름.

### 2.3 비판적 사고 2종 (모두 유지)

| 에이전트 | 접근법 | 종료 조건 |
|----------|--------|-----------|
| `critical-thinking.agent.md` | "왜?"를 반복하여 내부 논리 검증 | 깊은 추론 도달 시 |
| `devils-advocate.agent.md` | 결함·엣지케이스·리스크 식별 | 종합 단계 후 객관적 논의 전환 |

**차이:** critical-thinking=내부 추론 검증, devils-advocate=외부 리스크 식별. 상호 보완적.

### 2.4 구현 계획 2종 (모두 유지)

| 에이전트 | 대상 독자 | 출력 형식 |
|----------|----------|-----------|
| `implementation-plan.agent.md` | AI 에이전트 (기계 판독용) | YAML/Markdown 템플릿 (REQ-, TASK-, TEST- ID 체계) |
| `plan.agent.md` | 사람 (협업 토론용) | 자유 형식 전략 문서 |

**차이:** implementation-plan=AI 실행용 결정적 계획, plan=사람과의 전략 토론.

### 2.5 GEM planner vs 독립 planner (모두 유지)

| 에이전트 | 컨텍스트 | 출력 형식 |
|----------|---------|-----------|
| `gem-planner.agent.md` | GEM 오케스트레이션 시스템 내부 | DAG 기반 YAML + 태스크 할당 JSON |
| `planner.agent.md` | 독립 사용 | 4섹션 Markdown |

**차이:** gem-planner는 오케스트레이션 시스템 전용, planner는 독립 사용.

---

## 3. Skills 선별 분석 (203개 → 19개 독립 스킬)

### 3.1 선별 프로세스

프로젝트 루트 `skills/` 디렉토리에 203개 독립 스킬이 존재.
`plugins-skills-analysis.md`에서 32개를 높은 우선순위(언어/플랫폼 비종속)로 분류.

### 3.2 플러그인 내 이미 포함된 스킬 (13개 — 독립 복사 제외)

| 스킬 | 포함된 플러그인 | 제외 사유 |
|------|----------------|-----------|
| `breakdown-epic-arch` | project-planning | 플러그인 내 skills/에 동일 스킬 존재 |
| `breakdown-epic-pm` | project-planning | 〃 |
| `breakdown-feature-prd` | project-planning | 〃 |
| `breakdown-feature-implementation` | project-planning | 〃 |
| `create-implementation-plan` | project-planning | 〃 |
| `create-github-issues-feature-from-implementation-plan` | project-planning | 〃 |
| `structured-autonomy-plan` | structured-autonomy | 〃 |
| `structured-autonomy-generate` | structured-autonomy | 〃 |
| `context-map` | context-engineering | 〃 |
| `refactor-plan` | context-engineering | 〃 |
| `ai-prompt-engineering-safety-review` | security-best-practices, testing-automation | 2개 플러그인에 중복 포함 |
| `playwright-explore-website` | testing-automation | 〃 |
| `playwright-generate-test` | testing-automation | 〃 |

### 3.3 독립 복사 대상 (19개)

플러그인에 포함되지 않은 높은 우선순위 스킬로, 언어/플랫폼에 종속되지 않는 범용 기능:

| # | 스킬 | 역할 | 개발 단계 |
|---|------|------|-----------|
| 1 | `breakdown-plan` | 프로젝트 계획 (Epic>Feature>Story 계층 + GitHub 이슈) | 설계 |
| 2 | `breakdown-test` | 테스트 계획 (ISTQB/ISO 25010) | 설계 |
| 3 | `architecture-blueprint-generator` | 아키텍처 청사진 분석·문서화 | 설계 |
| 4 | `technology-stack-blueprint-generator` | 기술 스택 분석·문서화 | 설계 |
| 5 | `create-architectural-decision-record` | ADR 문서 생성 | 설계 |
| 6 | `create-github-pull-request-from-specification` | 사양 기반 PR 생성 | 구현 |
| 7 | `review-and-refactor` | 코드 리뷰 + 리팩토링 | 구현 |
| 8 | `refactor` | 수술적 코드 리팩토링 | 구현 |
| 9 | `refactor-method-complexity-reduce` | 메서드 복잡도 감소 | 구현 |
| 10 | `git-commit` | Conventional Commits 커밋 | 구현 |
| 11 | `git-flow-branch-creator` | Git Flow 브랜치 생성 | 구현 |
| 12 | `conventional-commit` | 구조화된 커밋 메시지 | 구현 |
| 13 | `agent-governance` | AI 에이전트 거버넌스·안전 제어 | 품질 |
| 14 | `agentic-eval` | AI 에이전트 자기비판·평가 | 품질 |
| 15 | `create-readme` | README 생성 | 유지보수 |
| 16 | `create-oo-component-documentation` | OO 컴포넌트 문서화 (C4/Arc42) | 유지보수 |
| 17 | `add-educational-comments` | 교육용 코드 주석 | 유지보수 |
| 18 | `code-exemplars-blueprint-generator` | 코드 모범 사례 문서화 | 유지보수 |
| 19 | `comment-code-generate-a-tutorial` | 코드→튜토리얼 변환 | 유지보수 |

### 3.4 제외된 스킬 예시 (184개)

| 분류 | 예시 | 제외 사유 |
|------|------|-----------|
| 언어 종속 | csharp-async, java-springboot, kotlin-springboot | 특정 언어에 한정 |
| 플랫폼 종속 | azure-*, power-bi-*, fabric-lakehouse | 특정 클라우드/플랫폼에 한정 |
| 도구 종속 | *-mcp-server-generator (7개) | 특정 MCP 서버 생성기 |
| 프레임워크 종속 | fluentui-blazor, aspire, ef-core | 특정 프레임워크에 한정 |
| OS 종속 | arch-linux-triage, debian-linux-triage | 특정 OS에 한정 |

---

## 4. 최종 파일 목록 (2차 축소 후)

### Agents (20개)

```
agents/
├── 4.1-Beast.agent.md                    # 자율 코딩 에이전트
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
├── instructions.instructions.md                          # 인스트럭션+프롬프트 작성 (통합)
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

## 5. 2차 축소 (87개 → 50개)

2차 축소에서 37개를 추가 제거. 분류 기준: 중복(18), 교육(7), 특수(6), 보조(6).

주요 결정:
- **오케스트레이션 단일화:** GEM Suite만 유지, RUG Workflow(3개) 삭제 — GEM이 상위 호환
- **계획 에이전트 통합:** task-planner만 유지 (planner, plan, implementation-plan 삭제)
- **리팩토링 통합:** review-and-refactor만 유지 (refactor, complexity-reduce 삭제)
- **Git 스킬 정리:** git-commit + git-flow-branch-creator만 유지 (conventional-commit 삭제)

상세 판정표는 `SELECTION-CRITERIA.md` 참조.
