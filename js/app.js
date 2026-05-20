// 앱 메인 오케스트레이터 — 초기화, 이벤트 연결, UI 렌더링

// kakao.maps.load() 콜백으로 진입 (index.html 인라인 스크립트가 호출)
window.AppInit = (function () {
  var _restaurants = [];

  // ── 앱 초기화 ──────────────────────────────────────
  function init() {
    _setupEventListeners();

    Location.getCurrent()
      .then(function (pos) {
        MapManager.init(pos.lat, pos.lng);
        _hideMapLoading();

        if (pos.isDefault) {
          _toast('위치 권한이 없어 서울 시청 기준으로 표시합니다.');
        }

        document.getElementById('restaurant-count').textContent = '검색 중...';
        return Restaurant.searchNearby(pos.lat, pos.lng);
      })
      .then(function (list) {
        _restaurants = list;
        _renderList(list);
        MapManager.setRestaurants(list, function (_restaurant, index) {
          _highlightCard(index);
        });
        document.getElementById('restaurant-count').textContent =
          '반경 1km 내 ' + list.length + '개';
      })
      .catch(function (err) {
        console.error('[App]', err);
        _renderListError('맛집 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
      });
  }

  // ── 이벤트 리스너 ────────────────────────────────────
  function _setupEventListeners() {
    // 현재 위치 버튼
    document.getElementById('btn-locate').addEventListener('click', function () {
      Location.getCurrent().then(function (pos) {
        MapManager.setCenter(pos.lat, pos.lng);
      });
    });

    // 뭐먹지? 버튼
    document.getElementById('btn-recommend').addEventListener('click', function () {
      if (_restaurants.length === 0) {
        _toast('맛집 정보를 먼저 불러와주세요.');
        return;
      }
      var top3 = Recommendation.getTop(_restaurants, 3);
      _openModal(top3);
    });

    // 모달 닫기
    document.getElementById('modal-close').addEventListener('click', _closeModal);
    document.getElementById('modal-backdrop').addEventListener('click', function (e) {
      if (e.target === document.getElementById('modal-backdrop')) _closeModal();
    });

    // ESC 키로 모달 닫기
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') _closeModal();
    });
  }

  // ── 사이드패널 맛집 목록 렌더링 ──────────────────────
  function _renderList(restaurants) {
    var listEl = document.getElementById('restaurant-list');

    if (restaurants.length === 0) {
      listEl.innerHTML = '<li class="list-empty"><p>주변에 음식점이 없습니다.</p></li>';
      return;
    }

    listEl.innerHTML = restaurants.map(function (r, i) {
      var phoneHTML = r.phone
        ? '<span class="badge badge--phone">📞 ' + _esc(r.phone) + '</span>'
        : '';
      return [
        '<li class="restaurant-card" data-index="' + i + '">',
        '  <span class="restaurant-card__index">' + (i + 1) + '</span>',
        '  <div class="restaurant-card__body">',
        '    <h3 class="restaurant-card__name">' + _esc(r.name) + '</h3>',
        '    <p class="restaurant-card__category">' + _esc(r.category) + '</p>',
        '    <div class="restaurant-card__meta">',
        '      <span class="badge badge--distance">' + Restaurant.formatDistance(r.distance) + '</span>',
        '      ' + phoneHTML,
        '    </div>',
        '  </div>',
        '</li>'
      ].join('');
    }).join('');

    // 카드 클릭 → 해당 마커 인포윈도우 열기
    listEl.querySelectorAll('.restaurant-card').forEach(function (card) {
      card.addEventListener('click', function () {
        var idx = parseInt(card.dataset.index, 10);
        _highlightCard(idx);
        MapManager.openInfoWindowAt(idx);
      });
    });
  }

  function _highlightCard(targetIndex) {
    document.querySelectorAll('.restaurant-card').forEach(function (card, i) {
      card.classList.toggle('active', i === targetIndex);
    });
    var active = document.querySelector('.restaurant-card.active');
    if (active) active.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function _renderListError(msg) {
    document.getElementById('restaurant-list').innerHTML =
      '<li class="list-empty"><p style="color:var(--color-primary-dark)">⚠️ ' + _esc(msg) + '</p></li>';
    document.getElementById('restaurant-count').textContent = '오류';
  }

  // ── 추천 모달 ─────────────────────────────────────
  function _openModal(recommendations) {
    var html = recommendations.map(function (r, i) {
      var rank = i + 1;
      var linkHTML = r.url
        ? '<a href="' + _esc(r.url) + '" class="rec-card__link" target="_blank" rel="noopener noreferrer">카카오맵에서 보기 →</a>'
        : '';
      return [
        '<div class="rec-card rec-card--' + rank + '">',
        '  <div class="rec-card__rank">' + rank + '</div>',
        '  <div class="rec-card__content">',
        '    <h3 class="rec-card__name">' + _esc(r.name) + '</h3>',
        '    <p class="rec-card__category">' + _esc(r.category) + '</p>',
        '    <div class="rec-card__rating">',
        '      <span class="rec-card__stars">⭐ ' + r.rating.toFixed(1) + '</span>',
        '      <span class="rec-card__review-count">리뷰 ' + r.reviewCount.toLocaleString() + '개</span>',
        '    </div>',
        '    <p class="rec-card__distance">📍 ' + Restaurant.formatDistance(r.distance) +
             ' · ' + Restaurant.formatWalkingTime(r.distance) + '</p>',
        '    <div class="rec-card__actions">',
        '      ' + linkHTML,
        '      <span class="rec-card__score">추천 점수 ' + r.score + '</span>',
        '    </div>',
        '  </div>',
        '</div>'
      ].join('');
    }).join('');

    document.getElementById('recommendation-list').innerHTML = html;
    document.getElementById('modal-backdrop').classList.remove('hidden');
    document.getElementById('modal-close').focus();
  }

  function _closeModal() {
    document.getElementById('modal-backdrop').classList.add('hidden');
  }

  // ── 유틸리티 ─────────────────────────────────────
  function _hideMapLoading() {
    var el = document.getElementById('map-loading');
    if (el) el.classList.add('hidden');
  }

  // 간단한 토스트 알림
  function _toast(msg) {
    var el = document.createElement('div');
    el.textContent = msg;
    el.style.cssText = [
      'position:fixed;bottom:1.5rem;left:50%;transform:translateX(-50%);',
      'background:rgba(44,62,80,0.92);color:#fff;padding:0.55rem 1.2rem;',
      'border-radius:20px;font-size:0.83rem;z-index:300;pointer-events:none;',
      'white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.2);'
    ].join('');
    document.body.appendChild(el);
    setTimeout(function () {
      el.style.transition = 'opacity 0.3s';
      el.style.opacity = '0';
      setTimeout(function () { el.remove(); }, 300);
    }, 2700);
  }

  // XSS 방지용 HTML 이스케이프
  function _esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  return init;
})();
