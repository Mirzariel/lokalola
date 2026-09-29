/* Lokalola — Business, Market & Roadmap behaviour (prefix: bm-)
   1. Owner-economics waterfall (Low/High toggle)
   2. Year-10 derived-products expander
   3. 5-year financial projection chart (inline SVG, tooltips) */
(function () {
  'use strict';

  var doc = document;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function lang() { return window.Lokalola && window.Lokalola.getLang ? window.Lokalola.getLang() : 'en'; }
  function fmt(n, d) {
    if (window.Lokalola && window.Lokalola.fmt) return window.Lokalola.fmt(n, d);
    return Number(n).toFixed(d || 0);
  }
  function tr(en, id) { return lang() === 'id' ? id : en; }
  function signed(n, d) { return (n < 0 ? '−' : '') + fmt(Math.abs(n), d); }
  function on(el, ev, fn) { el.addEventListener(ev, fn); }

  /* aria-labels: data-bm-aria="English|Indonesian" (main.js's data-id-attr can't handle hyphenated names) */
  function setAria() {
    doc.querySelectorAll('[data-bm-aria]').forEach(function (el) {
      var p = el.getAttribute('data-bm-aria').split('|');
      el.setAttribute('aria-label', lang() === 'id' && p[1] ? p[1] : p[0]);
    });
  }
  setAria();
  doc.addEventListener('lokalola:lang', setAria);

  /* ------------------------------------------------------------------
     1. Owner economics waterfall
     ------------------------------------------------------------------ */
  (function initOwner() {
    var root = doc.querySelector('[data-bm-owner]');
    if (!root) return;
    var SCALE = 4.0;                       // axis maximum, IDR million / month
    var HAUL = 1.95, FERT = 0.93, COST = 1.26;
    var cases = { low: { lpg: 0.38, net: 2.00, approx: false }, high: { lpg: 1.02, net: 2.64, approx: true } };
    var current = 'low', shown = 2.0, raf = 0;

    function row(k) { return root.querySelector('[data-bm-row="' + k + '"]'); }
    function pct(v) { return (v / SCALE * 100).toFixed(2) + '%'; }
    function setBar(k, l, w) {
      var r = row(k); if (!r) return;
      var b = r.querySelector('.bm-wf-bar');
      b.style.setProperty('--l', pct(l)); b.style.setProperty('--w', pct(w));
    }
    function fixedVals() {
      var vals = root.querySelectorAll('.bm-wf-val');
      var list = [
        ['haul', '+' + fmt(HAUL, 2)], ['fert', '+' + fmt(FERT, 2)], ['cost', '−' + fmt(COST, 2)]
      ];
      list.forEach(function (p) { var r = row(p[0]); if (r) r.querySelector('.bm-wf-val').textContent = p[1]; });
      return vals;
    }
    function netText(key, v) {
      var c = cases[key];
      // The source rounds the high case (2.64) up to 2.65, so the label shows "≈ +2.65".
      if (v === undefined) return (c.approx ? '≈ +' + fmt(2.65, 2) : '+' + fmt(c.net, 2));
      return '+' + fmt(v, 2);
    }
    function applyCase(key, animate) {
      var c = cases[key]; current = key;
      var total = HAUL + FERT + c.lpg;
      setBar('haul', 0, HAUL);
      setBar('fert', HAUL, FERT);
      setBar('lpg', HAUL + FERT, c.lpg);
      setBar('cost', total - COST, COST);
      setBar('net', 0, total - COST);
      fixedVals();
      var lpgVal = root.querySelector('[data-bm-val="lpg"]');
      if (lpgVal) lpgVal.textContent = '+' + fmt(c.lpg, 2);
      var netVal = root.querySelector('[data-bm-val="net"]');
      if (netVal) {
        cancelAnimationFrame(raf);
        var from = shown, to = c.net;
        if (!animate || reduce || from === to) { shown = to; netVal.textContent = netText(key); return; }
        var t0 = null;
        (function step(ts) {
          if (t0 === null) t0 = ts;
          var p = Math.min((ts - t0) / 600, 1), e = 1 - Math.pow(1 - p, 3);
          shown = from + (to - from) * e;
          netVal.textContent = p < 1 ? netText(key, shown) : netText(key);
          if (p < 1) raf = requestAnimationFrame(step);
        })(performance.now());
      }
      root.querySelectorAll('[data-bm-case]').forEach(function (b) {
        var a = b.getAttribute('data-bm-case') === key;
        b.classList.toggle('is-active', a); b.setAttribute('aria-pressed', a ? 'true' : 'false');
      });
    }
    root.querySelectorAll('[data-bm-case]').forEach(function (b) {
      on(b, 'click', function () { applyCase(b.getAttribute('data-bm-case'), true); });
    });
    applyCase('low', false);
    doc.addEventListener('lokalola:lang', function () { applyCase(current, false); });
  })();

  /* ------------------------------------------------------------------
     2. Year-10 expander
     ------------------------------------------------------------------ */
  (function initDerived() {
    var wrap = doc.querySelector('[data-bm-rm]');
    if (!wrap) return;
    var panel = wrap.querySelector('[data-bm-derived]');
    var btn = wrap.querySelector('[data-bm-more]');
    var last = wrap.querySelector('[data-bm-last]');
    if (!panel || !btn) return;
    var open = false, pinned = false;
    var canHover = window.matchMedia && matchMedia('(hover: hover) and (min-width: 900px)').matches;

    function set(o) { open = o; panel.classList.toggle('is-open', o); btn.setAttribute('aria-expanded', o ? 'true' : 'false'); }
    // the vision ends on this panel ("…to rocket fuel"), so it starts open; the button can still close it
    pinned = true; set(true);
    on(btn, 'click', function () {
      if (open && pinned) { pinned = false; set(false); } else { pinned = true; set(true); }
    });
    if (last && canHover) {
      on(last, 'mouseenter', function () { if (!open) set(true); });
    }
    on(wrap, 'mouseleave', function () { if (canHover && !pinned) set(false); });
    on(wrap, 'focusin', function (e) { if (last && last.contains(e.target) && !open) set(true); });
    on(wrap, 'focusout', function (e) {
      if (!pinned && open && !(e.relatedTarget && wrap.contains(e.relatedTarget)) && !(canHover && wrap.matches(':hover'))) set(false);
    });
    on(doc, 'keydown', function (e) { if (e.key === 'Escape' && open && wrap.contains(doc.activeElement)) { pinned = false; set(false); } });

    // Default open on small screens (no hover there).
    if (window.matchMedia && matchMedia('(max-width: 899px)').matches) { pinned = true; set(true); }
  })();

  /* ------------------------------------------------------------------
     3. Financial projection chart
     ------------------------------------------------------------------ */
  (function initFin() {
    var root = doc.querySelector('[data-bm-fin]');
    if (!root) return;
    var host = root.querySelector('[data-bm-chart]');
    var wrap = root.querySelector('[data-bm-wrap]');
    var tip = root.querySelector('[data-bm-tip]');
    var legend = root.querySelector('[data-bm-legend]');
    var rows = root.querySelector('[data-bm-rows]');
    if (!host || !wrap || !tip) return;

    var D = {
      rev: [370, 1448, 3985, 8285, 15960],
      net: [-30, 4, 146, 605, 1425],
      cum: [-30, -26, 120, 724, 2150],
      co2: [null, 23, 132, 448, 2460]
    };
    var VIEWS = {
      rev: { min: 0, max: 16000, ticks: [0, 4000, 8000, 12000, 16000] },
      net: { min: -250, max: 2500, ticks: [0, 500, 1000, 1500, 2000, 2500] }
    };
    var view = 'rev', revealed = false, lastW = 0, geo = null, hideT = 0;

    function svgNum(n) { return Math.round(n * 10) / 10; }

    function renderTable() {
      if (!rows) return;
      [['rev', D.rev], ['net', D.net], ['cum', D.cum], ['co2', D.co2]].forEach(function (p) {
        var r = rows.querySelector('[data-bm-trow="' + p[0] + '"] .bm-trow-cells');
        if (!r) return;
        var cells = r.children;
        for (var i = 0; i < cells.length; i++) cells[i].textContent = p[1][i] === null ? '—' : signed(p[1][i], 0);
      });
      rows.querySelectorAll('[data-bm-trow]').forEach(function (r) {
        var k = r.getAttribute('data-bm-trow');
        r.classList.toggle('is-active', view === 'rev' ? k === 'rev' : (k === 'net' || k === 'cum'));
      });
    }

    function renderLegend() {
      if (!legend) return;
      legend.innerHTML = view === 'rev'
        ? '<li><span class="bm-sw bm-sw--rev"></span>' + tr('Revenue', 'Pendapatan') + '</li>'
        : '<li><span class="bm-sw bm-sw--pos"></span>' + tr('Net profit', 'Laba bersih') + '</li>' +
          '<li><span class="bm-sw bm-sw--neg"></span>' + tr('Net loss', 'Rugi bersih') + '</li>' +
          '<li><span class="bm-sw bm-sw--cum"></span>' + tr('Cumulative net profit', 'Laba bersih kumulatif') + '</li>';
    }

    function render(animate) {
      var W = Math.max(280, Math.round(host.clientWidth || wrap.clientWidth || 320));
      lastW = W;
      var narrow = W < 520;
      var H = narrow ? 270 : 340;
      var ml = narrow ? 44 : 54, mr = narrow ? 6 : 10, mt = 14, mb = 28;
      var pw = W - ml - mr, ph = H - mt - mb, band = pw / 5;
      var bw = Math.min(narrow ? 36 : 64, band * 0.6);
      var cfg = VIEWS[view];
      function y(v) { return mt + ph * (1 - (v - cfg.min) / (cfg.max - cfg.min)); }
      var y0 = y(0);
      var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '" role="group" aria-label="' +
        tr('Five-year financial projection chart, IDR million', 'Grafik proyeksi keuangan lima tahun, juta rupiah') + '">';

      // gridlines + y labels
      cfg.ticks.forEach(function (t) {
        var yy = svgNum(y(t));
        s += '<line class="bm-gl' + (t === 0 ? ' bm-gl--zero' : '') + '" x1="' + ml + '" x2="' + (W - mr) + '" y1="' + yy + '" y2="' + yy + '"/>';
        s += '<text class="bm-axis-t bm-axis-t--y" x="' + (ml - 8) + '" y="' + (yy + 4) + '">' + fmt(t, 0) + '</text>';
      });

      // bars
      var vals = view === 'rev' ? D.rev : D.net;
      vals.forEach(function (v, i) {
        var x = ml + band * i + (band - bw) / 2;
        var yv = y(v);
        var top = Math.min(yv, y0), h = Math.max(Math.abs(yv - y0), 2.5);
        var cls = 'bm-fbar' + (view === 'net' ? ' bm-fbar--net' : '') + (v < 0 ? ' bm-fbar--neg' : '');
        if (v < 0) top = y0;
        s += '<rect class="' + cls + '" style="--k:' + i + '" x="' + svgNum(x) + '" y="' + svgNum(top) + '" width="' + svgNum(bw) + '" height="' + svgNum(h) + '" rx="4"/>';
      });

      // cumulative line
      if (view === 'net') {
        var pts = D.cum.map(function (v, i) { return [ml + band * (i + 0.5), y(v)]; });
        var d = pts.map(function (p, i) { return (i ? 'L' : 'M') + svgNum(p[0]) + ' ' + svgNum(p[1]); }).join(' ');
        s += '<path class="bm-fline" pathLength="1" d="' + d + '"/>';
        pts.forEach(function (p, i) { s += '<circle class="bm-fdot" style="--k:' + i + '" cx="' + svgNum(p[0]) + '" cy="' + svgNum(p[1]) + '" r="' + (narrow ? 4.5 : 5.5) + '"/>'; });
      }

      // x labels
      for (var i = 0; i < 5; i++) {
        s += '<text class="bm-axis-t bm-axis-t--x" x="' + svgNum(ml + band * (i + 0.5)) + '" y="' + (H - 8) + '">' + tr('Yr ', 'Thn ') + (i + 1) + '</text>';
      }

      // hit bands (keyboard-reachable)
      for (var j = 0; j < 5; j++) {
        s += '<rect class="bm-band" tabindex="0" role="img" data-i="' + j + '" x="' + svgNum(ml + band * j) + '" y="' + mt + '" width="' + svgNum(band) + '" height="' + ph + '" aria-label="' + tipText(j).replace(/"/g, '&quot;') + '"/>';
      }
      s += '</svg>';
      host.innerHTML = s;

      geo = { ml: ml, mr: mr, band: band, W: W, H: H, y: y, mt: mt };
      rows.style.setProperty('--bm-ml', ml + 'px');
      rows.style.setProperty('--bm-mr', mr + 'px');

      var svg = host.firstChild;
      if (!animate) svg.classList.add('bm-static');
      if (revealed) {
        if (animate && !reduce) { requestAnimationFrame(function () { requestAnimationFrame(function () { svg.classList.add('bm-on'); }); }); }
        else svg.classList.add('bm-on');
      }
      renderTable(); renderLegend();
    }

    // plain-text description of a year (aria-label)
    function tipText(i) {
      var parts = [tr('Year ', 'Tahun ') + (i + 1)];
      if (view === 'rev') parts.push(tr('Revenue ', 'Pendapatan ') + 'IDR ' + signed(D.rev[i], 0) + ' M');
      else {
        parts.push(tr('Net profit ', 'Laba bersih ') + 'IDR ' + signed(D.net[i], 0) + ' M');
        parts.push(tr('Cumulative ', 'Kumulatif ') + 'IDR ' + signed(D.cum[i], 0) + ' M');
      }
      parts.push('CO₂e ' + tr('avoided ', 'dihindari ') + (D.co2[i] === null ? '—' : fmt(D.co2[i], 0) + ' t/yr'));
      return parts.join(', ');
    }

    function tipHTML(i) {
      var h = '<b>' + tr('Year ', 'Tahun ') + (i + 1) + '</b>';
      if (view === 'rev') h += '<span>' + tr('Revenue', 'Pendapatan') + '<strong>' + signed(D.rev[i], 0) + '</strong></span>';
      else {
        h += '<span>' + tr('Net profit', 'Laba bersih') + '<strong>' + signed(D.net[i], 0) + '</strong></span>';
        h += '<span>' + tr('Cumulative', 'Kumulatif') + '<strong>' + signed(D.cum[i], 0) + '</strong></span>';
      }
      h += '<span>CO₂e ' + tr('avoided', 'dihindari') + '<strong>' + (D.co2[i] === null ? '—' : fmt(D.co2[i], 0) + ' t') + '</strong></span>';
      return h + '<span style="opacity:.6;font-size:.72rem">' + tr('IDR million', 'juta rupiah') + '</span>';
    }

    function showTip(i) {
      if (!geo) return;
      clearTimeout(hideT);
      tip.innerHTML = tipHTML(i);
      tip.hidden = false;
      var v = view === 'rev' ? D.rev[i] : Math.max(D.net[i], D.cum[i]);
      var cx = geo.ml + geo.band * (i + 0.5);
      var cy = geo.y(v) - 10;
      var half = tip.offsetWidth / 2;
      cx = Math.max(half + 2, Math.min(geo.W - half - 2, cx));
      // keep the tooltip inside the chart's top edge
      var th = tip.offsetHeight;
      if (cy - th < 0) cy = th + 4;
      tip.style.left = cx + 'px'; tip.style.top = cy + 'px';
      host.querySelectorAll('.bm-band').forEach(function (b) { b.classList.toggle('is-hot', +b.getAttribute('data-i') === i); });
    }
    function hideTip() {
      hideT = setTimeout(function () {
        tip.hidden = true;
        host.querySelectorAll('.bm-band.is-hot').forEach(function (b) { b.classList.remove('is-hot'); });
      }, 60);
    }

    on(host, 'mouseover', function (e) { var b = e.target.closest && e.target.closest('.bm-band'); if (b) showTip(+b.getAttribute('data-i')); });
    on(host, 'mouseleave', hideTip);
    on(host, 'focusin', function (e) { var b = e.target.closest && e.target.closest('.bm-band'); if (b) showTip(+b.getAttribute('data-i')); });
    on(host, 'focusout', hideTip);
    on(host, 'click', function (e) { var b = e.target.closest && e.target.closest('.bm-band'); if (b) showTip(+b.getAttribute('data-i')); });
    on(host, 'keydown', function (e) {
      var b = e.target.closest && e.target.closest('.bm-band'); if (!b) return;
      var i = +b.getAttribute('data-i'), n = -1;
      if (e.key === 'ArrowRight') n = Math.min(4, i + 1);
      else if (e.key === 'ArrowLeft') n = Math.max(0, i - 1);
      else if (e.key === 'Escape') { tip.hidden = true; return; }
      if (n >= 0) { e.preventDefault(); var t = host.querySelector('.bm-band[data-i="' + n + '"]'); if (t) t.focus(); }
    });
    on(doc, 'click', function (e) { if (!wrap.contains(e.target)) { tip.hidden = true; } });

    root.querySelectorAll('[data-bm-view]').forEach(function (b) {
      on(b, 'click', function () {
        var v = b.getAttribute('data-bm-view'); if (v === view) return;
        view = v; tip.hidden = true;
        root.querySelectorAll('[data-bm-view]').forEach(function (x) {
          var a = x.getAttribute('data-bm-view') === view;
          x.classList.toggle('is-active', a); x.setAttribute('aria-pressed', a ? 'true' : 'false');
        });
        render(true);
      });
    });

    // Animate in on reveal
    // Replays on every entry: plays when comfortably in view, snaps back (silently) once fully out.
    function reveal() {
      if (revealed) return;
      revealed = true;
      var svg = host.firstChild;
      if (!svg) return;
      svg.classList.remove('bm-static');
      void svg.getBoundingClientRect();
      requestAnimationFrame(function () { requestAnimationFrame(function () { if (revealed) svg.classList.add('bm-on'); }); });
    }
    function unreveal() {
      if (!revealed) return;
      revealed = false;
      var svg = host.firstChild;
      if (svg) { svg.classList.add('bm-static'); svg.classList.remove('bm-on'); }
    }
    render(false);
    if ('IntersectionObserver' in window && !reduce) {
      new IntersectionObserver(function (en) {
        en.forEach(function (e) { if (e.isIntersecting) reveal(); });
      }, { threshold: 0.3 }).observe(wrap);
      new IntersectionObserver(function (en) {
        en.forEach(function (e) { if (!e.isIntersecting) unreveal(); });
      }, { threshold: 0 }).observe(wrap);
    } else { revealed = true; render(false); }

    // Responsive: re-render when width changes
    if ('ResizeObserver' in window) {
      var ro = new ResizeObserver(function () {
        var w = Math.round(host.clientWidth);
        if (w && Math.abs(w - lastW) > 1) { tip.hidden = true; render(false); }
      });
      ro.observe(wrap);
    } else {
      window.addEventListener('resize', function () { render(false); });
    }

    doc.addEventListener('lokalola:lang', function () { render(false); });
  })();
})();
