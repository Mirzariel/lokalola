/* Lokalola — Impact + Calculator behaviour (prefix ic-).
   The impact section is pure CSS (reveal, animated line, bars) plus the shared
   counter in main.js. This file drives the district estimator in #calculator. */
(function () {
  'use strict';
  var doc = document;

  /* aria-labels that need a translation (kept out of data-id-attr, see report) */
  function translateLabels() {
    var id = window.Lokalola && window.Lokalola.getLang() === 'id';
    [].slice.call(doc.querySelectorAll('[data-ic-label-id]')).forEach(function (el) {
      if (!el.hasAttribute('data-ic-label-en')) el.setAttribute('data-ic-label-en', el.getAttribute('aria-label') || '');
      el.setAttribute('aria-label', id ? el.getAttribute('data-ic-label-id') : el.getAttribute('data-ic-label-en'));
    });
  }
  doc.addEventListener('lokalola:lang', translateLabels);

  var root = doc.getElementById('calculator');
  if (!root) return;

  var numEl = doc.getElementById('ic-hh-num');
  var rangeEl = doc.getElementById('ic-hh-range');
  var summaryEl = doc.getElementById('ic-summary');
  var legendEl = doc.getElementById('ic-vis-legend');
  var housesEl = doc.getElementById('ic-houses');
  var plantsEl = doc.getElementById('ic-plants');
  if (!numEl || !rangeEl) return;
  var presetEls = [].slice.call(root.querySelectorAll('[data-ic-preset]'));
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- assumptions (from the design brief) ---------- */
  var HH_MIN = 50, HH_MAX = 20000, PER_PKG = 150, DEFAULT_HH = 600;
  var LOGR = Math.log(HH_MAX / HH_MIN);
  var PER = {                       // per 50 kg package
    waste: 50,                      // kg / day
    wasteYear: 50 * 365 / 1000,     // t / year
    gas: [3.5, 4.7],                // m3 / day
    heat: [76, 101],                // MJ / day
    fertS: 17, fertL: 60,           // kg, L / day
    lpg: 200,                       // 3 kg cylinders / year
    co2: 11.5,                      // t CO2e / year
    capex: 85,                      // IDR M / unit
    service: [0.5, 1],              // IDR M / month, Service Basic
    benefit: [2.0, 2.65]            // IDR M / month net
  };

  function lang() { return window.Lokalola ? window.Lokalola.getLang() : 'en'; }
  function fmt(n, d) { return window.Lokalola ? window.Lokalola.fmt(n, d) : Number(n).toFixed(d || 0); }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }

  /* ---------- slider <-> households (log scale, snapped to friendly steps) ---------- */
  function fromSlider(v) {
    var h = HH_MIN * Math.exp(LOGR * v / 1000);
    var step = h < 500 ? 10 : h < 2000 ? 50 : 100;
    return clamp(Math.round(h / step) * step, HH_MIN, HH_MAX);
  }
  function toSlider(h) { return Math.round(1000 * Math.log(clamp(h, HH_MIN, HH_MAX) / HH_MIN) / LOGR); }

  /* ---------- model ---------- */
  function decs(key, v, n) {
    var md = { pk: 0, wasteDay: 0, wasteYear: 2, gas: 1, heat: 0, fertS: 0, fertL: 0, lpg: 0, co2: 1, capex: 0, service: 1, benefit: 2 }[key] || 0;
    if (key === 'benefit') return n <= 1 ? 2 : (v >= 100 ? 0 : 1);
    return v >= 100 ? 0 : v >= 10 ? Math.min(md, 1) : md;
  }
  function compute(hh) {
    var n = Math.max(1, Math.ceil(hh / PER_PKG));
    function r(a) { return [a[0] * n, a[1] * n]; }
    return {
      n: n,
      out: {
        pk: [n],
        wasteDay: [PER.waste * n],
        wasteYear: [PER.wasteYear * n],
        gas: r(PER.gas),
        heat: r(PER.heat),
        fertS: [PER.fertS * n],
        fertL: [PER.fertL * n],
        lpg: [PER.lpg * n],
        co2: [PER.co2 * n],
        capex: [PER.capex * n],
        service: r(PER.service),
        benefit: r(PER.benefit)
      }
    };
  }

  /* ---------- outputs with number tweens ---------- */
  var outs = {};
  [].slice.call(root.querySelectorAll('[data-out]')).forEach(function (el) {
    outs[el.getAttribute('data-out')] = { el: el, cur: [0], from: [0], to: [0], d: 0 };
  });
  var keys = Object.keys(outs);

  function draw(key) {
    var o = outs[key], s = fmt(o.cur[0], o.d);
    if (o.to.length > 1) s += '–' + fmt(o.cur[1], o.d);
    o.el.textContent = s;
  }
  function drawAll() { keys.forEach(draw); }

  var raf = 0, t0 = 0, DUR = 600;
  function step(ts) {
    var p = Math.max(0, Math.min((ts - t0) / DUR, 1)), e = 1 - Math.pow(1 - p, 3);
    keys.forEach(function (k) {
      var o = outs[k];
      o.cur = o.to.map(function (t, i) { var f = o.from[i] === undefined ? 0 : o.from[i]; return f + (t - f) * e; });
      draw(k);
    });
    raf = p < 1 ? requestAnimationFrame(step) : 0;
  }
  function setTargets(res, instant) {
    keys.forEach(function (k) {
      var o = outs[k], t = res.out[k] || [0];
      o.from = o.cur.length === t.length ? o.cur.slice() : t.map(function (_, i) { return o.cur[i] || 0; });
      o.to = t;
      o.d = decs(k, t[0], res.n);
      if (o.cur.length !== t.length) o.cur = o.from.slice();
    });
    if (instant || reduce) {
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      keys.forEach(function (k) { outs[k].cur = outs[k].to.slice(); });
      drawAll();
    } else {
      t0 = performance.now();
      if (!raf) raf = requestAnimationFrame(step);
    }
  }

  /* ---------- pictogram ---------- */
  var NS = 'http://www.w3.org/2000/svg';
  function niceUnit(total, max, units) {
    for (var i = 0; i < units.length; i++) if (Math.ceil(total / units[i]) <= max) return units[i];
    return units[units.length - 1];
  }
  function syncIcons(box, count, cls, sym) {
    if (!box) return;
    var have = box.children.length, added = [];
    while (box.children.length > count) box.removeChild(box.lastChild);
    for (var i = have; i < count; i++) {
      var svg = doc.createElementNS(NS, 'svg');
      svg.setAttribute('class', cls);
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.style.setProperty('--i', String(i - have));
      var use = doc.createElementNS(NS, 'use');
      use.setAttribute('href', '#' + sym);
      svg.appendChild(use);
      box.appendChild(svg);
      added.push(svg);
    }
    if (added.length) {
      void box.offsetWidth;            // make sure the un-lit state paints first
      added.forEach(function (s) { s.classList.add('is-lit'); });
    }
    [].slice.call(box.children).forEach(function (s) { if (!s.classList.contains('is-lit')) s.classList.add('is-lit'); });
  }

  /* ---------- state + text ---------- */
  var state = { hh: DEFAULT_HH, res: null, hUnit: 25, pUnit: 1 };
  var summaryTimer = 0, started = false;

  function summaryHTML() {
    var s = state, r = s.res, id = lang() === 'id';
    var hh = '<strong>' + fmt(s.hh) + '</strong>';
    var n = '<strong>' + fmt(r.n) + '</strong>';
    var w = '<strong>' + fmt(r.out.wasteDay[0]) + ' kg</strong>';
    var c = '<strong>' + fmt(r.out.co2[0], r.out.co2[0] >= 10 ? 0 : 1) + ' t CO₂e</strong>';
    if (id) return hh + ' rumah tangga membutuhkan ' + n + ' paket. Bersama-sama, paket itu mampu mengolah ' + w + ' sampah per hari dan menghindari sekitar ' + c + ' per tahun.';
    return hh + ' households need ' + n + (r.n === 1 ? ' package' : ' packages') + '. Together they could process ' + w + ' of waste a day and avoid about ' + c + ' a year.';
  }
  function legendText() {
    var id = lang() === 'id', s = state;
    if (id) return '1 ikon rumah = ' + fmt(s.hUnit) + ' rumah tangga · 1 ikon unit = ' + fmt(s.pUnit) + ' paket';
    return '1 house icon = ' + fmt(s.hUnit) + ' households · 1 unit icon = ' + fmt(s.pUnit) + (s.pUnit === 1 ? ' package' : ' packages');
  }
  function renderText(immediateSummary) {
    if (!state.res) return;
    if (legendEl) legendEl.textContent = legendText();
    rangeEl.setAttribute('aria-valuetext', fmt(state.hh) + (lang() === 'id' ? ' rumah tangga' : ' households'));
    clearTimeout(summaryTimer);
    if (immediateSummary || !started) { if (summaryEl) summaryEl.innerHTML = summaryHTML(); }
    else summaryTimer = setTimeout(function () { if (summaryEl) summaryEl.innerHTML = summaryHTML(); }, 350);
  }

  function update(hh, source) {
    state.hh = hh = clamp(Math.round(hh), HH_MIN, HH_MAX);
    state.res = compute(hh);
    if (source !== 'num') { numEl.value = hh; numEl.classList.remove('is-invalid'); }
    if (source !== 'range') rangeEl.value = toSlider(hh);
    var wrap = rangeEl.parentNode;
    if (wrap && wrap.style) wrap.style.setProperty('--p', (rangeEl.value / 10) + '%');
    presetEls.forEach(function (b) { b.setAttribute('aria-pressed', String(+b.getAttribute('data-ic-preset') === hh)); });

    state.hUnit = niceUnit(hh, 30, [1, 2, 5, 10, 25, 50, 100, 250, 500, 1000]);
    state.pUnit = niceUnit(state.res.n, 15, [1, 2, 5, 10, 20, 50]);
    syncIcons(housesEl, Math.ceil(hh / state.hUnit), 'ic-house', 'ic-i-house');
    syncIcons(plantsEl, Math.ceil(state.res.n / state.pUnit), 'ic-plant', 'ic-i-plant');

    setTargets(state.res, !started);
    renderText(false);
  }

  /* ---------- events ---------- */
  rangeEl.addEventListener('input', function () { update(fromSlider(+rangeEl.value), 'range'); });

  numEl.addEventListener('input', function () {
    var raw = numEl.value.trim(), v = parseInt(raw, 10);
    if (raw !== '' && isFinite(v) && v >= HH_MIN && v <= HH_MAX) update(v, 'num');
    else numEl.classList.toggle('is-invalid', raw !== '');
  });
  function commitNum() {
    var v = parseInt(numEl.value, 10);
    update(isFinite(v) ? v : state.hh, 'commit');
  }
  numEl.addEventListener('change', commitNum);
  numEl.addEventListener('keydown', function (e) { if (e.key === 'Enter') commitNum(); });

  presetEls.forEach(function (b) {
    b.addEventListener('click', function () { update(+b.getAttribute('data-ic-preset'), 'preset'); });
  });

  doc.addEventListener('lokalola:lang', function () { drawAll(); renderText(true); });

  /* ---------- init ---------- */
  update(DEFAULT_HH, 'init');
  started = true;

  // Tween the numbers up once, the first time the results scroll into view.
  var grid = root.querySelector('.ic-grid');
  if (grid && 'IntersectionObserver' in window && !reduce) {
    keys.forEach(function (k) { var o = outs[k]; o.cur = o.to.map(function () { return 0; }); });
    drawAll();
    var io = new IntersectionObserver(function (entries) {
      if (entries.some(function (e) { return e.isIntersecting; })) {
        io.disconnect();
        keys.forEach(function (k) { outs[k].from = outs[k].to.map(function () { return 0; }); });
        t0 = performance.now();
        if (!raf) raf = requestAnimationFrame(step);
      }
    }, { threshold: .25 });
    io.observe(grid);
  }
})();
