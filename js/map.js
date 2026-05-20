// 카카오맵 초기화, 마커/인포윈도우 관리, 지도 이동 모듈

var MapManager = (function () {
  var _map = null;
  var _markers = [];
  var _infoWindows = [];
  var _currentLocationOverlay = null;
  var _onMarkerClick = null;

  function init(lat, lng) {
    var container = document.getElementById('map');
    _map = new kakao.maps.Map(container, {
      center: new kakao.maps.LatLng(lat, lng),
      level: 4
    });
    _drawCurrentLocation(lat, lng);
    return _map;
  }

  // 현재 위치를 파란 원형 오버레이로 표시
  function _drawCurrentLocation(lat, lng) {
    if (_currentLocationOverlay) {
      _currentLocationOverlay.setMap(null);
    }
    _currentLocationOverlay = new kakao.maps.Circle({
      center: new kakao.maps.LatLng(lat, lng),
      radius: 9,
      strokeWeight: 3,
      strokeColor: '#2563EB',
      strokeOpacity: 1,
      fillColor: '#60A5FA',
      fillOpacity: 0.9
    });
    _currentLocationOverlay.setMap(_map);
  }

  // 맛집 마커 일괄 등록
  function setRestaurants(restaurants, onClickCallback) {
    _clearMarkers();
    _onMarkerClick = onClickCallback;

    restaurants.forEach(function (restaurant, index) {
      var position = new kakao.maps.LatLng(restaurant.lat, restaurant.lng);
      var marker = new kakao.maps.Marker({
        map: _map,
        position: position,
        title: restaurant.name
      });

      var infoWindow = new kakao.maps.InfoWindow({
        content: _buildInfoWindowHTML(restaurant),
        removable: true
      });

      // 클로저로 index 캡처
      kakao.maps.event.addListener(marker, 'click', (function (r, iw, idx) {
        return function () {
          _closeAllInfoWindows();
          iw.open(_map, marker);
          if (_onMarkerClick) _onMarkerClick(r, idx);
        };
      })(restaurant, infoWindow, index));

      _markers.push(marker);
      _infoWindows.push(infoWindow);
    });
  }

  function _buildInfoWindowHTML(restaurant) {
    return [
      '<div class="custom-iw">',
      '  <div class="custom-iw__name">' + _esc(restaurant.name) + '</div>',
      '  <div class="custom-iw__category">' + _esc(restaurant.category) + '</div>',
      '  <div class="custom-iw__distance">📍 ' + Restaurant.formatDistance(restaurant.distance) + '</div>',
      '</div>'
    ].join('');
  }

  function _clearMarkers() {
    _closeAllInfoWindows();
    _markers.forEach(function (m) { m.setMap(null); });
    _markers = [];
    _infoWindows = [];
  }

  function _closeAllInfoWindows() {
    _infoWindows.forEach(function (iw) { iw.close(); });
  }

  // 인덱스에 해당하는 마커의 인포윈도우 열기 + 지도 이동
  function openInfoWindowAt(index) {
    _closeAllInfoWindows();
    if (_markers[index] && _infoWindows[index]) {
      var pos = _markers[index].getPosition();
      panTo(pos.getLat(), pos.getLng());
      _infoWindows[index].open(_map, _markers[index]);
    }
  }

  function panTo(lat, lng) {
    if (_map) {
      _map.panTo(new kakao.maps.LatLng(lat, lng));
    }
  }

  // 현재 위치 재설정 (위치 버튼 클릭)
  function setCenter(lat, lng) {
    if (_map) {
      _map.setCenter(new kakao.maps.LatLng(lat, lng));
      _drawCurrentLocation(lat, lng);
    }
  }

  // XSS 방지용 HTML 이스케이프
  function _esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  return {
    init: init,
    setRestaurants: setRestaurants,
    openInfoWindowAt: openInfoWindowAt,
    panTo: panTo,
    setCenter: setCenter
  };
})();
