/* Lokalola — shared behaviour: i18n (EN/ID), scroll reveal, counters, nav helpers.
   Section scripts (js/<prefix>.js) load after this file and may listen for
   the "lokalola:lang" event on document. */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  root.classList.remove('no-js');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- i18n: English is authored in the markup, Indonesian in data-id ---------- */
  var lang = 'en';
  try { lang = localStorage.getItem('lokalola-lang') || ((navigator.language || '').toLowerCase().indexOf('id') === 0 ? 'id' : 'en'); } catch (e) {}

  function setLang(next) {
    lang = next === 'id' ? 'id' : 'en';
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
  }
  window.Lokalola = { getLang: function () { return lang; }, setLang: setLang,
    fmt: function (n, d) { return Number(n).toLocaleString(lang === 'id' ? 'id-ID' : 'en-US', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }); } };

  doc.addEventListener('click', function (e) {
    var t = e.target.closest('[data-lang-toggle]');
    if (t) setLang(lang === 'en' ? 'id' : 'en');
  });

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    var els = doc.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || reduce) { els.forEach(function (e) { e.classList.add('is-in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- Counters: <span data-count-to="282" data-decimals="0" data-prefix="" data-suffix=" ton/d">0</span> ---------- */
  function renderCount(el, v) {
    el.textContent = (el.dataset.prefix || '') + window.Lokalola.fmt(v, +el.dataset.decimals || 0) + (el.dataset.suffix || '');
  }
  function initCounters() {
    var els = doc.querySelectorAll('[data-count-to]');
    function run(el) {
      var to = parseFloat(el.dataset.countTo), dur = 1400, t0 = null;
      el.dataset.done = '1';
      if (reduce) return renderCount(el, to);
      (function step(ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
        renderCount(el, to * eased);
        if (p < 1) requestAnimationFrame(step);
      })(performance.now());
    }
    els.forEach(function (el) { renderCount(el, 0); });
    if (!('IntersectionObserver' in window)) { els.forEach(run); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { run(en.target); io.unobserve(en.target); } });
    }, { threshold: .4 });
    els.forEach(function (el) { io.observe(el); });
    doc.addEventListener('lokalola:lang', function () {
      els.forEach(function (el) { if (el.dataset.done) renderCount(el, parseFloat(el.dataset.countTo)); });
    });
  }

  /* ---------- Nav: header shadow, mobile menu, active link ---------- */
  function initNav() {
    var header = doc.querySelector('[data-header]');
    if (header) {
      var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 24); };
      onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
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
      doc.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    }
    var links = [].slice.call(doc.querySelectorAll('[data-nav-link]'));
    if (links.length && 'IntersectionObserver' in window) {
      var map = {};
      links.forEach(function (a) { var id = a.getAttribute('href').slice(1); var s = doc.getElementById(id); if (s) map[id] = a; });
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { links.forEach(function (a) { a.classList.remove('is-active'); a.removeAttribute('aria-current'); }); var a = map[en.target.id]; if (a) { a.classList.add('is-active'); a.setAttribute('aria-current', 'true'); } }
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      Object.keys(map).forEach(function (id) { io.observe(doc.getElementById(id)); });
    }
  }

  function init() { initReveal(); initCounters(); initNav(); setLang(lang); }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init); else init();
})();
