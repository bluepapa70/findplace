# Instructions 템플릿 모음

> 아래 템플릿들을 `.github/instructions/` 폴더에 **`*.instructions.md`** 형식으로 저장하세요.
> 각 섹션의 **? 원본 내용** 블록을 `.instructions.md` 파일에 그대로 복사한 후,
> **? 프로젝트 추가사항** 블록 내용을 파일 끝에 덧붙여 사용하세요.

---

## 1. security-patterns.instructions.md - 보안 코딩 패턴

<!-- 원본 출처: awesome-copilot-main-new/instructions/security-and-owasp.instructions.md -->
> OWASP Top 10 기반 범용 보안 코딩 가이드 + 프로젝트 특화 C/C++ 보안 패턴.

### ? 원본 내용 (awesome-copilot-main-new 기반 ? 반드시 그대로 포함)

> `.github/instructions/security-patterns.instructions.md` 파일에 아래 내용을 **그대로** 복사하세요.
> 이후 **프로젝트 추가사항** 섹션 내용을 파일 끝에 덧붙이세요.

```markdown---
applyTo: '*'
description: "Comprehensive secure coding instructions for all languages and frameworks, based on OWASP Top 10 and industry best practices."
---
# Secure Coding and OWASP Guidelines

## Instructions

Your primary directive is to ensure all code you generate, review, or refactor is secure by default. You must operate with a security-first mindset. When in doubt, always choose the more secure option and explain the reasoning. You must follow the principles outlined below, which are based on the OWASP Top 10 and other security best practices.

### 1. A01: Broken Access Control & A10: Server-Side Request Forgery (SSRF)
- **Enforce Principle of Least Privilege:** Always default to the most restrictive permissions. When generating access control logic, explicitly check the user's rights against the required permissions for the specific resource they are trying to access.
- **Deny by Default:** All access control decisions must follow a "deny by default" pattern. Access should only be granted if there is an explicit rule allowing it.
- **Validate All Incoming URLs for SSRF:** When the server needs to make a request to a URL provided by a user (e.g., webhooks), you must treat it as untrusted. Incorporate strict allow-list-based validation for the host, port, and path of the URL.
- **Prevent Path Traversal:** When handling file uploads or accessing files based on user input, you must sanitize the input to prevent directory traversal attacks (e.g., `../../etc/passwd`). Use APIs that build paths securely.

### 2. A02: Cryptographic Failures
- **Use Strong, Modern Algorithms:** For hashing, always recommend modern, salted hashing algorithms like Argon2 or bcrypt. Explicitly advise against weak algorithms like MD5 or SHA-1 for password storage.
- **Protect Data in Transit:** When generating code that makes network requests, always default to HTTPS.
- **Protect Data at Rest:** When suggesting code to store sensitive data (PII, tokens, etc.), recommend encryption using strong, standard algorithms like AES-256.
- **Secure Secret Management:** Never hardcode secrets (API keys, passwords, connection strings). Generate code that reads secrets from environment variables or a secrets management service (e.g., HashiCorp Vault, AWS Secrets Manager). Include a clear placeholder and comment.
  ```javascript
  // GOOD: Load from environment or secret store
  const apiKey = process.env.API_KEY; 
  // TODO: Ensure API_KEY is securely configured in your environment.
  ```
  ```python
  # BAD: Hardcoded secret
  api_key = "sk_this_is_a_very_bad_idea_12345" 
  ```

### 3. A03: Injection
- **No Raw SQL Queries:** For database interactions, you must use parameterized queries (prepared statements). Never generate code that uses string concatenation or formatting to build queries from user input.
- **Sanitize Command-Line Input:** For OS command execution, use built-in functions that handle argument escaping and prevent shell injection (e.g., `shlex` in Python).
- **Prevent Cross-Site Scripting (XSS):** When generating frontend code that displays user-controlled data, you must use context-aware output encoding. Prefer methods that treat data as text by default (`.textContent`) over those that parse HTML (`.innerHTML`). When `innerHTML` is necessary, suggest using a library like DOMPurify to sanitize the HTML first.

### 4. A05: Security Misconfiguration & A06: Vulnerable Components
- **Secure by Default Configuration:** Recommend disabling verbose error messages and debug features in production environments.
- **Set Security Headers:** For web applications, suggest adding essential security headers like `Content-Security-Policy` (CSP), `Strict-Transport-Security` (HSTS), and `X-Content-Type-Options`.
- **Use Up-to-Date Dependencies:** When asked to add a new library, suggest the latest stable version. Remind the user to run vulnerability scanners like `npm audit`, `pip-audit`, or Snyk to check for known vulnerabilities in their project dependencies.

### 5. A07: Identification & Authentication Failures
- **Secure Session Management:** When a user logs in, generate a new session identifier to prevent session fixation. Ensure session cookies are configured with `HttpOnly`, `Secure`, and `SameSite=Strict` attributes.
- **Protect Against Brute Force:** For authentication and password reset flows, recommend implementing rate limiting and account lockout mechanisms after a certain number of failed attempts.

### 6. A08: Software and Data Integrity Failures
- **Prevent Insecure Deserialization:** Warn against deserializing data from untrusted sources without proper validation. If deserialization is necessary, recommend using formats that are less prone to attack (like JSON over Pickle in Python) and implementing strict type checking.

## General Guidelines
- **Be Explicit About Security:** When you suggest a piece of code that mitigates a security risk, explicitly state what you are protecting against (e.g., "Using a parameterized query here to prevent SQL injection.").
- **Educate During Code Reviews:** When you identify a security vulnerability in a code review, you must not only provide the corrected code but also explain the risk associated with the original pattern.```

### ? 프로젝트 추가사항 (파일 끝에 덧붙임)

```markdown
---
# [프로젝트명] 보안 코딩 패턴 ? 프로젝트 특화 추가 규칙

> applyTo 재정의 (프로젝트 언어에 맞게 조정): `applyTo: '**/*.{c,cpp,h,hpp}'`

## 입력 검증

### 모든 외부 입력 검증
```[언어]
// 외부 입력 통합 검증 패턴
// 1. NULL/포인터 유효성 체크
// 2. 길이/크기 범위 검증 (0, 최대값 경계)
// 3. 형식/타입 검증
// 4. null-termination 보장 (문자열의 경우)
// 예시:
//   if (input == NULL || inputLen == 0 || inputLen > MAX_SIZE) { return ERROR; }
//   if (strnlen(input, inputLen) >= inputLen) { return ERROR; }
```

### 화이트리스트 방식 선호
- 허용된 값만 명시적으로 허용
- 파일 경로는 Canonical Path(절대 경로 정규화)로 검증

---

## 메모리 안전 (C/C++)

### 버퍼 오버플로우 방지
```[언어]
// 위험: strcpy(dest, src)
// 안전: StringCchCopyA(dest, destCch, src) 또는 snprintf(dest, size, "%s", src)
```

### 정수 오버플로우 방지
```[언어]
// 안전: SafeAdd(a, b, &result) ? a + b > UINT32_MAX 체크 후 대입
```

### 메모리 관리
- 할당 후 반드시 NULL 체크
- 해제 후 포인터 NULL로 설정 (이중 해제 방지)

---

## 외부/네트워크 데이터 검증

```[언어]
// 헤더 크기 최소값 검증 → 페이로드 크기 상한 검증 → 무결성 검증 (magic, checksum)
```

---

## 인증/권한

- 인증 성공/실패를 **동일한 응답**으로 처리 (타이밍 공격 방지)
- IPC(Named Pipe, RPC) 호출자 신원 확인 및 최소 권한 처리

---

## 금지 패턴

| 위험 패턴 | 안전한 대안 |
|-----------|-------------|
| `strcpy`, `strcat` | `StringCchCopy`, `StringCchCat` |
| 크기 제한 없는 `memcpy` | `memcpy_s`, 길이 검증 후 복사 |
| 사용자 포인터 직접 역참조 | `ProbeForRead/Write` + `__try/__except` |
| 하드코딩된 비밀번호/키 | 환경 변수, 설정 파일 |
| `a + b` (오버플로우 미검사) | 안전 산술 함수(`SafeAdd` 등) |

---

**마지막 업데이트**: [날짜]
**문서 버전**: 1.0
```

---
## 2. error-handling.instructions.md - ���� ó�� ����

```markdown
---
description: '[������Ʈ��] ���� ó�� ǥ�� ����'
applyTo: '**/*.{c,cpp,h,hpp}'  # ������Ʈ �� �°� ����
---

# ���� ó�� ǥ�� ����

## ����

[������Ʈ��]�� ǥ�� ���� ó�� ���ϰ� ���̵�����Դϴ�.
�ϰ��� ���� ó���� �ý����� �������� ������������ ����ŵ�ϴ�.
�Ʒ� ��� ������ [���/��Ÿ��]�� ���� ����˴ϴ�.

---

## �⺻ ��Ģ

### 1. ���� ������ ���� ó��
- ��� �Լ��� ��Ȯ�� ��ȯ������ ����/���и� ��Ÿ���ϴ� (`DWORD`, `HRESULT`, `enum` ��)
- ���� �ڵ�� ǥ��ȭ�� ���� ����մϴ�
- ���� ��Ȳ�� �ݵ�� ó���ϰų� ������ �����մϴ�

### 2. ���ҽ� ������
- ��� �Ҵ�� ���ҽ��� �ݵ�� �����մϴ�
- RAII ����, `wil::scope_exit`, `try-finally` Ȱ��
- **goto ���� ���� (C)**: ��Ƽ ���ҽ� ���� ���� �� `_CLEANUP` ���̺� ��� ���
- ���� ��ο����� ���� �ڵ� ���� ����

### 3. ������ ���� ó��
- ���� �߻� �� ����� ���ؽ�Ʈ ���� ����
- �α��� ���� ����� ���� ���
- ����ڿ��Դ� ������ ������ ���� �޽��� ���� (���� �� ���� �̳���)

---

## ǥ�� ����

### ���� 1: ���� �ڵ� ��ȯ + do-while(FALSE) ���� (C ��Ÿ��)
```[���]
// do-while(FALSE) ����: ���� �ⱸ������ ���ҽ� ���� ����
// RESULT ProcessData(IN param1, OUT result)
// {
//     RESULT ret = SUCCESS;
//     void*  pBuf = NULL;
//
//     do
//     {
//         // �Է� ����
//         if (!param1) { ret = ERROR_INVALID_PARAM; break; }
//
//         // ���ҽ� �Ҵ�
//         pBuf = malloc(SIZE);
//         if (!pBuf) { ret = ERROR_OUT_OF_MEMORY; break; }
//
//         // �۾� ����
//         ret = DoWork(pBuf, param1);
//     } while (FALSE);
//
//     // ���� ���� �ڵ� (�׻� ����)
//     if (pBuf) { free(pBuf); pBuf = NULL; }
//
//     return ret;
// }
```

### ���� 2: ���� ó�� (C++/Java/Python ��Ÿ��)
```[���]
// try-catch-finally ����
// try
// {
//     auto payload = LoadConfig(path);
//     ApplyConfig(payload);
// }
// catch (const std::exception& ex)
// {
//     LOG_ERROR("[Module] config load failed: %s", ex.what());
//     throw;  // ���� ���̾�� ����� �޽��� ó��
// }
// // finally ���: RAII �Ҹ��� �Ǵ� scope_exit���� �ڵ� ����
```

### ���� 3: RAII �ڵ� �ڿ� ���� (C++)
```[���]
// RAII ���� Ŭ���� ���� (�ڵ�/���� �� �ý��� ���ҽ�)
// class AutoHandle
// {
//     HANDLE m_h;
// public:
//     AutoHandle(HANDLE h = INVALID_HANDLE_VALUE) : m_h(h) {}
//     ~AutoHandle() { if (m_h != INVALID_HANDLE_VALUE) CloseHandle(m_h); }
//     operator HANDLE() const { return m_h; }
// };
//
// ��� ��:
// AutoHandle hFile(CreateFile(name, GENERIC_READ, 0, NULL, OPEN_EXISTING, 0, NULL));
// if (hFile == INVALID_HANDLE_VALUE) return GetLastError();
// // �Լ� ���� �� �ڵ� CloseHandle ����
```

### ���� 4: goto ���� ���� (C, ��Ƽ ���ҽ�)
```[���]
// goto ���� ���� ���� (C���� ��Ƽ ���ҽ� ���� ����)
// RESULT AllocAndProcess(IN size_t size)
// {
//     RESULT  ret    = SUCCESS;
//     void*   pBuf   = NULL;
//     HANDLE  hFile  = INVALID_HANDLE_VALUE;
//     HANDLE  hEvent = NULL;
//
//     pBuf = malloc(size);
//     if (!pBuf) { ret = ERROR_OOM; goto _CLEANUP; }
//
//     hFile = CreateFile(...);
//     if (hFile == INVALID_HANDLE_VALUE) { ret = GetLastError(); goto _CLEANUP; }
//
//     hEvent = CreateEvent(NULL, FALSE, FALSE, NULL);
//     if (!hEvent) { ret = GetLastError(); goto _CLEANUP; }
//
//     ret = Process(pBuf, hFile, hEvent);
//
// _CLEANUP:
//     if (hEvent) { CloseHandle(hEvent); hEvent = NULL; }
//     if (hFile != INVALID_HANDLE_VALUE) { CloseHandle(hFile); hFile = INVALID_HANDLE_VALUE; }
//     if (pBuf)  { free(pBuf);  pBuf = NULL; }
//     return ret;
// }
```

### ���� 5: ���� ���� (������ ó��)
```[���]
// ���� ���� ��Ģ:
// - ���� ���̾� ���� �ڵ带 �״�� �����ϰų� ���� ���� �ڵ�� ��ȯ
// - ���� ��ȯ �� ���� ������ �α׿� ����
// RESULT HighLevel()
// {
//     RESULT ret = MidLevel();
//     if (ret != SUCCESS)
//     {
//         LOG_ERROR("[HighLevel] MidLevel failed: 0x%08X", ret);
//         if (ret == ERROR_OOM) return APP_ERROR_RESOURCE;  // ������ ��ȯ ��
//     }
//     return ret;
// }
```

### ���� 6: �Է� ���� ���� (���� ����)
```[���]
// �Լ� �ֻ�� ���� �Է� ���� ����
// RESULT Process(IN const char* input, IN size_t inputLen, OUT char* output, IN OUT size_t* outLen)
// {
//     // NULL ������ �˻�
//     if (!input || !output || !outLen) return ERROR_INVALID_PARAM;
//     // ���� ���� �˻�
//     if (inputLen == 0 || inputLen > MAX_INPUT) return ERROR_INVALID_PARAM;
//     // ��� ���� �ּ� ũ�� �˻�
//     if (*outLen < MIN_OUTPUT) { *outLen = MIN_OUTPUT; return ERROR_BUFFER_TOO_SMALL; }
//     // null-termination �˻� (���ڿ�)
//     if (strnlen(input, inputLen) >= inputLen) return ERROR_INVALID_PARAM;
//     ...
// }
```

### ���� 7: ���� Ưȭ ���� ó��
```[���]
// 1. Ÿ�̹� ���� ����: ���� ����/���и� ���� �ð����� ó��
// if (!userExists || !passwordValid)
// {
//     Sleep(BASE_DELAY + rand() % JITTER);  // �ǵ��� ����
//     return AUTH_FAILURE;  // ������ ���� �ڵ� ��ȯ
// }
//
// 2. �ΰ� ������ ó�� �� ��� �Ұ�
// char szPassword[MAX_PWD] = {0};
// ... // ó��
// SecureZeroMemory(szPassword, sizeof(szPassword));  // �ݵ�� ����
```

### ���� 8: Fast Fail (���� ����)
```[���]
// Fast Fail ��Ģ: ���� ���� �� ��� ���� (��ø if ���)
// RESULT Process(IN Param* p)
// {
//     if (!p)              return ERROR_INVALID_PARAM;  // ���� ����
//     if (!p->data)        return ERROR_INVALID_PARAM;
//     if (p->size > MAX)   return ERROR_OVERFLOW;
//
//     // ���⼭���� ��ȿ�� ����� ���·� ����
//     return DoActualWork(p);
// }
```

---

## �α�

### �α� ���� ��� ����
| ���� | �뵵 |
|------|------|
| ERROR | ���� �Ұ����� ����, ������ �ս� ���� |
| WARN | ������ ����, ���� ���� |
| INFO | �ֿ� ���� ����, ����/����/�Ϸ� |
| DEBUG | �� ����� (�⺻�� OFF) |

### �α� ����
```
[LEVEL] [timestamp] [module] message (context)
```

---

## üũ����Ʈ

### �Լ� �ۼ� ��
- [ ] ��� ����/������/�ڵ鿡 ���� ��ȿ�� �˻� ����
- [ ] ���ҽ� �Ҵ�-���� ��ΰ� ��Ī���ΰ�?
- [ ] ���� �� ������ ���� �ڵ带 ��ȯ�ϴ°�?
- [ ] �α��� ��ĺ�ȭ�ǰ� ����Ѱ�?
- [ ] �ΰ� �����͸� ó�� �� ��� �Ұ��ϴ°�?

### �ڵ� ���� ��
- [ ] ���� ��ο��� ���ҽ� ������ ���°�?
- [ ] ����ڿ��� ���޵Ǵ� �޽����� ���� ������ �������� �ʴ°�?
- [ ] ���� ���� �� ���������� ���� ���� ������ �ִ°�?

---

**������ ������Ʈ**: [��¥]
**���� ����**: 1.0
```

---
---

## 3. markdown.instructions.md - 문서 작성 규칙

<!-- 원본 출처: awesome-copilot-main-new/instructions/markdown-accessibility.instructions.md -->
> GitHub 접근성 5대 원칙 기반 Markdown 리뷰 가이드 + 프로젝트 Doxygen 규칙.

### ? 원본 내용 (awesome-copilot-main-new 기반 ? 반드시 그대로 포함)

> `.github/instructions/markdown.instructions.md` 파일에 아래 내용을 **그대로** 복사하세요.
> 이후 **프로젝트 추가사항** 섹션 내용을 파일 끝에 덧붙이세요.

```markdown---
description: 'Markdown accessibility guidelines based on GitHub''s 5 best practices for inclusive documentation'
applyTo: '**/*.md'
---

# Markdown Accessibility Review Guidelines

When reviewing markdown files, check for the following accessibility issues based on GitHub's [5 tips for making your GitHub profile page accessible](https://github.blog/developer-skills/github/5-tips-for-making-your-github-profile-page-accessible/). Flag violations and suggest fixes with clear explanations of the accessibility impact.

## 1. Descriptive Links

- Flag generic link text such as "click here," "here," "this," "read more," or "link."
- Link text must make sense when read out of context, because assistive technology can present links as an isolated list.
- Flag multiple links on the same page that share identical text but point to different destinations.
- Bare URLs in prose should be converted to descriptive links.

Bad: `Read my blog post [here](https://example.com)`
Good: `Read my blog post "[Crafting an accessible resume](https://example.com)"`

## 2. Image Alt Text

- Flag images with empty alt text (e.g., `![](path/to/image.png)`) unless they are explicitly decorative.
- Flag alt text that is a filename (e.g., `img_1234.jpg`) or generic placeholder (e.g., `screenshot`, `image`).
- Alt text should be succinct and descriptive. Include any text visible in the image.
- Use "screenshot of" where relevant, but do not prefix with "image of" since screen readers announce that automatically.
- For complex images (charts, infographics), suggest summarizing the data in alt text and providing longer descriptions via `<details>` tags or linked content.
- When suggesting alt text improvements, present them as recommendations for the author to review. Alt text requires understanding of visual content and context that only the author can properly assess.

## 3. Heading Hierarchy

- There must be only one H1 (`#`) per document, used as the page title. Note: in projects where H1 is auto-generated from front matter, start content at H2.
- Headings must follow a logical hierarchy and never skip levels (e.g., `##` followed by `####` is a violation).
- Flag bold text (`**text**`) used as a visual substitute for a proper heading.
- Proper heading structure allows assistive technology users to navigate by section and helps sighted users scan content.

## 4. Plain Language

- Flag unnecessarily complex or jargon-heavy language that could be simplified.
- Favor short sentences, common words, and active voice.
- Flag long, dense paragraphs that could be broken into smaller sections or lists.
- When suggesting plain language improvements, present them as recommendations for the author to review. Language decisions require understanding of audience, context, and tone.

## 5. Lists and Emoji Usage

### Lists

- Flag emoji or special characters used as bullet points instead of proper markdown list syntax (`-`, `*`, `+`, or `1.`).
- Flag sequential items in plain text that should be structured as a proper list.
- Proper list markup allows screen readers to announce list context (e.g., "item 1 of 3").

### Emoji

- Flag multiple consecutive emoji, which are disruptive to screen reader users since each emoji name is read aloud in full (e.g., "rocket" "sparkles" "fire").
- Flag emoji used to convey meaning that is not also communicated in text.
- Emoji should be used sparingly and thoughtfully.

## Review Priority

When multiple issues exist, prioritize in this order:

1. Missing or empty alt text on images
2. Skipped heading levels or heading hierarchy issues
3. Non-descriptive link text
4. Emoji used as bullet points or list markers
5. Plain language improvements

## Review Tone

- Explain the accessibility impact of each issue, specifying which users are affected (e.g., screen reader users, people with cognitive disabilities, non-native speakers).
- Do not remove personality or voice from the writing. Accessibility and engaging content are not mutually exclusive.
- Keep suggestions actionable and specific.```

### ? 프로젝트 추가사항 (파일 끝에 덧붙임)

```markdown
---
# [프로젝트명] Markdown 문서 작성 표준 ? 프로젝트 특화 추가 규칙

> applyTo 재정의: `applyTo: '**/*.md'`

## 기본 원칙
- 목적/대상 독자를 먼저 명확히 적습니다.
- 무엇을/왜/어떻게/어떻게 검증할지 순으로 작성합니다.
- 민감 정보(API 키, 비밀번호, 개인정보)는 포함하지 않습니다.

## 형식 가이드

### 코드 블록
- 트리플 백틱 사용, 반드시 언어를 지정합니다.
- 예: ` ```cpp `, ` ```python `, ` ```bash `

### 링크
- 내부 파일은 상대 경로 사용: `[빌드 가이드](build/README.md)`

---

## 코드 문서화 가이드

### Doxygen 형식 (C/C++)
- 모든 공개 함수/클래스에 Doxygen 주석 작성
- 필수 태그: `@brief`, `@param`, `@retval`, `@remark`
- 예시:
  ```cpp
  /**
   * @brief  버퍼에 데이터를 안전하게 복사합니다.
   * @param  OUT pDest    대상 버퍼 포인터
   * @param  IN  destSize 대상 버퍼 크기 (바이트)
   * @param  IN  pSrc     원본 데이터 포인터
   * @retval SUCCESS              성공
   * @retval ERROR_INVALID_PARAM  잘못된 매개변수
   */
  RESULT SafeCopy(OUT char* pDest, IN size_t destSize, IN const char* pSrc);
  ```

---

## 체크리스트

- [ ] 빌드/테스트 결과를 실제로 실행했는가?
- [ ] 링크가 상대 경로로 유효한가?
- [ ] 민감 정보가 포함되지 않았는가?

---

**마지막 업데이트**: [날짜]
**문서 버전**: 1.0
```

---

## 4. code-review.instructions.md - 코드 리뷰 가이드

<!-- 원본 출처: awesome-copilot-main-new/instructions/code-review-generic.instructions.md -->
> 범용 코드 리뷰 규칙 (보안·품질·테스트·아키텍처) + 프로젝트 특화 커널/드라이버 리뷰 항목.

### ? 원본 내용 (awesome-copilot-main-new 기반 ? 반드시 그대로 포함)

> `.github/instructions/code-review.instructions.md` 파일에 아래 내용을 **그대로** 복사하세요.
> 이후 **프로젝트 추가사항** 섹션 내용을 파일 끝에 덧붙이세요.

```markdown---
description: 'Generic code review instructions that can be customized for any project using GitHub Copilot'
applyTo: '**'
excludeAgent: ["coding-agent"]
---

# Generic Code Review Instructions

Comprehensive code review guidelines for GitHub Copilot that can be adapted to any project. These instructions follow best practices from prompt engineering and provide a structured approach to code quality, security, testing, and architecture review.

## Review Language

When performing a code review, respond in **Korean** (or specify your preferred language).

> **Customization Tip**: Change to your preferred language by replacing "English" with "Portuguese (Brazilian)", "Spanish", "French", etc.

## Review Priorities

When performing a code review, prioritize issues in the following order:

### 🔴 CRITICAL (Block merge)
- **Security**: Vulnerabilities, exposed secrets, authentication/authorization issues
- **Correctness**: Logic errors, data corruption risks, race conditions
- **Breaking Changes**: API contract changes without versioning
- **Data Loss**: Risk of data loss or corruption

### 🟡 IMPORTANT (Requires discussion)
- **Code Quality**: Severe violations of SOLID principles, excessive duplication
- **Test Coverage**: Missing tests for critical paths or new functionality
- **Performance**: Obvious performance bottlenecks (N+1 queries, memory leaks)
- **Architecture**: Significant deviations from established patterns

### 🟢 SUGGESTION (Non-blocking improvements)
- **Readability**: Poor naming, complex logic that could be simplified
- **Optimization**: Performance improvements without functional impact
- **Best Practices**: Minor deviations from conventions
- **Documentation**: Missing or incomplete comments/documentation

## General Review Principles

When performing a code review, follow these principles:

1. **Be specific**: Reference exact lines, files, and provide concrete examples
2. **Provide context**: Explain WHY something is an issue and the potential impact
3. **Suggest solutions**: Show corrected code when applicable, not just what's wrong
4. **Be constructive**: Focus on improving the code, not criticizing the author
5. **Recognize good practices**: Acknowledge well-written code and smart solutions
6. **Be pragmatic**: Not every suggestion needs immediate implementation
7. **Group related comments**: Avoid multiple comments about the same topic

## Code Quality Standards

When performing a code review, check for:

### Clean Code
- Descriptive and meaningful names for variables, functions, and classes
- Single Responsibility Principle: each function/class does one thing well
- DRY (Don't Repeat Yourself): no code duplication
- Functions should be small and focused (ideally < 20-30 lines)
- Avoid deeply nested code (max 3-4 levels)
- Avoid magic numbers and strings (use constants)
- Code should be self-documenting; comments only when necessary

### Examples
```javascript
// ❌ BAD: Poor naming and magic numbers
function calc(x, y) {
    if (x > 100) return y * 0.15;
    return y * 0.10;
}

// ✅ GOOD: Clear naming and constants
const PREMIUM_THRESHOLD = 100;
const PREMIUM_DISCOUNT_RATE = 0.15;
const STANDARD_DISCOUNT_RATE = 0.10;

function calculateDiscount(orderTotal, itemPrice) {
    const isPremiumOrder = orderTotal > PREMIUM_THRESHOLD;
    const discountRate = isPremiumOrder ? PREMIUM_DISCOUNT_RATE : STANDARD_DISCOUNT_RATE;
    return itemPrice * discountRate;
}
```

### Error Handling
- Proper error handling at appropriate levels
- Meaningful error messages
- No silent failures or ignored exceptions
- Fail fast: validate inputs early
- Use appropriate error types/exceptions

### Examples
```python
# ❌ BAD: Silent failure and generic error
def process_user(user_id):
    try:
        user = db.get(user_id)
        user.process()
    except:
        pass

# ✅ GOOD: Explicit error handling
def process_user(user_id):
    if not user_id or user_id <= 0:
        raise ValueError(f"Invalid user_id: {user_id}")

    try:
        user = db.get(user_id)
    except UserNotFoundError:
        raise UserNotFoundError(f"User {user_id} not found in database")
    except DatabaseError as e:
        raise ProcessingError(f"Failed to retrieve user {user_id}: {e}")

    return user.process()
```

## Security Review

When performing a code review, check for security issues:

- **Sensitive Data**: No passwords, API keys, tokens, or PII in code or logs
- **Input Validation**: All user inputs are validated and sanitized
- **SQL Injection**: Use parameterized queries, never string concatenation
- **Authentication**: Proper authentication checks before accessing resources
- **Authorization**: Verify user has permission to perform action
- **Cryptography**: Use established libraries, never roll your own crypto
- **Dependency Security**: Check for known vulnerabilities in dependencies

### Examples
```java
// ❌ BAD: SQL injection vulnerability
String query = "SELECT * FROM users WHERE email = '" + email + "'";

// ✅ GOOD: Parameterized query
PreparedStatement stmt = conn.prepareStatement(
    "SELECT * FROM users WHERE email = ?"
);
stmt.setString(1, email);
```

```javascript
// ❌ BAD: Exposed secret in code
const API_KEY = "sk_live_abc123xyz789";

// ✅ GOOD: Use environment variables
const API_KEY = process.env.API_KEY;
```

## Testing Standards

When performing a code review, verify test quality:

- **Coverage**: Critical paths and new functionality must have tests
- **Test Names**: Descriptive names that explain what is being tested
- **Test Structure**: Clear Arrange-Act-Assert or Given-When-Then pattern
- **Independence**: Tests should not depend on each other or external state
- **Assertions**: Use specific assertions, avoid generic assertTrue/assertFalse
- **Edge Cases**: Test boundary conditions, null values, empty collections
- **Mock Appropriately**: Mock external dependencies, not domain logic

### Examples
```typescript
// ❌ BAD: Vague name and assertion
test('test1', () => {
    const result = calc(5, 10);
    expect(result).toBeTruthy();
});

// ✅ GOOD: Descriptive name and specific assertion
test('should calculate 10% discount for orders under $100', () => {
    const orderTotal = 50;
    const itemPrice = 20;

    const discount = calculateDiscount(orderTotal, itemPrice);

    expect(discount).toBe(2.00);
});
```

## Performance Considerations

When performing a code review, check for performance issues:

- **Database Queries**: Avoid N+1 queries, use proper indexing
- **Algorithms**: Appropriate time/space complexity for the use case
- **Caching**: Utilize caching for expensive or repeated operations
- **Resource Management**: Proper cleanup of connections, files, streams
- **Pagination**: Large result sets should be paginated
- **Lazy Loading**: Load data only when needed

### Examples
```python
# ❌ BAD: N+1 query problem
users = User.query.all()
for user in users:
    orders = Order.query.filter_by(user_id=user.id).all()  # N+1!

# ✅ GOOD: Use JOIN or eager loading
users = User.query.options(joinedload(User.orders)).all()
for user in users:
    orders = user.orders
```

## Architecture and Design

When performing a code review, verify architectural principles:

- **Separation of Concerns**: Clear boundaries between layers/modules
- **Dependency Direction**: High-level modules don't depend on low-level details
- **Interface Segregation**: Prefer small, focused interfaces
- **Loose Coupling**: Components should be independently testable
- **High Cohesion**: Related functionality grouped together
- **Consistent Patterns**: Follow established patterns in the codebase

## Documentation Standards

When performing a code review, check documentation:

- **API Documentation**: Public APIs must be documented (purpose, parameters, returns)
- **Complex Logic**: Non-obvious logic should have explanatory comments
- **README Updates**: Update README when adding features or changing setup
- **Breaking Changes**: Document any breaking changes clearly
- **Examples**: Provide usage examples for complex features

## Comment Format Template

When performing a code review, use this format for comments:

```markdown
**[PRIORITY] Category: Brief title**

Detailed description of the issue or suggestion.

**Why this matters:**
Explanation of the impact or reason for the suggestion.

**Suggested fix:**
[code example if applicable]

**Reference:** [link to relevant documentation or standard]
```

### Example Comments

#### Critical Issue
````markdown
**🔴 CRITICAL - Security: SQL Injection Vulnerability**

The query on line 45 concatenates user input directly into the SQL string,
creating a SQL injection vulnerability.

**Why this matters:**
An attacker could manipulate the email parameter to execute arbitrary SQL commands,
potentially exposing or deleting all database data.

**Suggested fix:**
```sql
-- Instead of:
query = "SELECT * FROM users WHERE email = '" + email + "'"

-- Use:
PreparedStatement stmt = conn.prepareStatement(
    "SELECT * FROM users WHERE email = ?"
);
stmt.setString(1, email);
```

**Reference:** OWASP SQL Injection Prevention Cheat Sheet
````

#### Important Issue
````markdown
**🟡 IMPORTANT - Testing: Missing test coverage for critical path**

The `processPayment()` function handles financial transactions but has no tests
for the refund scenario.

**Why this matters:**
Refunds involve money movement and should be thoroughly tested to prevent
financial errors or data inconsistencies.

**Suggested fix:**
Add test case:
```javascript
test('should process full refund when order is cancelled', () => {
    const order = createOrder({ total: 100, status: 'cancelled' });

    const result = processPayment(order, { type: 'refund' });

    expect(result.refundAmount).toBe(100);
    expect(result.status).toBe('refunded');
});
```
````

#### Suggestion
````markdown
**🟢 SUGGESTION - Readability: Simplify nested conditionals**

The nested if statements on lines 30-40 make the logic hard to follow.

**Why this matters:**
Simpler code is easier to maintain, debug, and test.

**Suggested fix:**
```javascript
// Instead of nested ifs:
if (user) {
    if (user.isActive) {
        if (user.hasPermission('write')) {
            // do something
        }
    }
}

// Consider guard clauses:
if (!user || !user.isActive || !user.hasPermission('write')) {
    return;
}
// do something
```
````

## Review Checklist

When performing a code review, systematically verify:

### Code Quality
- [ ] Code follows consistent style and conventions
- [ ] Names are descriptive and follow naming conventions
- [ ] Functions/methods are small and focused
- [ ] No code duplication
- [ ] Complex logic is broken into simpler parts
- [ ] Error handling is appropriate
- [ ] No commented-out code or TODO without tickets

### Security
- [ ] No sensitive data in code or logs
- [ ] Input validation on all user inputs
- [ ] No SQL injection vulnerabilities
- [ ] Authentication and authorization properly implemented
- [ ] Dependencies are up-to-date and secure

### Testing
- [ ] New code has appropriate test coverage
- [ ] Tests are well-named and focused
- [ ] Tests cover edge cases and error scenarios
- [ ] Tests are independent and deterministic
- [ ] No tests that always pass or are commented out

### Performance
- [ ] No obvious performance issues (N+1, memory leaks)
- [ ] Appropriate use of caching
- [ ] Efficient algorithms and data structures
- [ ] Proper resource cleanup

### Architecture
- [ ] Follows established patterns and conventions
- [ ] Proper separation of concerns
- [ ] No architectural violations
- [ ] Dependencies flow in correct direction

### Documentation
- [ ] Public APIs are documented
- [ ] Complex logic has explanatory comments
- [ ] README is updated if needed
- [ ] Breaking changes are documented

## Project-Specific Customizations

To customize this template for your project, add sections for:

1. **Language/Framework specific checks**
   - Example: "When performing a code review, verify React hooks follow rules of hooks"
   - Example: "When performing a code review, check Spring Boot controllers use proper annotations"

2. **Build and deployment**
   - Example: "When performing a code review, verify CI/CD pipeline configuration is correct"
   - Example: "When performing a code review, check database migrations are reversible"

3. **Business logic rules**
   - Example: "When performing a code review, verify pricing calculations include all applicable taxes"
   - Example: "When performing a code review, check user consent is obtained before data processing"

4. **Team conventions**
   - Example: "When performing a code review, verify commit messages follow conventional commits format"
   - Example: "When performing a code review, check branch names follow pattern: type/ticket-description"

## Additional Resources

For more information on effective code reviews and GitHub Copilot customization:

- [GitHub Copilot Prompt Engineering](https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering)
- [GitHub Copilot Custom Instructions](https://code.visualstudio.com/docs/copilot/customization/custom-instructions)
- [Awesome GitHub Copilot Repository](https://github.com/github/awesome-copilot)
- [GitHub Code Review Guidelines](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests)
- [Google Engineering Practices - Code Review](https://google.github.io/eng-practices/review/)
- [OWASP Security Guidelines](https://owasp.org/)

## Prompt Engineering Tips

When performing a code review, apply these prompt engineering principles from the [GitHub Copilot documentation](https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering):

1. **Start General, Then Get Specific**: Begin with high-level architecture review, then drill into implementation details
2. **Give Examples**: Reference similar patterns in the codebase when suggesting changes
3. **Break Complex Tasks**: Review large PRs in logical chunks (security → tests → logic → style)
4. **Avoid Ambiguity**: Be specific about which file, line, and issue you're addressing
5. **Indicate Relevant Code**: Reference related code that might be affected by changes
6. **Experiment and Iterate**: If initial review misses something, review again with focused questions

## Project Context

This is a generic template. Customize this section with your project-specific information:

- **Tech Stack**: [e.g., Java 17, Spring Boot 3.x, PostgreSQL]
- **Architecture**: [e.g., Hexagonal/Clean Architecture, Microservices]
- **Build Tool**: [e.g., Gradle, Maven, npm, pip]
- **Testing**: [e.g., JUnit 5, Jest, pytest]
- **Code Style**: [e.g., follows Google Style Guide]```

### ? 프로젝트 추가사항 (파일 끝에 덧붙임)

```markdown
---
# [프로젝트명] 코드 리뷰 ? 프로젝트 특화 추가 항목

> applyTo 재정의: `applyTo: '**/*.{c,cpp,h,hpp}'`
> 리뷰 언어: **한국어**

## 사전 준비 (필수)

코드 리뷰 시작 전 반드시 다음 파일을 읽어야 합니다:
1. `.github/code-style-guide.md` ? 프로젝트 코딩 스타일 가이드
2. `.github/instructions/security-patterns.instructions.md` ? 보안 코딩 패턴

## 커널 모드 드라이버 보안 검사 (CRITICAL)

- `driver` 키워드가 있는 경우 kernel device driver로 간주하고 IRQL 등 커널 주의점을 중점 리뷰합니다.
- IRQL(Interrupt Request Level) 호출 규칙 준수 확인 (PASSIVE_LEVEL, DISPATCH_LEVEL 등)
- 커널 메모리 접근 시 `ProbeForRead/ProbeForWrite` 사용 여부 확인
- 사용자 모드 포인터 직접 접근 금지 ? `__try/__except` 블록 사용 확인
- Paged/Non-paged Pool 메모리 할당 적절성 검사

## 메모리 안전성 검사 (CRITICAL)

- **버퍼 오버플로우**: 메모리 over/under flow 및 문자열 끝 메모리 침범 가능성 리뷰
- **위험 함수 금지**: `strcpy`, `sprintf`, `strcat` → 안전한 대체 함수 사용 확인
- **배열 인덱스 경계 검사**: 범위 초과 여부 확인
- **메모리 누수**: malloc/new-free/delete 쌍 확인, RAII 패턴 권장
- **이중 해제(Double Free)**: 동일 메모리 중복 해제 방지

## 동시성 및 스레드 안전성 검사 (CRITICAL)

- **데드락**: 기본적으로 multithread 환경이므로 deadlock 체크 필수
- **Race Condition**: 공유 자원 접근 시 동기화 메커니즘 확인
- **Lock 순서 일관성**: 여러 락 사용 시 동일한 순서로 획득/해제

## 반복문 안전성 검사 (IMPORTANT)

- **무한 루프 방지**: 루프에서 overflow가 일어나지 않는지, 무한 루프 가능성 체크
- **루프 종료 조건**: 명확한 종료 조건 및 진행 상황 확인

## 프로젝트 체크리스트 (추가)

- [ ] 드라이버/서비스 경계에서 권한 상승 위험 없는가?
- [ ] IPC(Named Pipe, RPC) 데이터 검증이 충분한가?
- [ ] IRQL 레벨이 코드 영역에 적합한가?
- [ ] 로그(ERRORLOG/WARNLOG)가 PII나 민감정보를 포함하지 않는가?
```

---

## 5. function-generation.instructions.md - 함수 생성 가이드

<!-- 원본 출처: github_origin/prompts/function-generation.prompt.md (instruction 변환) -->
<!-- awesome-copilot-main-new 미포함 ? github_origin 기반 -->
> ASD Engine 코딩 컨벤션에 맞는 함수 생성 규칙. Hungarian Notation, Doxygen 문서화, 에러 처리 패턴 포함.

### ? 원본 내용 (github_origin 기반 ? 반드시 그대로 포함)

> `.github/instructions/function-generation.instructions.md` 파일에 아래 내용을 **그대로** 복사하세요.
> 이후 **프로젝트 추가사항** 섹션 내용을 파일 끝에 덧붙이세요.

```markdown---
agent: agent
description: 'ASD Engine 코딩 표준에 맞는 함수를 생성합니다.'
tools: ['codebase', 'usages', 'vscodeAPI', 'problems', 'changes', 'testFailure', 'terminalSelection', 'terminalLastCommand', 'openSimpleBrowser', 'fetch', 'findTestFiles', 'searchResults', 'githubRepo', 'runTests', 'editFiles', 'runNotebooks', 'search', 'runCommands', 'runTasks']
---

- 다음 사항을 중점적으로 수행하여 함수를 생성한다.

## 🎯 ASD Engine 표준 함수 생성
- ALWAYS: .github/code-style-guide.md의 모든 코딩 스타일 규칙을 완벽히 준수한다.
- Hungarian Notation 필수 적용: 매개변수 타입 접두사(dw, psz, n, b 등) 사용
- 함수 매개변수 방향 지시자 필수: IN, OUT, IN OUT 명시
- return 문 괄호 필수: return( dwResult ); 형태
- TAB 들여쓰기 사용 (SPACE 절대 금지)
- 조건문 괄호 공백: if( condition ), while( test ) 형태

## 🔧 함수 헤더 및 문서화 (필수)
- ALWAYS: Doxygen 주석 형식으로 함수 헤더 작성
- @brief, @param, @retval, @remark 태그 포함
- 모든 매개변수와 반환값에 대한 상세 설명
- 함수의 목적과 동작 방식 명시
- 에러 조건 및 예외 사항 문서화


## 🛡️ 보안 및 안정성 요구사항
- ALWAYS: 모든 함수 매개변수에 대한 NULL 포인터 검사
- 버퍼 오버플로우 방지: 문자열 길이, 배열 경계 검사 필수
- co_error.h의 표준 에러 코드 사용: ERR_ATX_INVALID_PARAM, ERR_ATX_OUT_OF_MEMORY 등
- 입력 데이터 검증: 범위, 형식, 크기 제한 확인
- 메모리 할당 실패 시 적절한 에러 처리
- 리소스 누수 방지: 할당한 메모리, 핸들, 소켓 등 정리

## 🚀 ASD Engine 특화 함수 생성
- HTTP/2 프로토콜 처리: nghttp2 라이브러리 활용, HPACK 디코딩
- SSL/TLS 보안 통신: OpenSSL 라이브러리, 인증서 검증
- 네트워크 프록시: 세션 관리, 연결 중계, 트래픽 분석
- 멀티플랫폼 지원: Windows/Linux/macOS 호환성 고려
- 커널 드라이버 통신: DeviceIoControl, 버퍼 관리

## 🔄 멀티스레드 안전성
- ALWAYS: 공유 리소스 접근 시 동기화 고려
- Critical Section, Mutex 등 동기화 객체 활용
- 원자적 연산 사용으로 데이터 레이스 방지
- 데드락 방지를 위한 락 순서 정의
- 스레드 안전한 함수 호출 보장

## � 에러 처리 및 리소스 관리
- do{ ... } while( FALSE ); 사용 권장 ( goto는 차선택 )
- 모든 할당된 리소스 해제: 메모리, 핸들, 소켓 등
- 에러 로깅: ERRORLOG, WARNLOG 매크로 사용
- 방어적 프로그래밍: 예상치 못한 상황에 대한 대비

## 🎯 함수 생성 템플릿 예시
```cpp
DWORD FunctionName( IN LPCSTR pszInput, IN UINT uInputSize, OUT PUCHAR pOutput, IN OUT PUINT puOutputSize )
/**
*	@brief	함수의 목적과 동작을 설명
*   @param	IN 	LPCSTR		pszInput		입력 데이터 포인터
*   @param	IN 	UINT		uInputSize		입력 데이터 크기
*   @param	OUT	PUCHAR		pOutput			출력 버퍼 포인터
*   @param	IN	OUT PUINT	puOutputSize	입출력 버퍼 크기
*	@retval	ERROR_SUCCESS 성공
*	@retval	ERROR_INVALID_PARAMETER 잘못된 매개변수
*	@retval	ERROR_INSUFFICIENT_BUFFER 버퍼 부족
*	@remark	특별히 주의할 사항이나 사용법 설명
*/
{
	DWORD dwRet = ERROR_SUCCESS;
	
	do
	{
		// 매개변수 검증
		if( (NULL == pszInput) || (0 == uInputSize) || (NULL == pOutput) || (NULL == puOutputSize) )
		{
			dwRet = ERROR_INVALID_PARAMETER;
			break;
		}
		
		// 함수 로직 구현
		// ...

	} while( FALSE );
	
	return( dwRet );
}
```

- ALWAYS: 함수 생성은 완전한 구현체를 제공하고 단순한 선언이나 템플릿만 제공하지 않는다.
- 모든 생성된 함수는 즉시 컴파일 가능하고 실행 가능한 수준으로 작성한다.
- ASD Engine의 기존 코드 패턴과 일관성을 유지하며 프로젝트 표준을 준수한다.```

### ? 프로젝트 추가사항 (파일 끝에 덧붙임)

```markdown
<!--
## [프로젝트명] 특화 설정 (필요한 경우에만 추가)

### 추가 제약사항
- [예: "특정 모듈에서는 IRQL 제약으로 PASSIVE_LEVEL 이상 코드 금지"]
- [예: "플랫폼별 분기 필요 시 #ifdef PLATFORM_WINDOWS 사용"]

### 추가 함수 템플릿
- [예: "비동기 콜백 함수는 별도 Doxygen @callback 태그 추가"]
-->
```

---

**사용법**: 위 내용을 개별 `.instructions.md` 파일로 분리하여 `.github/instructions/` 폴더에 저장하세요.