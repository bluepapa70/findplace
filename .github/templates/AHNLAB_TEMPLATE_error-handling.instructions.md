# Instructions 템플릿 ? 에러 처리 패턴

> 이 파일을 프로젝트에 맞게 수정하여 `.github/instructions/error-handling.instructions.md`에 저장하세요.
> `[대괄호]` 안의 내용을 실제 값으로 교체하세요.
> **? 원본 내용** 블록을 파일에 그대로 복사한 후, **? 프로젝트 추가사항** 블록을 파일 끝에 덧붙이세요.

---

## error-handling.instructions.md ? 에러 처리 패턴

<!-- 원본 출처: 내부 개발 ? C/C++ 표준 에러 처리 패턴 -->
> 반환 코드 기반 에러 처리, 리소스 관리, 에러 전파, 입력 검증, 보안 처리 표준 패턴을 포함합니다.

### ? 원본 내용 (범용 → 반드시 그대로 포함)

> `.github/instructions/error-handling.instructions.md` 파일에 아래 내용을 **그대로** 복사하세요.
> 이후 **프로젝트 추가사항** 섹션 내용을 파일 끝에 덧붙이세요.

````markdown
---
description: '[프로젝트명] 에러 처리 표준 패턴'
applyTo: '[적용 대상 glob 패턴]'
---

# 에러 처리 표준 패턴

## ? 개요

[프로젝트명]의 표준 에러 처리 패턴과 가이드라인입니다.
일관된 에러 처리를 통해 시스템의 안정성과 유지보수성을 향상시킵니다.
아래 패턴은 [언어/런타임]에 맞게 적용합니다.

---

## ? 기본 원칙

### 1. 예측 가능한 에러 처리
- 모든 함수는 명확한 반환값으로 성공/실패를 나타냅니다 (`DWORD`, `HRESULT`, `enum` 등)
- 에러 코드는 표준화된 값을 사용합니다
- 예외 상황은 반드시 처리하거나 상위로 전파합니다

### 2. 리소스 안전성
- 모든 할당된 리소스는 반드시 해제합니다
- RAII 패턴, `wil::scope_exit`, `try-finally` 활용
- **goto 정리 패턴 (C)**: 멀티 리소스 정리 시 `_CLEANUP` 레이블 사용 권장
- 에러 경로에서도 정리 코드 실행 보장

### 3. 정보성 에러 처리
- 에러 발생 시 충분한 컨텍스트 정보를 제공합니다
- 로깅을 통해 디버깅 정보를 남깁니다
- 사용자에게는 적절한 수준의 에러 메시지를 제공합니다 (내부 에러는 숨김)

---

## ? 표준 패턴

### 패턴 1: 에러 코드 반환 + do-while(FALSE) 구조 (C 스타일)
```[언어]
// do-while(FALSE) 구조: 단일 구조에서 리소스 정리 보장
// RESULT ProcessData(IN param1, OUT result)
// {
//     RESULT ret = SUCCESS;
//     void*  pBuf = NULL;
//
//     do
//     {
//         // 입력 검증
//         if (!param1) { ret = ERROR_INVALID_PARAM; break; }
//
//         // 리소스 할당
//         pBuf = malloc(SIZE);
//         if (!pBuf) { ret = ERROR_OUT_OF_MEMORY; break; }
//
//         // 작업 수행
//         ret = DoWork(pBuf, param1);
//     } while (FALSE);
//
//     // 정리 코드 (항상 실행)
//     if (pBuf) { free(pBuf); pBuf = NULL; }
//
//     return ret;
// }
```

### 패턴 2: 예외 처리 (C++/Java/Python 스타일)
```[언어]
// try-catch-finally 구조
// try
// {
//     auto payload = LoadConfig(path);
//     ApplyConfig(payload);
// }
// catch (const std::exception& ex)
// {
//     LOG_ERROR("[Module] config load failed: %s", ex.what());
//     throw;  // 상위 레이어에 메시지 포함된 예외 전파
// }
// // finally 대체: RAII 소멸자 또는 scope_exit으로 자동 정리
```

### 패턴 3: RAII 자동 리소스 관리 (C++)
```[언어]
// RAII 래퍼 클래스 정의 (핸들/파일 등 시스템 리소스)
// class AutoHandle
// {
//     HANDLE m_h;
// public:
//     AutoHandle(HANDLE h = INVALID_HANDLE_VALUE) : m_h(h) {}
//     ~AutoHandle() { if (m_h != INVALID_HANDLE_VALUE) CloseHandle(m_h); }
//     operator HANDLE() const { return m_h; }
// };
//
// 사용 예:
// AutoHandle hFile(CreateFile(name, GENERIC_READ, 0, NULL, OPEN_EXISTING, 0, NULL));
// if (hFile == INVALID_HANDLE_VALUE) return GetLastError();
// // 함수 종료 시 자동 CloseHandle 호출
```

### 패턴 4: goto 정리 패턴 (C, 멀티 리소스)
```[언어]
// goto 정리 패턴 사용 (C에서 멀티 리소스 정리 권장)
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

### 패턴 5: 에러 전파 (체인 처리)
```[언어]
// 에러 전파 원칙:
// - 하위 레이어 에러 코드를 그대로 전파하거나, 상위 의미로 변환
// - 에러 변환 시 원본 에러는 로그에 기록
// RESULT HighLevel()
// {
//     RESULT ret = MidLevel();
//     if (ret != SUCCESS)
//     {
//         LOG_ERROR("[HighLevel] MidLevel failed: 0x%08X", ret);
//         if (ret == ERROR_OOM) return APP_ERROR_RESOURCE;  // 의미론적 변환 예
//     }
//     return ret;
// }
```

### 패턴 6: 입력 검증 패턴 (방어적 처리)
```[언어]
// 함수 최상위에서 즉시 입력 검증 실행
// RESULT Process(IN const char* input, IN size_t inputLen, OUT char* output, IN OUT size_t* outLen)
// {
//     // NULL 포인터 검사
//     if (!input || !output || !outLen) return ERROR_INVALID_PARAM;
//     // 길이 범위 검사
//     if (inputLen == 0 || inputLen > MAX_INPUT) return ERROR_INVALID_PARAM;
//     // 출력 버퍼 최소 크기 검사
//     if (*outLen < MIN_OUTPUT) { *outLen = MIN_OUTPUT; return ERROR_BUFFER_TOO_SMALL; }
//     // null-termination 검사 (문자열)
//     if (strnlen(input, inputLen) >= inputLen) return ERROR_INVALID_PARAM;
//     ...
// }
```

### 패턴 7: 보안 특화 에러 처리
```[언어]
// 1. 타이밍 공격 방지: 성공/실패를 동일 시간으로 처리
// if (!userExists || !passwordValid)
// {
//     Sleep(BASE_DELAY + rand() % JITTER);  // 의도적 지연
//     return AUTH_FAILURE;  // 동일한 에러 코드 반환
// }
//
// 2. 민감한 데이터 처리 후 반드시 초기화
// char szSensitiveData[MAX_SIZE] = {0};
// ... // 처리
// SecureZeroMemory(szSensitiveData, sizeof(szSensitiveData));  // 반드시 초기화
```

### 패턴 8: Fast Fail (조기 반환)
```[언어]
// Fast Fail 원칙: 잘못된 상태 시 조기 종료 (중첩 if 최소화)
// RESULT Process(IN Param* p)
// {
//     if (!p)              return ERROR_INVALID_PARAM;  // 조기 종료
//     if (!p->data)        return ERROR_INVALID_PARAM;
//     if (p->size > MAX)   return ERROR_OVERFLOW;
//
//     // 여기서부터 유효한 상태가 보장된 상태로 처리
//     return DoActualWork(p);
// }
```

---

## ? 로깅

### 로그 레벨 사용 기준

| 레벨  | 용도 |
|-------|------|
| ERROR | 복구 불가능한 오류, 데이터 손실 위험 |
| WARN  | 경고 조건, 처리는 계속 |
| INFO  | 주요 상태 변경, 시작/종료/완료 |
| DEBUG | 세부 흐름 (기본값 OFF) |

### 로그 형식

```
[LEVEL] [timestamp] [module] message (context)
```

---

## ? 체크리스트

### 함수 작성 시
- [ ] 모든 입력/출력/핸들에 대한 NULL 체크
- [ ] 리소스 할당-해제 쌍이 대칭인가?
- [ ] 에러 시 적절한 에러 코드를 반환하는가?
- [ ] 로깅이 식별화되고 충분한가?
- [ ] 민감한 데이터를 처리 후 반드시 초기화하는가?

### 코드 리뷰 시
- [ ] 에러 경로의 리소스 누수 여부
- [ ] 사용자에게 반환되는 메시지에 내부 에러 정보가 포함되지 않는가?
- [ ] 에러 전파 시 원본 에러 정보가 로그에 보존되는가?

---

**마지막 업데이트**: [날짜]
**문서 버전**: 1.0
````

---

### ? 프로젝트 추가사항 (파일 끝에 덧붙임)

````markdown
---
# [프로젝트명] 에러 처리 패턴 ? 프로젝트 특화 추가 규칙

> applyTo 재정의 (프로젝트 언어에 맞게 조정):
> 예: `applyTo: '**/*.{c,cpp,h,hpp}'` (C/C++), `'**/*.py'` (Python), `'**/*.ts'` (TypeScript)

---

## 표준 에러 코드 체계

### 에러 코드 정의 파일

프로젝트의 표준 에러 코드는 **`[에러코드_헤더파일]`** 파일의 `[에러코드_열거형명]` 열거형을 참조하십시오.

> 예: `Src/Inc/co_error.h` → `ERR_ATX_ERROR_CODE`

### 반환 타입 및 성공값

| 항목 | 값 |
|------|----|
| 표준 에러 반환 타입 | `[에러결과타입]` |
| 성공 반환값 | `[성공코드]` |

### 주요 에러 코드

| 에러 코드 | 설명 |
|-----------|------|
| `[에러코드_접두사]_NOERROR` | 성공 (0x00000000) |
| `[에러코드_접두사]_PENDING` | 지연된 동작 |
| `[에러코드_접두사]_TIMEOUT` | 시간 초과 |
| `[에러코드_접두사]_INVALID_PARAM` | 잘못된 매개변수 |
| `[에러코드_접두사]_OUT_OF_MEMORY` | 메모리 부족 |
| `[에러코드_접두사]_FUNCTION_FAILED` | 함수 실행 실패 |
| `[에러코드_접두사]_NOT_FOUND` | 리소스를 찾을 수 없음 |
| `[에러코드_접두사]_ACCESS_DENIED` | 접근 권한 없음 |

**전체 에러 코드 목록**: `[에러코드_헤더파일]` 파일 참조

### 에러 심각도 확인 매크로 (해당 시)

```cpp
// ? 에러 심각도 확인 매크로 활용
if( [에러코드_접두사]_ERROR( result ) )
{
	[로그매크로_ERROR]( TEXT("[Function] Critical error: 0x%08X"), result );
}
else if( [에러코드_접두사]_WARNING( result ) )
{
	[로그매크로_WARN]( TEXT("[Function] Warning: 0x%08X"), result );
}
```

---

## 프로젝트 로깅 매크로

| 레벨  | 매크로 |
|-------|--------|
| ERROR | `[로그매크로_ERROR]( TEXT("...") )` |
| WARN  | `[로그매크로_WARN]( TEXT("...") )` |
| INFO  | `[로그매크로_INFO]( TEXT("...") )` |
| DEBUG | `[로그매크로_DEBUG]( TEXT("...") )` |

---

## 에러 코드 반환 패턴 예시 (프로젝트 코드)

```cpp
// ? 프로젝트 표준 에러 처리 패턴
[에러결과타입] ProcessData( IN PUCHAR pInput, IN UINT uInputLen )
{
	[에러결과타입]	result	= [성공코드];
	PUCHAR			pBuf	= NULL;

	do
	{
		if( (NULL == pInput) || (0 == uInputLen) )
		{
			result = [에러코드_접두사]_INVALID_PARAM;
			break;
		}

		pBuf = (PUCHAR)malloc( BUFFER_SIZE );
		if( NULL == pBuf )
		{
			result = [에러코드_접두사]_OUT_OF_MEMORY;
			break;
		}

		result = DoSomeWork( pBuf, pInput, uInputLen );
	} while( FALSE );

	if( NULL != pBuf )
	{
		free( pBuf );
		pBuf = NULL;
	}

	return( result );
}
```

### 에러 체인 처리

```cpp
// ? 에러 정보 보존 전파
[에러결과타입] HighLevelFunction( void )
{
	[에러결과타입]	result = [성공코드];

	result = MidLevelFunction();
	if( [성공코드] != result )
	{
		[로그매크로_ERROR]( TEXT("[HighLevelFunction] MidLevelFunction failed: 0x%08X"), result );

		// 에러 코드 변환이 필요한 경우
		if( [에러코드_접두사]_OUT_OF_MEMORY == result )
		{
			result = [에러코드_접두사]_FUNCTION_FAILED;
		}

		return( result );
	}

	return( result );
}
```

---

## 보안 중심 에러 처리 (프로젝트 특화)

### 정보 노출 방지

```cpp
// ? 내부 에러는 로그에만, 외부에는 일반적인 응답 반환
[에러결과타입] AuthenticateUser( IN LPCSTR pszUsername, IN LPCSTR pszPassword )
{
	[에러결과타입]	result			= [성공코드];
	BOOL			bUserExists		= FALSE;
	BOOL			bPasswordValid	= FALSE;

	result = CheckUserExists( pszUsername, &bUserExists );
	if( [성공코드] != result )
	{
		[로그매크로_ERROR]( TEXT("[AuthenticateUser] CheckUserExists failed: 0x%08X"), result );
		return( [에러코드_접두사]_ACCESS_DENIED );	// 내부 에러 → 일반 응답
	}

	if( TRUE == bUserExists )
	{
		result = ValidatePassword( pszUsername, pszPassword, &bPasswordValid );
		if( [성공코드] != result )
		{
			[로그매크로_ERROR]( TEXT("[AuthenticateUser] ValidatePassword failed: 0x%08X"), result );
			return( [에러코드_접두사]_ACCESS_DENIED );
		}
	}

	// 타이밍 공격 방지: 사용자 존재 여부와 무관하게 동일한 응답
	if( (FALSE == bUserExists) || (FALSE == bPasswordValid) )
	{
		Sleep( 100 + (rand() % 50) );
		return( [에러코드_접두사]_ACCESS_DENIED );
	}

	return( [성공코드] );
}
```

### 민감한 데이터 안전 초기화

```cpp
// ? SecureZeroMemory로 민감한 데이터 안전 삭제
CHAR	szSensitiveData[64]	= {0};
// ... 처리 ...
SecureZeroMemory( szSensitiveData, sizeof(szSensitiveData) );
```

---

## 성능 고려사항

### 에러 코드 캐싱 (반복 검사 최적화)

```cpp
// ? 반복적인 에러 상황 최적화 (예: 네트워크 상태 캐싱)
static [에러결과타입]	s_cachedError		= [성공코드];
static DWORD			s_cacheTimestamp	= 0;

[에러결과타입] GetCachedStatus( void )
{
	DWORD dwNow = GetTickCount();

	if( ([성공코드] != s_cachedError) &&
		((dwNow - s_cacheTimestamp) < CACHE_TIMEOUT_MS) )
	{
		return( s_cachedError );	// 캐시된 에러 반환
	}

	[에러결과타입] result = CheckActualStatus();
	if( [성공코드] != result )
	{
		s_cachedError		= result;
		s_cacheTimestamp	= dwNow;
	}
	else
	{
		s_cachedError = [성공코드];
	}

	return( result );
}
```

---

**마지막 업데이트**: [날짜]
**문서 버전**: 2.0-beta
````
