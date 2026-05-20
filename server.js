// 선택적 Express 프록시 서버 — 카카오 로컬 REST API 중계
// 향후 실제 평점/리뷰 데이터가 필요할 때 이 서버를 통해 연동합니다.
// Node.js 18 이상 필요 (내장 fetch 사용)

const express = require('express');
const path    = require('path');
require('dotenv').config();

const app = express();

// 정적 파일 서빙 (index.html, css/, js/ 등)
app.use(express.static(path.join(__dirname)));

// 카카오 로컬 API 프록시 엔드포인트
app.get('/api/restaurants', async (req, res) => {
  const { lat, lng, radius = '1000' } = req.query;

  // 입력값 검증
  const latF    = parseFloat(lat);
  const lngF    = parseFloat(lng);
  const radiusI = Math.min(parseInt(radius, 10) || 1000, 5000);

  if (!lat || !lng || isNaN(latF) || isNaN(lngF)
      || latF < -90 || latF > 90 || lngF < -180 || lngF > 180) {
    return res.status(400).json({ error: '유효하지 않은 좌표입니다.' });
  }

  const restKey = process.env.KAKAO_REST_KEY;
  if (!restKey) {
    return res.status(500).json({ error: 'KAKAO_REST_KEY 환경변수가 설정되지 않았습니다.' });
  }

  const url = new URL('https://dapi.kakao.com/v2/local/search/category.json');
  url.searchParams.set('category_group_code', 'FD6');
  url.searchParams.set('x', lngF);
  url.searchParams.set('y', latF);
  url.searchParams.set('radius', radiusI);
  url.searchParams.set('sort', 'distance');
  url.searchParams.set('size', '15');

  try {
    const response = await fetch(url.toString(), {
      headers: { Authorization: 'KakaoAK ' + restKey }
    });

    if (!response.ok) {
      throw new Error('카카오 API 응답 오류: ' + response.status);
    }

    const data = await response.json();
    res.json({ restaurants: data.documents || [] });
  } catch (err) {
    console.error('[Server] 카카오 API 호출 실패:', err.message);
    res.status(502).json({ error: '맛집 정보를 가져올 수 없습니다.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('FindPlace 서버 실행 중: http://localhost:' + PORT);
});
