// Cloudflare Pages Function — 카카오 로컬 REST API 프록시
// 배포 경로: /api/restaurants?lat=...&lng=...&radius=...
// 런타임 환경변수 KAKAO_REST_KEY는 CF Pages 대시보드 Secrets에서 설정합니다.

export async function onRequestGet({ request, env }) {
  const { searchParams } = new URL(request.url);

  const latRaw    = searchParams.get('lat');
  const lngRaw    = searchParams.get('lng');
  const radiusRaw = searchParams.get('radius') || '1000';

  const latF    = parseFloat(latRaw);
  const lngF    = parseFloat(lngRaw);
  const radiusI = Math.min(parseInt(radiusRaw, 10) || 1000, 5000);

  if (!latRaw || !lngRaw || isNaN(latF) || isNaN(lngF)
      || latF < -90 || latF > 90 || lngF < -180 || lngF > 180) {
    return jsonResponse({ error: '유효하지 않은 좌표입니다.' }, 400);
  }

  const restKey = env.KAKAO_REST_KEY;
  if (!restKey) {
    return jsonResponse({ error: 'KAKAO_REST_KEY 환경변수가 설정되지 않았습니다.' }, 500);
  }

  const kakaoUrl = new URL('https://dapi.kakao.com/v2/local/search/category.json');
  kakaoUrl.searchParams.set('category_group_code', 'FD6');
  kakaoUrl.searchParams.set('x', lngF);
  kakaoUrl.searchParams.set('y', latF);
  kakaoUrl.searchParams.set('radius', radiusI);
  kakaoUrl.searchParams.set('sort', 'distance');
  kakaoUrl.searchParams.set('size', '15');

  try {
    const res = await fetch(kakaoUrl.toString(), {
      headers: { Authorization: 'KakaoAK ' + restKey }
    });

    if (!res.ok) {
      throw new Error('카카오 API HTTP ' + res.status);
    }

    const data = await res.json();
    return jsonResponse({ restaurants: data.documents || [] });
  } catch (err) {
    console.error('[CF Function] 카카오 API 호출 실패:', err.message);
    return jsonResponse({ error: '맛집 정보를 가져올 수 없습니다.' }, 502);
  }
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
}
