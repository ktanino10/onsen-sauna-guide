/* Onsen & Sauna Guide — client-side rendering, filtering, map and i18n.
   Single source of truth: data/spots.json (loaded at runtime). */
(function () {
  'use strict';

  var VIEW_OK = 4;   // view.rating >= this -> "great view"
  var WORK_OK = 3;   // work_friendly.rating >= this -> "work-friendly"

  var I18N = {
    ja: {
      html_lang: 'ja',
      lang_button: 'English',
      tagline: '実際に入って「良かった！」と思えた温泉・サウナを、都道府県順に紹介します。',
      search_placeholder: '名前・エリアで検索',
      f_stay: '🛏 宿泊可', f_view: '🌄 景色◎', f_work: '💻 作業向き', f_food: '🍽 飲食あり',
      f_solo: '🧑 一人', f_friends: '👥 友人', f_couple: '👫 男女',
      gender_all: '男女区分：すべて', gender_separate: '男女別', gender_men: '男性専用',
      gender_women: '女性専用', gender_mixed: '混浴',
      pref_all: 'すべての都道府県', reset: 'リセット', count_unit: '件',
      no_results: '該当する施設がありません。',
      map_hint: '📍 座標がある施設は地図に表示されます。',
      footer_add: '施設の追加は Issue に公式サイトの URL を貼って Copilot をアサインするだけ。',
      footer_note: '料金・営業情報は変わることがあります。必ず各施設の公式サイトでご確認ください。',
      badge_stay: '🛏 宿泊可', badge_view: '🌄 景色◎', badge_work: '💻 作業向き', badge_food: '🍽 飲食あり',
      badge_solo: '🧑 一人', badge_friends: '👥 友人', badge_couple: '👫 男女',
      gender: { separate: '男女別', men_only: '男性専用', women_only: '女性専用', mixed: '混浴' },
      dk_access: 'アクセス', dk_price: '料金', dk_view: '景色', dk_work: '作業向き',
      dk_sauna: 'サウナ', dk_onsen: '温泉', dk_unique: '差別化', dk_comment: '一言',
      official_site: '公式サイト', show_on_map: '地図で見る', inferred: '（自動推測）',
      load_error: 'データの読み込みに失敗しました。'
    },
    en: {
      html_lang: 'en',
      lang_button: '日本語',
      tagline: 'A curated guide to hot springs and saunas worth the visit, ordered by prefecture.',
      search_placeholder: 'Search by name or area',
      f_stay: '🛏 Stay', f_view: '🌄 View', f_work: '💻 Work', f_food: '🍽 Food',
      f_solo: '🧑 Solo', f_friends: '👥 Friends', f_couple: '👫 Couple',
      gender_all: 'Gender: All', gender_separate: 'Separate', gender_men: 'Men only',
      gender_women: 'Women only', gender_mixed: 'Mixed',
      pref_all: 'All prefectures', reset: 'Reset', count_unit: 'spots',
      no_results: 'No spots match your filters.',
      map_hint: '📍 Spots with coordinates appear on the map.',
      footer_add: 'To add a spot, paste the official URL into an Issue and assign Copilot.',
      footer_note: 'Prices and hours can change — always check each official website.',
      badge_stay: '🛏 Can stay', badge_view: '🌄 Great view', badge_work: '💻 Work-friendly', badge_food: '🍽 Food',
      badge_solo: '🧑 Solo', badge_friends: '👥 Friends', badge_couple: '👫 Couple',
      gender: { separate: "Separate men's/women's", men_only: 'Men only', women_only: 'Women only', mixed: 'Mixed bathing' },
      dk_access: 'Access', dk_price: 'Price', dk_view: 'View', dk_work: 'Work',
      dk_sauna: 'Sauna', dk_onsen: 'Onsen', dk_unique: 'Unique', dk_comment: 'Note',
      official_site: 'Official site', show_on_map: 'Show on map', inferred: '(auto-inferred)',
      load_error: 'Failed to load data.'
    }
  };

  var state = {
    lang: localStorage.getItem('osg-lang') || 'ja',
    spots: [], prefectures: [], prefByCode: {},
    filters: { search: '', stay: false, view: false, work: false, food: false,
               solo: false, friends: false, couple: false, gender: '', pref: '' },
    map: null, markerLayer: null, markers: {}
  };

  function t(key) {
    var d = I18N[state.lang] || I18N.ja;
    return (key in d) ? d[key] : (I18N.ja[key] != null ? I18N.ja[key] : key);
  }
  function loc(node) {
    if (!node || typeof node !== 'object') return null;
    return node[state.lang] || node.ja || node.en || null;
  }
  function el(tag, cls) { var e = document.createElement(tag); if (cls) e.className = cls; return e; }
  function stars(r) {
    if (typeof r !== 'number' || r < 1 || r > 5) return null;
    return '★'.repeat(r) + '☆'.repeat(5 - r);
  }

  function sortSpots(a, b) {
    var pa = a.prefecture_code || 99, pb = b.prefecture_code || 99;
    if (pa !== pb) return pa - pb;
    var ca = (a.city && a.city.ja) || '', cb = (b.city && b.city.ja) || '';
    if (ca !== cb) return ca < cb ? -1 : 1;
    var na = (a.name && a.name.ja) || '', nb = (b.name && b.name.ja) || '';
    return na < nb ? -1 : (na > nb ? 1 : 0);
  }

  function searchText(s) {
    var bits = [];
    ['name', 'prefecture', 'city', 'address', 'access', 'unique_point', 'sauna', 'onsen'].forEach(function (k) {
      var n = s[k];
      if (n && typeof n === 'object') { if (n.ja) bits.push(n.ja); if (n.en) bits.push(n.en); }
    });
    return bits.join(' ').toLowerCase();
  }

  function matchesFilters(s) {
    var f = state.filters;
    if (f.stay && s.stay !== true) return false;
    if (f.view && !(s.view && s.view.rating >= VIEW_OK)) return false;
    if (f.work && !(s.work_friendly && s.work_friendly.rating >= WORK_OK)) return false;
    if (f.food && !(s.food && s.food.available === true)) return false;
    var rec = s.recommended_for || [];
    if (f.solo && rec.indexOf('solo') < 0) return false;
    if (f.friends && rec.indexOf('friends') < 0) return false;
    if (f.couple && rec.indexOf('couple') < 0) return false;
    if (f.gender && s.gender_policy !== f.gender) return false;
    if (f.pref && String(s.prefecture_code) !== String(f.pref)) return false;
    if (f.search && searchText(s).indexOf(f.search.toLowerCase()) < 0) return false;
    return true;
  }

  function badgeEls(s) {
    var out = [];
    function add(txt, cls) { var b = el('span', 'badge ' + (cls || '')); b.textContent = txt; out.push(b); }
    if (s.stay === true) add(t('badge_stay'), 'b-primary');
    if (s.view && s.view.rating >= VIEW_OK) add(t('badge_view'), 'b-accent');
    if (s.work_friendly && s.work_friendly.rating >= WORK_OK) add(t('badge_work'), 'b-accent');
    if (s.food && s.food.available === true) add(t('badge_food'));
    if (s.gender_policy && t('gender')[s.gender_policy]) add('🚻 ' + t('gender')[s.gender_policy]);
    var rec = s.recommended_for || [];
    if (rec.indexOf('solo') >= 0) add(t('badge_solo'));
    if (rec.indexOf('friends') >= 0) add(t('badge_friends'));
    if (rec.indexOf('couple') >= 0) add(t('badge_couple'));
    return out;
  }

  function detailRow(key, value, inferred) {
    var li = el('li');
    var k = el('span', 'dl-key'); k.textContent = t(key);
    var v = el('span'); v.textContent = value;
    if (inferred) { var i = el('span', 'inferred'); i.textContent = t('inferred'); v.appendChild(i); }
    li.appendChild(k); li.appendChild(v);
    return li;
  }

  function ratingLine(node) {
    if (!node) return null;
    var pieces = [];
    var st = stars(node.rating); if (st) pieces.push(st);
    var txt = loc(node); if (txt) pieces.push(txt);
    return pieces.length ? pieces.join(' — ') : null;
  }

  function renderCard(s) {
    var card = el('div', 'card');
    card.id = 'card-' + s.id;

    var head = el('div', 'card-head');
    var titleWrap = el('div');
    var title = el('div', 'card-title');
    var name = loc(s.name) || s.id;
    if (s.url) {
      var a = el('a'); a.href = s.url; a.target = '_blank'; a.rel = 'noopener'; a.textContent = name;
      title.appendChild(a);
    } else { title.textContent = name; }
    titleWrap.appendChild(title);
    var place = el('div', 'card-place');
    place.textContent = '📍 ' + (loc(s.address) || [loc(s.prefecture), loc(s.city)].filter(Boolean).join(' '));
    titleWrap.appendChild(place);
    head.appendChild(titleWrap);
    card.appendChild(head);

    var badges = el('div', 'badges');
    badgeEls(s).forEach(function (b) { badges.appendChild(b); });
    if (badges.children.length) card.appendChild(badges);

    var dl = el('ul', 'detail-list');
    var access = loc(s.access); if (access) dl.appendChild(detailRow('dk_access', access));
    var price = loc(s.price); if (price) dl.appendChild(detailRow('dk_price', price));
    var view = ratingLine(s.view); if (view) dl.appendChild(detailRow('dk_view', view, s.view && s.view._inferred));
    var work = ratingLine(s.work_friendly); if (work) dl.appendChild(detailRow('dk_work', work, s.work_friendly && s.work_friendly._inferred));
    var sauna = loc(s.sauna); if (sauna) dl.appendChild(detailRow('dk_sauna', sauna));
    var onsen = loc(s.onsen); if (onsen) dl.appendChild(detailRow('dk_onsen', onsen));
    var unique = loc(s.unique_point); if (unique) dl.appendChild(detailRow('dk_unique', '✨ ' + unique));
    var comment = loc(s.personal_comment); if (comment) dl.appendChild(detailRow('dk_comment', '💬 ' + comment, s.personal_comment && s.personal_comment._inferred));
    if (dl.children.length) card.appendChild(dl);

    var actions = el('div', 'card-actions');
    if (s.url) {
      var site = el('a', 'btn btn-primary'); site.href = s.url; site.target = '_blank'; site.rel = 'noopener';
      site.textContent = t('official_site'); actions.appendChild(site);
    }
    var mapBtn = el('button', 'btn btn-ghost'); mapBtn.type = 'button'; mapBtn.textContent = t('show_on_map');
    if (s.geo && typeof s.geo.lat === 'number') {
      mapBtn.addEventListener('click', function () { focusMarker(s.id); });
    } else { mapBtn.disabled = true; }
    actions.appendChild(mapBtn);
    card.appendChild(actions);

    return card;
  }

  function render() {
    var list = state.spots.filter(matchesFilters).slice().sort(sortSpots);
    var container = document.getElementById('spots');
    container.innerHTML = '';

    var currentCode = null, group = null;
    list.forEach(function (s) {
      if (s.prefecture_code !== currentCode) {
        currentCode = s.prefecture_code;
        var pref = state.prefByCode[currentCode] || {};
        group = el('section', 'pref-group');
        var h = el('div', 'pref-head');
        var ja = el('span', 'ja'); ja.textContent = pref.ja || (s.prefecture && s.prefecture.ja) || '';
        var en = el('span', 'en'); en.textContent = pref.en || (s.prefecture && s.prefecture.en) || '';
        h.appendChild(ja); h.appendChild(en);
        group.appendChild(h);
        container.appendChild(group);
      }
      group.appendChild(renderCard(s));
    });

    document.getElementById('count').textContent = list.length;
    document.getElementById('empty').hidden = list.length !== 0;
    updateMarkers(list);
  }

  /* ===== Map ===== */
  function initMap() {
    if (typeof L === 'undefined') return;
    state.map = L.map('map', { scrollWheelZoom: false }).setView([37.5, 137.5], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(state.map);
    state.markerLayer = L.layerGroup().addTo(state.map);
  }

  function updateMarkers(list) {
    if (!state.map) return;
    state.markerLayer.clearLayers();
    state.markers = {};
    var pts = [];
    list.forEach(function (s) {
      if (!s.geo || typeof s.geo.lat !== 'number' || typeof s.geo.lng !== 'number') return;
      var m = L.marker([s.geo.lat, s.geo.lng]);
      var name = loc(s.name) || s.id;
      var html = '<b>' + escapeHtml(name) + '</b>';
      if (s.url) html = '<a href="' + encodeURI(s.url) + '" target="_blank" rel="noopener">' + escapeHtml(name) + '</a>';
      m.bindPopup(html);
      m.on('click', function () { highlightCard(s.id); });
      m.addTo(state.markerLayer);
      state.markers[s.id] = m;
      pts.push([s.geo.lat, s.geo.lng]);
    });
    if (pts.length === 1) { state.map.setView(pts[0], 12); }
    else if (pts.length > 1) { state.map.fitBounds(pts, { padding: [40, 40], maxZoom: 12 }); }
  }

  function focusMarker(id) {
    var m = state.markers[id];
    if (!m || !state.map) return;
    state.map.setView(m.getLatLng(), 13, { animate: true });
    m.openPopup();
    var mapEl = document.getElementById('map');
    if (window.innerWidth <= 900 && mapEl) mapEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    highlightCard(id);
  }

  function highlightCard(id) {
    var prev = document.querySelector('.card.active');
    if (prev) prev.classList.remove('active');
    var card = document.getElementById('card-' + id);
    if (card) {
      card.classList.add('active');
      // Use 'nearest' so an already-visible card is NOT re-scrolled. Scrolling a
      // visible card to 'center' pushed the filter controls up under the sticky
      // header (z-index 1000), where the header intercepted their clicks and
      // visually dimmed them. scroll-margin-top (CSS) keeps any real scroll clear
      // of the header.
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      setTimeout(function () { card.classList.remove('active'); }, 2200);
    }
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ===== i18n / controls ===== */
  function applyStaticI18n() {
    document.documentElement.lang = t('html_lang');
    document.querySelectorAll('[data-i18n]').forEach(function (node) {
      var key = node.getAttribute('data-i18n');
      var attr = node.getAttribute('data-i18n-attr');
      if (attr) node.setAttribute(attr, t(key));
      else node.textContent = t(key);
    });
    var lb = document.getElementById('lang-toggle');
    if (lb) lb.textContent = t('lang_button');
  }

  function populatePrefSelect() {
    var sel = document.getElementById('pref-select');
    var codes = [];
    state.spots.forEach(function (s) { if (codes.indexOf(s.prefecture_code) < 0) codes.push(s.prefecture_code); });
    codes.sort(function (a, b) { return (a || 99) - (b || 99); });
    codes.forEach(function (c) {
      var p = state.prefByCode[c] || {};
      var o = document.createElement('option');
      o.value = c;
      o.textContent = (p.ja || '') + ' / ' + (p.en || '');
      sel.appendChild(o);
    });
  }

  function wireControls() {
    document.getElementById('search').addEventListener('input', function (e) {
      state.filters.search = e.target.value.trim(); render();
    });
    document.querySelectorAll('[data-filter]').forEach(function (cb) {
      cb.addEventListener('change', function () {
        state.filters[cb.getAttribute('data-filter')] = cb.checked; render();
      });
    });
    document.getElementById('gender-select').addEventListener('change', function (e) {
      state.filters.gender = e.target.value; render();
    });
    document.getElementById('pref-select').addEventListener('change', function (e) {
      state.filters.pref = e.target.value; render();
    });
    document.getElementById('reset').addEventListener('click', function () {
      state.filters = { search: '', stay: false, view: false, work: false, food: false,
                        solo: false, friends: false, couple: false, gender: '', pref: '' };
      document.getElementById('search').value = '';
      document.querySelectorAll('[data-filter]').forEach(function (cb) { cb.checked = false; });
      document.getElementById('gender-select').value = '';
      document.getElementById('pref-select').value = '';
      render();
    });
    document.getElementById('lang-toggle').addEventListener('click', function () {
      state.lang = state.lang === 'ja' ? 'en' : 'ja';
      localStorage.setItem('osg-lang', state.lang);
      applyStaticI18n();
      render();
    });
  }

  /* ===== Init ===== */
  function boot() {
    initMap();
    applyStaticI18n();
    wireControls();
    Promise.all([
      fetch('data/spots.json').then(function (r) { return r.json(); }),
      fetch('data/prefectures.json').then(function (r) { return r.json(); })
    ]).then(function (res) {
      state.spots = res[0] || [];
      state.prefectures = res[1] || [];
      state.prefectures.forEach(function (p) { state.prefByCode[p.code] = p; });
      populatePrefSelect();
      render();
    }).catch(function (err) {
      console.error(err);
      var c = document.getElementById('spots');
      c.innerHTML = '<p class="empty-msg">' + t('load_error') + '</p>';
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
