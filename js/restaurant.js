// 카카오 Places 서비스를 통한 주변 음식점 검색 및 데이터 파싱 모듈

var Restaurant = (function () {
  var CATEGORY_CODE = 'FD6'; // 카카오 음식점 카테고리 코드
  var DEFAULT_RADIUS = 1000;  // 검색 반경 (미터)
  var MAX_SIZE = 15;           // 최대 검색 결과 수

  function searchNearby(lat, lng, radius) {
    return new Promise(function (resolve, reject) {
      var ps = new kakao.maps.services.Places();
      ps.categorySearch(CATEGORY_CODE, function (data, status) {
        if (status === kakao.maps.services.Status.OK) {
          resolve(data.map(_parsePlace));
        } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
          resolve([]);
        } else {
          reject(new Error('Places 검색 실패 (status: ' + status + ')'));
        }
      }, {
        location: new kakao.maps.LatLng(lat, lng),
        radius: radius || DEFAULT_RADIUS,
        sort: kakao.maps.services.SortBy.DISTANCE,
        size: MAX_SIZE
      });
    });
  }

  function _parsePlace(place) {
    // category_name 예: "음식점 > 한식 > 삼겹살,돼지고기구이"
    var categoryShort = place.category_name
      ? place.category_name.split('>').pop().trim().split(',')[0]
      : '음식점';

    return {
      id:           place.id,
      name:         place.place_name,
      category:     categoryShort,
      categoryFull: place.category_name,
      address:      place.road_address_name || place.address_name || '',
      lat:          parseFloat(place.y),
      lng:          parseFloat(place.x),
      distance:     parseInt(place.distance, 10) || 0,
      phone:        place.phone || '',
      url:          place.place_url || ''
    };
  }

  function formatDistance(meters) {
    if (meters < 1000) return meters + 'm';
    return (meters / 1000).toFixed(1) + 'km';
  }

  function formatWalkingTime(meters) {
    // 도보 평균 속도 4km/h = 약 67m/분
    var minutes = Math.ceil(meters / 67);
    return '도보 약 ' + minutes + '분';
  }

  return {
    searchNearby:     searchNearby,
    formatDistance:   formatDistance,
    formatWalkingTime: formatWalkingTime
  };
})();
