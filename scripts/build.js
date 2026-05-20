#!/usr/bin/env node
// Cloudflare Pages 빌드 시 KAKAO_MAP_KEY 환경변수로 js/config.js를 생성합니다.
// 로컬 개발 시에는 js/config.js를 직접 편집하세요.

const fs   = require('fs');
const path = require('path');

const key    = process.env.KAKAO_MAP_KEY;
const dest   = path.join(__dirname, '..', 'js', 'config.js');
const exists = fs.existsSync(dest);

if (!key) {
  if (exists) {
    // 로컬 환경: 기존 config.js 유지
    console.log('[build] KAKAO_MAP_KEY 미설정 → 기존 js/config.js 사용');
  } else {
    console.error('[build] ERROR: KAKAO_MAP_KEY 환경변수가 설정되지 않았습니다.');
    console.error('         CF Pages 대시보드 → Settings → Environment variables 에서 추가하세요.');
    process.exit(1);
  }
  process.exit(0);
}

// 단순 문자열이어야 할 키에 코드 삽입 방지
if (!/^[A-Za-z0-9]+$/.test(key)) {
  console.error('[build] ERROR: KAKAO_MAP_KEY에 허용되지 않는 문자가 포함되어 있습니다.');
  process.exit(1);
}

fs.writeFileSync(dest, 'window.KAKAO_MAP_KEY = \'' + key + '\';\n', 'utf8');
console.log('[build] js/config.js 생성 완료');
