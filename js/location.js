// 브라우저 Geolocation API를 통한 현재 위치 탐지 모듈

var Location = (function () {
  var DEFAULT = {
    lat: 37.5665,
    lng: 126.9780,
    isDefault: true   // 기본값(서울 시청) 사용 여부 플래그
  };

  function getCurrent() {
    return new Promise(function (resolve) {
      if (!navigator.geolocation) {
        console.warn('[Location] Geolocation 미지원 브라우저 → 기본값(서울 시청) 사용');
        resolve(DEFAULT);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        function (position) {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            isDefault: false
          });
        },
        function (error) {
          var messages = {
            1: '위치 권한 거부됨',
            2: '위치 정보를 확인할 수 없음',
            3: '위치 요청 시간 초과'
          };
          console.warn('[Location]', messages[error.code] || '알 수 없는 오류', '→ 기본값(서울 시청) 사용');
          resolve(DEFAULT);
        },
        { timeout: 8000, maximumAge: 60000, enableHighAccuracy: false }
      );
    });
  }

  return {
    getCurrent: getCurrent,
    DEFAULT: DEFAULT
  };
})();
