QUICKSTART  GitHub Copilot 프로젝트 컨텍스트 설정 v2.0-beta — 3단계 빠른 시작
============================================================================
목적: /init-ahnlab 프롬프트 한 번으로 Copilot 2층 구조를 자동 설정한다.

상세 안내: README.TXT  |  전체 설명서: PROJECT_COPILOT_SETUP_GUIDE.md



[준비물]

  - VS Code + GitHub Copilot + GitHub Copilot Chat 확장 설치
  - 프로젝트 소스 코드 로컬 체크아웃 완료
  - .github/templates/       ← AHNLAB_TEMPLATE_*.md + awesome-copilot-main/ 폴더 포함



[STEP 1]  templates 폴더 확인

  .github\templates\ 안에 아래 구조가 있어야 합니다:

    .github\templates\
      awesome-copilot-main\agents\        ← 20개 *.agent.md 파일
      awesome-copilot-main\instructions\  ← 12개 *.instructions.md 파일
      awesome-copilot-main\skills\        ← 10개 skill 폴더
      awesome-copilot-main\plugins\       ← 9개 plugin 폴더
      AHNLAB_TEMPLATE_*.md      ← CFG 생성 기준 파일
      PROJECT_COPILOT_SETUP_GUIDE.md
      QUICKSTART.md
      README.TXT
      CHANGELOG.md

  .github\prompts\ 안에 아래 파일이 있어야 합니다:
    init-ahnlab.prompt.md

  없는 경우: 배포 패키지에서 해당 폴더를 복사합니다.
    PowerShell:
      Copy-Item -Path ".\templates" -Destination ".\.github\templates" -Recurse
      Copy-Item -Path ".\prompts"   -Destination ".\.github\prompts"   -Recurse



[STEP 2]  Copilot Chat에서 /init-ahnlab 실행

  2-1. Copilot Chat 열기 (Ctrl+Alt+I)
  2-2. 입력창에 /init-ahnlab 입력 후 Enter

  이후 AI가 자동으로:
    - .github/agents/        에 20개 에이전트 파일 배포
    - .github/instructions/  에 12개 지침 파일 배포
    - .github/copilot-instructions.md  생성
    - .github/code-style-guide.md      생성
    - .github/commit-message.style.md  생성
    - .github/docs/          에 프로젝트 문서 자동 생성 (최대 14개)
    - AGENTS.md (프로젝트 루트)         생성
    - 설정 검증 후 감사 보고서 저장



[STEP 3]  결과 확인

  정상 생성 후 구조:

    <프로젝트 루트>/
      AGENTS.md
      .github/
        copilot-instructions.md
        code-style-guide.md
        commit-message.style.md
        agents/               <- 20개 agent 파일
        instructions/         <- 12개 rules 파일
        docs/                 <- 프로젝트 문서 (최대 14개)
        templates/
          AUDIT_REPORT_YYYY-MM-DD.md  <- 감사 보고서

  감사 결과 확인:
    PASS       -> Git 커밋으로 진행
    FAIL/COND  -> 보고서 이슈 수정 후 Copilot Chat에서 "Run audit" 재실행
