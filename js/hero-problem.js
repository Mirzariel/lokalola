/* Lokalola — hero + problem behaviour (prefix hp-)
   Bars / mini-bars / stacked bar are CSS-driven via the .is-in class that main.js puts on .reveal
   containers. This file only handles the "missing middle fills in" diagram. */
(function () {
  'use strict';
  var slot = document.querySelector('[data-hp-slot]');
  if (!slot) return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var timer = null;

  function fill() { clearTimeout(timer); slot.classList.add('is-filled'); }

  function empty() { clearTimeout(timer); slot.classList.remove('is-filled'); }

  // Auto-fill once the chain is on screen (after a beat so the empty state registers first).
  // Replays: it empties again only when the slot is completely out of view.
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        clearTimeout(timer);
        if (reduce) fill(); else timer = setTimeout(fill, 1500);
      });
    }, { threshold: 0.6 }).observe(slot);
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (!en.isIntersecting && !reduce) empty(); });
    }, { threshold: 0 }).observe(slot);
  } else {
    fill();
  }

  // Hovering the empty slot fills it straight away.
  slot.addEventListener('mouseenter', fill);
})();
