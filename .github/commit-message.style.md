# 커밋 메시지 스타일 가이드

## Format

커밋 메시지 형식(템플릿)은 아래와 같습니다.

### 기본 형식 (Conventional Commits 스타일)

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 상세 형식 (이슈 트래킹 포함)

```
[문제의 원인]

    문제가 발생한 원인 또는 수정이 필요한 이유를 구체적으로 기술

[수정 사항]

    변경된 내용 및 수정 방법을 명확하게 기술

[변경된 파일/모듈]

    변경된 모든 파일/디렉터리 목록
    예) .github/agents/arch.agent.md

[테스트 사항]

테스트 환경 : VS Code + GitHub Copilot Chat

Test Step)
    1. /init-ahnlab 커맨드 실행
    2. .github/ 산출물 구조 확인
    3. Copilot Chat에서 에이전트 동작 확인
    4. 감사 보고서(AUDIT_REPORT) PASS 확인
```

---

## Type 종류

| Type | 설명 | 예시 |
|------|------|------|
| `feat` | 새로운 기능 추가 | feat(init): skills 자동 배포 추가 |
| `fix` | 버그 수정 | fix(phase3): 플레이스홀더 미치환 수정 |
| `docs` | 문서 변경 | docs: QUICKSTART 업데이트 |
| `style` | 코드 포맷팅 (기능 변경 없음) | style: 들여쓰기 수정 |
| `refactor` | 리팩토링 | refactor: Phase 순서 재구성 |
| `test` | 테스트 추가/수정 | test: Phase 5 감사 검증 강화 |
| `chore` | 빌드/설정 변경 | chore: 템플릿 파일 업데이트 |
| `perf` | 성능 개선 | perf: 배포 스크립트 최적화 |
| `security` | 보안 관련 수정 | security: 템플릿 무결성 검증 추가 |

---

## 작성 규칙

### Subject (제목)
- 50자 이내로 작성
- 마침표 없이 끝냄
- 명령형으로 작성 (영어: "Add", "Fix", "Update" / 한글: "추가", "수정", "변경")

### Body (본문)
- 선택 사항 (필요시 작성)
- "무엇을" 보다 "왜"에 초점
- 72자마다 줄바꿈 권장

### Footer (꼬리말)
- 이슈 참조: `Closes #123`, `Fixes #456`
- Breaking Change: `BREAKING CHANGE: 설명`

---

## 예시

### 간단한 수정
```
fix(agents): arch.agent.md 프로젝트 맞춤 섹션 수정

원본 내용 뒤에 구분자 없이 추가되던 문제 수정

Fixes #12
```

### 기능 추가
```
feat(init): Phase 3.5 프로젝트 문서 자동 생성 추가

- Tier 1 핵심 문서 5종 자동 생성
- Mermaid 다이어그램 포함
- AGENTS.md 문서 참조 테이블 연동

Closes #34
```

### 상세 형식
```
[문제의 원인]

    플레이스홀더 [날짜]가 Phase 3에서 치환되지 않아
    감사 검증에서 FAIL 처리됨

[수정 사항]

    - Phase 3 CFG 생성 로직에 날짜 자동 치환 추가
    - AHNLAB_TEMPLATE_*.md 에 ISO 8601 형식 날짜 삽입

[변경된 파일/모듈]

    prompts/init-ahnlab.prompt.md
    templates/AHNLAB_TEMPLATE_copilot-instructions.md

[테스트 사항]

테스트 환경 : VS Code + GitHub Copilot Chat

Test Step)
    1. /init-ahnlab 실행
    2. .github/copilot-instructions.md 날짜 확인
    3. Phase 5 감사 보고서 PASS 확인
    4. [날짜] 문자열 미잔류 확인
```

---

## 피해야 할 패턴

```
✗ "수정함"
✗ "버그 fix"
✗ "asdf"
✗ "WIP"
✗ "여러 파일 수정"
```

---

**마지막 업데이트**: 2026-05-20
**문서 버전**: 2.0-beta
