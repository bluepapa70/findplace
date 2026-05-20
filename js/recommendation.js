// 추천 점수 계산 및 상위 맛집 선정 모듈
//
// 카카오 Places API는 평점 데이터를 직접 제공하지 않습니다.
// 현재는 place ID 기반 결정적(deterministic) 의사 평점을 사용하며,
// 실제 서비스에서는 server.js를 통해 외부 평점 API를 연동해 교체하세요.

var Recommendation = (function () {

  // 동일한 문자열에 대해 항상 같은 정수를 반환하는 해시 함수
  function _hash(str) {
    var h = 0;
    for (var i = 0; i < str.length; i++) {
      h = Math.imul(31, h) + str.charCodeAt(i) | 0;
    }
    return Math.abs(h);
  }

  // 3.5 ~ 5.0 범위의 결정적 의사 평점 (소수점 1자리)
  function _pseudoRating(placeId) {
    return parseFloat((3.5 + (_hash(String(placeId)) % 16) * 0.1).toFixed(1));
  }

  // 20 ~ 500 범위의 결정적 의사 리뷰 수
  function _pseudoReviewCount(placeId) {
    return 20 + (_hash(String(placeId) + '_reviews') % 481);
  }

  // 추천 점수 공식:
  //   score = rating × log10(reviewCount + 1) × (0.4 + 0.6 × distanceFactor)
  //   distanceFactor = 1 - (distance / maxDistance)  → 가까울수록 1에 가까움
  function _calcScore(restaurant, maxDistance) {
    var rating      = restaurant.rating      != null ? restaurant.rating      : _pseudoRating(restaurant.id);
    var reviewCount = restaurant.reviewCount != null ? restaurant.reviewCount : _pseudoReviewCount(restaurant.id);
    var distance    = restaurant.distance || 0;
    var df          = maxDistance > 0 ? Math.max(0, 1 - distance / maxDistance) : 1;

    var score = rating * Math.log10(reviewCount + 1) * (0.4 + 0.6 * df);
    return Math.round(score * 100) / 100;
  }

  // 상위 count개 추천 맛집 반환 (기본 3개)
  function getTop(restaurants, count) {
    if (!restaurants || restaurants.length === 0) return [];

    var maxDist = restaurants.reduce(function (m, r) {
      return Math.max(m, r.distance || 0);
    }, 0);

    return restaurants
      .map(function (r) {
        var rating      = _pseudoRating(r.id);
        var reviewCount = _pseudoReviewCount(r.id);
        return Object.assign({}, r, {
          rating:      rating,
          reviewCount: reviewCount,
          score:       _calcScore({ id: r.id, distance: r.distance, rating: rating, reviewCount: reviewCount }, maxDist)
        });
      })
      .sort(function (a, b) { return b.score - a.score; })
      .slice(0, count || 3);
  }

  return { getTop: getTop };
})();
