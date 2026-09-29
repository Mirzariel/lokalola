/* Lokalola — sections 03/04 behaviour: unit explorer + 5-step stepper (prefix sh-) */
(function () {
  'use strict';
  var doc = document;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- (a) Interactive unit explorer ---------- */
  function initExplorer(root) {
    var tabs = [].slice.call(root.querySelectorAll('.sh-spot'));
    var panels = tabs.map(function (t) { return doc.getElementById(t.getAttribute('aria-controls')); });
    if (!tabs.length) return;

    function select(i, focus) {
      i = (i + tabs.length) % tabs.length;
      tabs.forEach(function (t, k) {
        var on = k === i;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        if (panels[k]) panels[k].hidden = !on;
      });
      if (focus) tabs[i].focus();
    }

    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(i); });
      t.addEventListener('keydown', function (e) {
        var k = e.key, n = null;
        if (k === 'ArrowRight' || k === 'ArrowDown') n = i + 1;
        else if (k === 'ArrowLeft' || k === 'ArrowUp') n = i - 1;
        else if (k === 'Home') n = 0;
        else if (k === 'End') n = tabs.length - 1;
        if (n !== null) { e.preventDefault(); select(n, true); }
      });
    });
    select(0);
  }

  /* ---------- (b) Five-step stepper with gentle auto-advance ---------- */
  function initSteps(wrap) {
    var list = wrap.querySelector('.sh-steps');
    var items = [].slice.call(wrap.querySelectorAll('.sh-step'));
    if (!list || !items.length) return;
    var DUR = 5000, cur = 0, timer = null;
    var inView = false, hovered = false, focused = false;
    list.style.setProperty('--sh-dur', (DUR / 1000) + 's');

    function select(i) {
      cur = (i + items.length) % items.length;
      items.forEach(function (li, k) {
        var on = k === cur, b = li.querySelector('.sh-step__btn');
        li.classList.toggle('is-active', on);
        if (on) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
      });
      restart();
    }

    function canPlay() { return !reduce && inView && !hovered && !focused && !doc.hidden; }
    function stop() { clearTimeout(timer); timer = null; list.classList.remove('is-playing'); }
    function restart() {
      stop();
      if (!canPlay()) return;
      // force the CSS progress animation to restart on the newly active step
      void list.offsetWidth;
      list.classList.add('is-playing');
      timer = setTimeout(function () { select(cur + 1); }, DUR);
    }

    items.forEach(function (li, i) {
      li.querySelector('.sh-step__btn').addEventListener('click', function () { select(i); });
    });
    list.addEventListener('mouseenter', function () { hovered = true; stop(); });
    list.addEventListener('mouseleave', function () { hovered = false; restart(); });
    list.addEventListener('focusin', function () { focused = true; stop(); });
    list.addEventListener('focusout', function () { focused = false; restart(); });
    doc.addEventListener('visibilitychange', restart);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { inView = en.isIntersecting; restart(); });
      }, { threshold: .45 }).observe(list);
    }
  }

  function init() {
    var ex = doc.querySelector('[data-sh-explorer]');
    if (ex) initExplorer(ex);
    var st = doc.querySelector('[data-sh-steps]');
    if (st) initSteps(st);
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init); else init();
})();
