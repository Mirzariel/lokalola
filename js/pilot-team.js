/* Lokalola — pilot funding donut, audience tabs -> select, contact form (prefix tc-) */
(function () {
  'use strict';
  var doc = document;

  /* ---------- Funding donut: hover / focus / tap on segment or legend highlights both ---------- */
  function initFunding() {
    var wrap = doc.querySelector('[data-tc-funding]');
    if (!wrap) return;
    var items = [].slice.call(wrap.querySelectorAll('[data-seg]'));
    var pinned = null;

    function show(n) {
      if (n) wrap.setAttribute('data-active', n); else wrap.removeAttribute('data-active');
      items.forEach(function (el) {
        if (el.classList.contains('tc-legend__item')) el.classList.toggle('is-on', !!n && el.dataset.seg === n);
      });
    }
    items.forEach(function (el) {
      var n = el.dataset.seg;
      el.addEventListener('mouseenter', function () { show(n); });
      el.addEventListener('mouseleave', function () { show(pinned); });
      el.addEventListener('focus', function () { show(n); });
      el.addEventListener('blur', function () { show(pinned); });
      el.addEventListener('click', function () { pinned = (pinned === n) ? null : n; show(pinned); });
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pinned = (pinned === n) ? null : n; show(pinned); }
      });
    });
    doc.addEventListener('click', function (e) {
      if (pinned && !e.target.closest('[data-tc-funding]')) { pinned = null; show(null); }
    });

    // Legend bars animate on reveal
    var draw = function () { wrap.classList.add('is-drawn'); };
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { draw(); io.disconnect(); } });
      }, { threshold: .25 });
      io.observe(wrap);
    } else { draw(); }
  }

  /* ---------- Audience buttons <-> role select ---------- */
  function initContact() {
    var aud = doc.querySelector('[data-tc-aud]');
    var select = doc.querySelector('[data-tc-role]');
    var form = doc.querySelector('[data-tc-form]');
    var success = doc.querySelector('[data-tc-success]');
    if (!select) return;

    var btns = aud ? [].slice.call(aud.querySelectorAll('[data-role]')) : [];
    function mark(group) {
      btns.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.role === group ? 'true' : 'false'); });
    }
    function groupOf(value) {
      var opt = select.querySelector('option[value="' + value + '"]');
      return opt ? opt.getAttribute('data-group') : '';
    }
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        var group = b.dataset.role;
        // select the first option of that group unless the current choice already belongs to it
        if (groupOf(select.value) !== group) {
          var first = select.querySelector('option[data-group="' + group + '"]');
          if (first) select.value = first.value;
        }
        mark(group);
        var msg = doc.getElementById('tc-msg');
        if (msg && form) { try { msg.focus({ preventScroll: true }); } catch (e) { msg.focus(); } }
      });
    });
    select.addEventListener('change', function () { mark(groupOf(select.value)); });

    /* ---------- Form: native validation, then a local success panel. Nothing is sent. ---------- */
    if (form && success) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!form.checkValidity()) { form.reportValidity(); return; }
        // TODO: connect form to backend/email service (no data leaves the page for now)
        form.hidden = true;
        success.hidden = false;
        var h = success.querySelector('h3');
        if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
        success.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      });
      var reset = success.querySelector('[data-tc-reset]');
      if (reset) reset.addEventListener('click', function () {
        form.reset(); mark('');
        success.hidden = true; form.hidden = false;
        var f = form.querySelector('input'); if (f) f.focus({ preventScroll: true });
      });
    }
  }

  function init() { initFunding(); initContact(); }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init); else init();
})();
