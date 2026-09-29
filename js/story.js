/* Lokalola — hero details + the scroll-driven story (prefix st-).
   The story is scrubbed by scroll position, so it plays forwards and backwards
   every time: pile of waste → the little that gets processed → smoke → energy → the unit. */
(function () {
  'use strict';
  var L = window.Lokalola; if (!L) return;
  var doc = document;

  /* ---------- Hero: fade/lift as it scrolls away, soft light that follows the cursor ---------- */
  var hero = doc.querySelector('[data-hero]');
  if (hero) {
    L.onScroll(function (y) {
      var h = hero.offsetHeight || 1;
      hero.style.setProperty('--hp', Math.min(1, Math.max(0, y / h)).toFixed(4));
    });
    if (!L.reduce && window.matchMedia('(pointer: fine)').matches) {
      var raf = 0, mx = 0, my = 0;
      hero.addEventListener('pointermove', function (e) {
        var r = hero.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top;
        if (!raf) raf = requestAnimationFrame(function () { raf = 0; hero.style.setProperty('--mx', mx + 'px'); hero.style.setProperty('--my', my + 'px'); });
        hero.classList.add('has-pointer');
      });
      hero.addEventListener('pointerleave', function () { hero.classList.remove('has-pointer'); });
    }
  }

  /* ---------- Story ---------- */
  var story = doc.querySelector('[data-st-story]');
  if (!story) return;
  var frames = [].slice.call(story.querySelectorAll('.st-frame'));
  var counts = [].slice.call(story.querySelectorAll('[data-st-count]'));
  var ticks = [].slice.call(story.querySelectorAll('.st-rail__ticks li'));
  var unit = story.querySelector('.st-story__unit');
  var canvas = story.querySelector('.st-story__canvas');
  var F = frames.length, P = 0;

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  function renderCounts() {
    var r = story.getBoundingClientRect(), vh = window.innerHeight;
    counts.forEach(function (el) {
      var i = frames.indexOf(el.closest('.st-frame')), to = parseFloat(el.dataset.stCount), d = +el.dataset.decimals || 0, k;
      // the first number counts up while the section slides in; the others as their frame arrives
      if (i === 0) k = clamp(1 - r.top / vh, 0, 1);
      else k = clamp((P - (i / F - .03)) / .1, 0, 1);
      el.textContent = L.fmt(to * ease(k), d);
    });
  }

  function renderFrames() {
    var active = 0;
    frames.forEach(function (f, i) {
      var c = (i + .5) / F, d = (P - c) * F;
      if (i === 0 && d < 0) d = 0;
      if (i === F - 1 && d > 0) d = 0;
      var o = clamp(1 - (Math.abs(d) - .26) / .22, 0, 1);
      f.style.opacity = o.toFixed(3);
      f.style.transform = 'translate3d(0,' + (d * -56).toFixed(1) + 'px,0)';
      f.classList.toggle('is-current', o > .5);
      if (o > .5) active = i;
    });
    ticks.forEach(function (t, i) { t.classList.toggle('is-active', i === active); t.classList.toggle('is-past', i < active); });
    if (unit) {
      var u = clamp((P - (F - 1.35) / F) / (.6 / F), 0, 1);
      unit.style.opacity = ease(u).toFixed(3);
      unit.style.transform = 'translate3d(0,' + ((1 - ease(u)) * 60).toFixed(1) + 'px,0) scale(' + (.86 + .14 * ease(u)).toFixed(3) + ')';
    }
  }

  if (L.reduce || !('IntersectionObserver' in window)) {
    counts.forEach(function (el) { el.textContent = L.fmt(parseFloat(el.dataset.stCount), +el.dataset.decimals || 0); });
    doc.addEventListener('lokalola:lang', function () { counts.forEach(function (el) { el.textContent = L.fmt(parseFloat(el.dataset.stCount), +el.dataset.decimals || 0); }); });
    return;
  }

  L.onScrub(story, function (p) { P = p; renderFrames(); renderCounts(); });
  L.onScroll(function () { if (P === 0) renderCounts(); });   // first number before the pin starts
  doc.addEventListener('lokalola:lang', function () { renderCounts(); });

  /* ---------- Particles ---------- */
  var ctx = canvas && canvas.getContext && canvas.getContext('2d');
  if (!ctx) return;
  var W = 0, H = 0, dpr = 1, N = 0, parts = [], states = [], running = false, t0 = performance.now();
  var CHAIN = ['#2f7fd8', '#d9a400', '#e8702a', '#3fae4f', '#a7f03a'];
  var WASTE = ['#c98a48', '#8a6a3f', '#6d8f4e', '#a5b36b', '#b89a5e', '#7f5a36'];
  function hex(h) { return [parseInt(h.substr(1, 2), 16), parseInt(h.substr(3, 2), 16), parseInt(h.substr(5, 2), 16)]; }
  function rnd(a, b) { return a + Math.random() * (b - a); }

  function area() {
    var m = W < 760;
    return m ? { x0: W * .06, x1: W * .94, y0: H * .56, y1: H * .9, m: m }
             : { x0: W * .5, x1: W * .95, y0: H * .16, y1: H * .86, m: m };
  }

  function build() {
    var r = canvas.getBoundingClientRect();
    W = r.width; H = r.height; dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var A = area(), aw = A.x1 - A.x0, ah = A.y1 - A.y0, cx = (A.x0 + A.x1) / 2;
    N = A.m ? 90 : 160;
    var processed = Math.round(N * 73 / 282);          // the share that actually gets processed
    if (parts.length !== N) {
      parts = [];
      for (var i = 0; i < N; i++) parts.push({ ph: Math.random() * 6.283, sp: rnd(.4, 1.2), u: rnd(-1, 1), h: Math.random(), k: Math.random(), lane: i % 4,
                               rA: rnd(3, 7), rS: rnd(7, 15), rE: rnd(1.8, 3.6), rO: rnd(1.6, 3.2) });
    }
    states = [[], [], [], [], []];
    var pileCx = A.m ? cx : A.x0 + aw * .58, pileW = aw * (A.m ? .42 : .4), base = A.y1, pileH = ah * .5;
    var boxX = A.m ? A.x0 + aw * .02 : A.x0 + aw * .06, boxY = A.m ? A.y1 - ah * .5 : A.y1 - ah * .42, cols = A.m ? 5 : 7, gap = A.m ? 11 : 15;
    var ucx = A.m ? cx : A.x0 + aw * .52, ucy = A.m ? A.y0 + ah * .5 : A.y0 + ah * .52, orx = Math.min(aw * .5, 420), ory = orx * .5;
    parts.forEach(function (q, i) {
      var shape = q.h * (1 - q.u * q.u);   // uniform height inside a parabola = a filled mound
      var pile = { x: pileCx + q.u * pileW, y: base - shape * pileH - 4, r: q.rA, c: hex(WASTE[i % WASTE.length]), a: .95, g: 0, w: .6 };
      // 1 · the pile
      states[0].push(pile);
      // 2 · a small share moves into a neat "processed" block, the rest greys out
      if (i < processed) states[1].push({ x: boxX + (i % cols) * gap, y: boxY + Math.floor(i / cols) * gap, r: 4.2, c: hex('#3fae4f'), a: 1, g: .3, w: .2 });
      else states[1].push({ x: pile.x, y: pile.y, r: pile.r, c: hex('#7d776c'), a: .55, g: 0, w: .6 });
      // 3 · the rest rises as smoke, a few embers glow
      if (i < processed) states[2].push({ x: boxX + (i % cols) * gap, y: boxY + Math.floor(i / cols) * gap, r: 4.2, c: hex('#3fae4f'), a: .35, g: 0, w: .2 });
      else {
        var ember = q.k < .12;
        states[2].push({ x: pileCx + q.u * pileW * .9 + (q.k - .5) * 90, y: A.y0 + q.h * ah * .75, r: ember ? 2.4 : q.rS, c: hex(ember ? '#e8702a' : '#6b736e'), a: ember ? .9 : .22, g: ember ? .8 : 0, w: 3, smoke: 1 });
      }
      // 4 · everything turns into energy: four flowing streams in the chain colours
      var tt = (i / N * 4) % 1;
      states[3].push({ x: A.x0 + tt * aw, y: A.y0 + ah * (.22 + q.lane * .19), r: q.rE, c: hex(CHAIN[q.lane]), a: .95, g: 1, w: 0, flow: 1, t: tt });
      // 5 · the energy gathers around the unit
      var ang = i / N * 6.283;
      states[4].push({ x: ucx + Math.cos(ang) * orx * (1 + (q.k - .5) * .25), y: ucy + Math.sin(ang) * ory * (1 + (q.k - .5) * .25), r: q.rO, c: hex(CHAIN[i % 5]), a: .9, g: 1, w: 0, orbit: 1, ang: ang, ox: ucx, oy: ucy, rx: orx, ry: ory });
    });
    draw(performance.now());
  }

  function mix(a, b, f) { return a + (b - a) * f; }

  function pos(s, q, now) {
    var t = (now - t0) / 1000, x = s.x, y = s.y;
    if (s.flow) {
      var A = area(), aw = A.x1 - A.x0, ah = A.y1 - A.y0;
      var tt = (s.t + t * .045 * (q.lane % 2 ? 1.2 : .9)) % 1;
      x = A.x0 + tt * aw;
      y = A.y0 + ah * (.22 + q.lane * .19) + Math.sin(tt * 9.42 + q.lane * 1.3 + t * .8) * ah * .06;
    } else if (s.orbit) {
      var a = s.ang + t * .12;
      x = s.ox + Math.cos(a) * s.rx * (1 + (q.k - .5) * .25);
      y = s.oy + Math.sin(a) * s.ry * (1 + (q.k - .5) * .25);
    } else if (s.smoke) {
      y = s.y - ((t * 14 * q.sp + q.ph * 40) % 80);
      x = s.x + Math.sin(t * q.sp + q.ph) * 12;
    } else if (s.w) {
      x += Math.sin(t * q.sp + q.ph) * s.w; y += Math.cos(t * q.sp * .8 + q.ph) * s.w;
    }
    return [x, y];
  }

  function draw(now) {
    if (!W) return;
    ctx.clearRect(0, 0, W, H);
    var seg = clamp(P * F - .5, 0, F - 1), k = Math.min(Math.floor(seg), F - 2), f = seg - k;
    for (var i = 0; i < parts.length; i++) {
      var q = parts[i], a = states[k][i], b = states[k + 1][i];
      // stagger: particles leave one after another, not as a block
      var fi = ease(clamp(f * 1.5 - q.k * .5, 0, 1));
      var pa = pos(a, q, now), pb = pos(b, q, now);
      var x = mix(pa[0], pb[0], fi), y = mix(pa[1], pb[1], fi), r = mix(a.r, b.r, fi);
      var al = mix(a.a, b.a, fi), g = mix(a.g, b.g, fi);
      var c = 'rgb(' + Math.round(mix(a.c[0], b.c[0], fi)) + ',' + Math.round(mix(a.c[1], b.c[1], fi)) + ',' + Math.round(mix(a.c[2], b.c[2], fi)) + ')';
      ctx.fillStyle = c;
      if (g > .05) { ctx.globalAlpha = al * g * .16; ctx.beginPath(); ctx.arc(x, y, r * 3.4, 0, 6.283); ctx.fill(); }
      ctx.globalAlpha = al; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function loop(now) { if (!running) return; draw(now); requestAnimationFrame(loop); }
  function start() { if (!running && !doc.hidden) { running = true; requestAnimationFrame(loop); } }
  function stop() { running = false; }

  new IntersectionObserver(function (en) { if (en[0].isIntersecting) start(); else stop(); }).observe(story);
  doc.addEventListener('visibilitychange', function () { if (doc.hidden) stop(); else if (story.getBoundingClientRect().bottom > 0 && story.getBoundingClientRect().top < window.innerHeight) start(); });
  var rt; window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () { var r = canvas.getBoundingClientRect(); if (Math.abs(r.width - W) > 2 || Math.abs(r.height - H) > 40) build(); }, 150);
  });
  build();
})();
