/* Lokalola — shared behaviour: i18n (EN/ID), replaying reveals, counters,
   split headlines, scroll-scrub progress, nav helpers and small details.
   Section scripts (js/<prefix>.js) load after this file and may listen for
   the "lokalola:lang" event on document.

   Motion contract (used by every section):
   - .reveal / .split / [data-inview]  get .is-in when they enter the viewport and
     lose it only once they are fully out of view, so every animation replays.
     While out of view they carry data-from="above|below" (where they will re-enter from).
   - [data-count-to]                   counts up on every entry, resets once fully out.
   - .split                            headline whose words rise in one by one.
   - [data-scrub]                      gets --p (0..1) while it crosses the viewport;
                                       data-scrub="pin" measures a sticky/pinned track instead.
                                       JS can subscribe with Lokalola.onScrub(el, fn(p)).
   - section.is-offscreen              looping CSS animations pause while their section is off screen. */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  root.classList.remove('no-js');
  root.classList.add('js');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;
  root.classList.add(reduce || !hasIO ? 'reduce' : 'motion');   // .motion gates pinned / scrubbed layouts

  /* ---------- i18n: English is authored in the markup, Indonesian in data-id ---------- */
  var lang = 'en';
  try { lang = localStorage.getItem('lokalola-lang') || ((navigator.language || '').toLowerCase().indexOf('id') === 0 ? 'id' : 'en'); } catch (e) {}
  var booted = false;

  function setLang(next) {
    lang = next === 'id' ? 'id' : 'en';
    // Keep the reader's place: text length differs between languages, so pin the
    // section under the header and restore its offset after the swap.
    var anchor = booted ? sectionAt(96) : null, before = anchor ? anchor.getBoundingClientRect().top : 0;
    if (booted) root.classList.add('is-swapping');
    root.lang = lang;
    doc.querySelectorAll('[data-id]').forEach(function (el) {
      if (el.dataset.en === undefined) el.dataset.en = el.innerHTML;
      el.innerHTML = lang === 'id' ? el.getAttribute('data-id') : el.dataset.en;
    });
    doc.querySelectorAll('[data-id-attr]').forEach(function (el) {
      // data-id-attr="placeholder|Tulis pesan" (also aria-label etc.)
      var p = el.getAttribute('data-id-attr').split('|'), a = p[0];
      var key = 'data-en-' + a;
      if (!el.hasAttribute(key)) el.setAttribute(key, el.getAttribute(a) || '');
      el.setAttribute(a, lang === 'id' ? p.slice(1).join('|') : el.getAttribute(key));
    });
    doc.querySelectorAll('[data-lang-toggle]').forEach(function (b) {
      b.setAttribute('aria-pressed', lang === 'id');
      b.querySelectorAll('[data-lang-opt]').forEach(function (o) { o.classList.toggle('is-active', o.dataset.langOpt === lang); });
    });
    try { localStorage.setItem('lokalola-lang', lang); } catch (e) {}
    doc.dispatchEvent(new CustomEvent('lokalola:lang', { detail: { lang: lang } }));
    if (anchor) window.scrollBy(0, anchor.getBoundingClientRect().top - before);
    if (booted) requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.remove('is-swapping'); }); });
    docTitle = doc.title;
  }
  function t(en, id) { return lang === 'id' ? id : en; }
  function sectionAt(y) {
    var secs = doc.querySelectorAll('main > section, footer');
    for (var i = 0; i < secs.length; i++) { var r = secs[i].getBoundingClientRect(); if (r.top <= y && r.bottom > y) return secs[i]; }
    return null;
  }

  /* ---------- Scroll scrub: one passive, rAF-throttled loop for every [data-scrub] ---------- */
  var scrubs = [], ticking = false, scrollFns = [];
  function onScrub(el, fn) {
    for (var i = 0; i < scrubs.length; i++) if (scrubs[i].el === el) { scrubs[i].fns.push(fn); fn(scrubs[i].p); return; }
    var s = { el: el, fns: [fn], near: true, p: -1 };
    scrubs.push(s); watchNear(s); measure(s);
  }
  function measure(s) {
    var r = s.el.getBoundingClientRect(), vh = window.innerHeight, p;
    if (s.el.getAttribute('data-scrub') === 'pin') p = -r.top / Math.max(1, r.height - vh);
    else p = (vh - r.top) / (vh + r.height);
    p = Math.min(1, Math.max(0, p));
    if (Math.abs(p - s.p) < .0005) return;
    s.p = p;
    s.el.style.setProperty('--p', p.toFixed(4));
    for (var i = 0; i < s.fns.length; i++) s.fns[i](p);
  }
  var nearIO = hasIO ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { var s = en.target._scrub; if (s) { s.near = en.isIntersecting; if (s.near) measure(s); } });
  }, { rootMargin: '50% 0px 50% 0px' }) : null;
  function watchNear(s) { s.el._scrub = s; if (nearIO) nearIO.observe(s.el); }
  function frame() {
    ticking = false;
    for (var i = 0; i < scrubs.length; i++) if (scrubs[i].near) measure(scrubs[i]);
    for (var j = 0; j < scrollFns.length; j++) scrollFns[j](window.scrollY);
  }
  function requestFrame() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener('scroll', requestFrame, { passive: true });
  window.addEventListener('resize', function () { scrubs.forEach(function (s) { s.p = -1; }); requestFrame(); });
  function initScrub() {
    doc.querySelectorAll('[data-scrub]').forEach(function (el) { if (!el._scrub) onScrub(el, function () {}); });
  }

  window.Lokalola = {
    getLang: function () { return lang; }, setLang: setLang, t: t, reduce: reduce,
    fmt: function (n, d) { return Number(n).toLocaleString(lang === 'id' ? 'id-ID' : 'en-US', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }); },
    onScrub: onScrub, onScroll: function (fn) { scrollFns.push(fn); }
  };

  doc.addEventListener('click', function (e) {
    var tg = e.target.closest('[data-lang-toggle]');
    if (tg) setLang(lang === 'en' ? 'id' : 'en');
  });

  /* ---------- Split headlines: wrap every word, keep inline markup (.hl, <br>, <strong>) ---------- */
  function split(el) {
    var i = 0;
    (function walk(node) {
      [].slice.call(node.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          if (!c.nodeValue.trim()) return;
          var frag = doc.createDocumentFragment();
          c.nodeValue.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(doc.createTextNode(part)); return; }
            var w = doc.createElement('span'), wi = doc.createElement('span');
            w.className = 'w'; wi.className = 'wi'; wi.style.setProperty('--i', i++);
            wi.textContent = part; w.appendChild(wi); frag.appendChild(w);
          });
          node.replaceChild(frag, c);
        } else if (c.nodeType === 1 && !c.classList.contains('w')) walk(c);
      });
    })(el);
    el.style.setProperty('--words', i);
    el.classList.add('is-split');
  }
  function initSplit() {
    doc.querySelectorAll('.section-head h2').forEach(function (h) { h.classList.add('split'); });
    var els = doc.querySelectorAll('.split');
    els.forEach(split);
    // the i18n swap replaces innerHTML, so re-split (the .is-swapping class suppresses a replay)
    doc.addEventListener('lokalola:lang', function () { els.forEach(function (el) { if (!el.querySelector('.w')) split(el); }); });
  }

  /* ---------- Replaying reveal ---------- */
  function initReveal() {
    var els = doc.querySelectorAll('.reveal, .split, [data-inview]');
    if (!hasIO || reduce) { els.forEach(function (e) { e.classList.add('is-in'); }); return; }
    // enter: comfortably inside the viewport; exit: completely gone. The gap between
    // the two is the hysteresis that stops edge flicker.
    var enter = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); en.target.removeAttribute('data-from'); } });
    }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    var exit = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) {
          en.target.classList.remove('is-in');
          en.target.setAttribute('data-from', en.boundingClientRect.top < 0 ? 'above' : 'below');
        }
      });
    }, { threshold: 0 });
    els.forEach(function (e) { enter.observe(e); exit.observe(e); });
  }

  /* ---------- Replaying counters: <span data-count-to="282" data-decimals="0" data-prefix="" data-suffix=" ton/d">0</span> ---------- */
  function renderCount(el, v) {
    el.textContent = (el.dataset.prefix || '') + window.Lokalola.fmt(v, +el.dataset.decimals || 0) + (el.dataset.suffix || '');
  }
  function initCounters() {
    var els = doc.querySelectorAll('[data-count-to]');
    function run(el) {
      var to = parseFloat(el.dataset.countTo), dur = +el.dataset.duration || 1400, t0 = null, token = {};
      el._count = token; el.dataset.done = '1';
      if (reduce) return renderCount(el, to);
      (function step(ts) {
        if (el._count !== token) return;
        if (t0 === null) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1), eased = 1 - Math.pow(1 - p, 4);
        renderCount(el, to * eased);
        if (p < 1) requestAnimationFrame(step);
      })(performance.now());
    }
    function reset(el) { el._count = null; delete el.dataset.done; renderCount(el, 0); }
    if (!hasIO || reduce) { els.forEach(run); }
    else {
      els.forEach(function (el) { renderCount(el, 0); });
      var enter = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting && !en.target.dataset.done) run(en.target); });
      }, { threshold: .4 });
      var exit = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (!en.isIntersecting) reset(en.target); });
      }, { threshold: 0 });
      els.forEach(function (el) { enter.observe(el); exit.observe(el); });
    }
    doc.addEventListener('lokalola:lang', function () {
      els.forEach(function (el) { if (el.dataset.done) renderCount(el, parseFloat(el.dataset.countTo)); });
    });
  }

  /* ---------- Visible sections: loops pause off screen (see base.css) ---------- */
  function initVisible() {
    var els = doc.querySelectorAll('main > section, [data-visible]');
    if (!hasIO) { els.forEach(function (e) { e.classList.add('is-visible'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      // fail-safe: loops run unless we know for sure the section is off screen
      entries.forEach(function (en) { en.target.classList.toggle('is-visible', en.isIntersecting); en.target.classList.toggle('is-offscreen', !en.isIntersecting); });
    }, { rootMargin: '10% 0px' });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- Nav: header state, progress bar, hide on scroll down, mobile menu, active link ---------- */
  function initNav() {
    var header = doc.querySelector('[data-header]');
    var meta = doc.querySelector('meta[name="theme-color"]');
    var lastY = window.scrollY, lastMeta = '';
    if (header) {
      var onScroll = function (y) {
        var max = Math.max(1, doc.documentElement.scrollHeight - window.innerHeight);
        header.style.setProperty('--scroll', (y / max).toFixed(4));
        header.classList.toggle('is-scrolled', y > 24);
        var open = doc.body.classList.contains('nav-open') || header.contains(doc.activeElement);
        if (y > 480 && y > lastY + 6 && !open) header.classList.add('is-hidden');
        else if (y < lastY - 6 || y <= 480 || open) header.classList.remove('is-hidden');
        if (Math.abs(y - lastY) > 6) lastY = y;
        // browser chrome colour follows the section under the header
        if (meta) {
          var s = sectionAt(40), bg = s ? getComputedStyle(s).backgroundColor : '';
          var c = !bg || bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent' ? '#fbfaf5' : bg;
          if (s && s.classList.contains('section--dark')) c = '#08170f';
          if (c !== lastMeta) { meta.setAttribute('content', c); lastMeta = c; }
        }
        root.classList.toggle('has-scrolled', y > 40);
      };
      onScroll(window.scrollY);
      scrollFns.push(onScroll);
      header.addEventListener('focusin', function () { header.classList.remove('is-hidden'); });
    }
    var toggle = doc.querySelector('[data-nav-toggle]');
    var menu = doc.querySelector('[data-nav-menu]');
    if (toggle && menu) {
      var close = function () { toggle.setAttribute('aria-expanded', 'false'); menu.classList.remove('is-open'); doc.body.classList.remove('nav-open'); };
      toggle.addEventListener('click', function () {
        var open = toggle.getAttribute('aria-expanded') !== 'true';
        toggle.setAttribute('aria-expanded', open); menu.classList.toggle('is-open', open); doc.body.classList.toggle('nav-open', open);
      });
      menu.addEventListener('click', function (e) { if (e.target.closest('a')) close(); });
      doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && doc.body.classList.contains('nav-open')) { close(); toggle.focus(); } });
      window.addEventListener('resize', function () { if (window.innerWidth >= 1080) close(); });
    }
    var links = [].slice.call(doc.querySelectorAll('[data-nav-link]'));
    if (links.length && hasIO) {
      var map = {};
      links.forEach(function (a) {
        (a.getAttribute('data-nav-for') || a.getAttribute('href').slice(1)).split(' ').forEach(function (id) { if (doc.getElementById(id)) map[id] = a; });
      });
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          var a = map[en.target.id];
          links.forEach(function (l) { l.classList.toggle('is-active', l === a); if (l === a) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current'); });
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      doc.querySelectorAll('main > section[id]').forEach(function (s) { io.observe(s); });
    }
  }

  /* ---------- Small details ---------- */
  var docTitle = doc.title;
  function initDetails() {
    // a quiet note in the tab while the visitor is away
    doc.addEventListener('visibilitychange', function () {
      if (doc.hidden) { docTitle = doc.title; doc.title = t('Your waste is still waiting · Lokalola', 'Sampahmu masih menunggu · Lokalola'); }
      else doc.title = docTitle;
    });
    // for the curious ones who open the console
    try {
      console.log('%cLokalola%c\nWaste is energy in the wrong place.\nSampah adalah energi yang salah tempat.\n\nBuilt by three engineers from Universitas Gadjah Mada: Ghiyats, Mirzariel & Haikal.\nCurious how it works? Say hello via the form at #contact.',
        'font:700 28px Outfit,system-ui,sans-serif;color:#a7f03a;background:#08170f;padding:6px 12px;border-radius:8px',
        'font:14px/1.6 system-ui,sans-serif;color:inherit');
    } catch (e) {}
  }

  function init() {
    setLang(lang);          // first: captures the English markup before anything is split
    booted = true;
    initSplit(); initReveal(); initCounters(); initVisible(); initNav(); initScrub(); initDetails();
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init); else init();
})();
