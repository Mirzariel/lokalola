const KONTAK = { email: "lokalolaenergy@gmail.com", wa: "" }; // WA belum ada: kosong = tombol WhatsApp disembunyikan. Berawalan "[" atau kosong dianggap belum diisi.
/* Lokalola: main.js. GSAP + ScrollTrigger + model-viewer, semuanya dari vendor/. Tanpa build. */
(function () {
  "use strict";
  var html = document.documentElement;

  /* ------------ BAHASA ------------ */
  var L = (html.lang || "en").slice(0, 2) === "id" ? "id" : "en";   // bahasa tak dikenal = en
  var BASE = L === "id" ? "../" : "";            // halaman /id/ memuat aset dari induknya
  var I18N = {
    id: {
      locale: "id-ID", wa: "WhatsApp", menuBuka: "Buka menu", menuTutup: "Tutup menu",
      jedaHero: "Jeda video hero", putarHero: "Putar video hero", jedaVideo: "Jeda video", putarVideo: "Putar video",
      jedaOp: "Jeda pergantian otomatis", putarOp: "Putar pergantian otomatis", alurUlang: "Putar ulang alur",
      putarTur: "Putar video cara kerja", jedaTur: "Jeda video cara kerja", ulangTur: "Putar ulang video cara kerja",
      mvMuat: "Memuat model 3D ", pisah: "Pisahkan modul", satukan: "Satukan lagi",
      jelajahOn: "Mode jelajah aktif. Tekan Esc untuk keluar.", jelajahOff: "Mode jelajah selesai.",
      galat: { nama: "Tulis nama Anda.", dapur: "Tulis nama bisnis.", kota: "Tulis kota atau kabupaten.", porsi: "Terlalu panjang. Maksimal 60 karakter.", kontak0: "Tulis nomor WhatsApp atau email Anda.", kontak1: "Format belum benar. Contoh: 0812 3456 7890, +44 20 7946 0958, atau nama@contoh.id." },
      ringkas: function (n, daftar) { return "Ada " + n + " isian yang perlu diperbaiki: " + daftar + "."; },
      subjekPilot: "Daftar tunggu Lokalola", subjekMitra: "Investor dan mitra Lokalola",
      barisJenis: "Jenis: ", baris: ["Nama: ", "Nama bisnis: ", "Kota: ", "Volume: ", "Kontak: "],
      menyiapkan: "Menyiapkan…", hasilOk: "Aplikasi email Anda akan terbuka dengan pesan siap dikirim.", hasilOkWA: "WhatsApp akan terbuka dengan pesan siap dikirim.", terima: "Hampir selesai.", belum: "Kontak resmi belum disambungkan.",
      disalin: "Pesan disalin.", gagalSalin: "Tidak bisa menyalin otomatis. Pilih teks lalu salin sendiri.",
      mod: {
        digester: ["Digester", "Tangki HDPE 5.000 liter di luar ruangan. Di sini sisa makanan berubah jadi biogas."],
        modulgas: ["Modul gas", "Kantong 2,5 m³, penyaring belerang, dan pelepas tekanan di bawah peneduh berjaring, untuk ventilasi alami; bukaan jaringnya belum diuji."],
        umpan: ["Stasiun umpan", "Meja sortir, tangki campur, dan pompa. Sisa makanan masuk dari sini setiap hari."],
        retort: ["Retort", "Tabung baja tahan karat berulir pengantar. Serpih kering berjalan pelan, dipanaskan tanpa udara, keluar sebagai arang."],
        cerobong: ["Cerobong", "Setinggi 4,34 m (rancangan). Gas buang pembakaran keluar lewat sini, di atas kepala operator."],
        bin: ["Bin arang", "Bin tertutup dengan segel air. Arang diambil setelah dingin, di bawah 80 °C."],
        panel: ["Panel operator", "Tombol start dan stop, lampu status hijau, oranye, merah, serta tombol henti darurat. Pengaman tidak bergantung pada layar."]
      },
      def: {
        digester: "Digester: tangki tertutup tempat bakteri mengurai sisa makanan jadi biogas.",
        biogas: "Biogas: gas mudah terbakar (terutama metana) dari pembusukan tanpa udara.",
        retort: "Retort: tungku berupa tabung tertutup yang memanaskan serpih tanpa udara sampai jadi arang.",
        digestat: "Digestat: sisa cairan dan padatan dari digester. Mutunya sebagai pupuk belum diuji.",
        arang: "Arang: hasil pemanasan serpih tanpa udara, sering disebut biochar. Mutunya belum diuji.",
        serpih: "Serpih kering: biomassa kering berukuran 20 mm atau lebih kecil (asumsi rancangan), dari pemasok sampah kering."
      }
    },
    en: {
      locale: "en-US", wa: "WhatsApp", menuBuka: "Open menu", menuTutup: "Close menu",
      jedaHero: "Pause hero video", putarHero: "Play hero video", jedaVideo: "Pause video", putarVideo: "Play video",
      jedaOp: "Pause automatic rotation", putarOp: "Resume automatic rotation", alurUlang: "Replay flow",
      putarTur: "Play the how-it-works video", jedaTur: "Pause the how-it-works video", ulangTur: "Replay the how-it-works video",
      mvMuat: "Loading 3D model ", pisah: "Separate modules", satukan: "Put back together",
      jelajahOn: "Explore mode on. Press Esc to exit.", jelajahOff: "Explore mode off.",
      galat: { nama: "Enter your name.", dapur: "Enter the business name.", kota: "Enter your city or regency.", porsi: "Too long. 60 characters at most.", kontak0: "Enter your WhatsApp number or email.", kontak1: "Not a valid phone number or email. Example: +44 20 7946 0958 or name@example.com." },
      ringkas: function (n, daftar) { return n + (n === 1 ? " field needs" : " fields need") + " fixing: " + daftar + "."; },
      subjekPilot: "Lokalola waitlist sign-up", subjekMitra: "Lokalola investors and partners",
      barisJenis: "Type: ", baris: ["Name: ", "Business name: ", "City: ", "Volume: ", "Contact: "],
      menyiapkan: "Preparing…", hasilOk: "Your email app should open with the message ready to send.", hasilOkWA: "WhatsApp should open with the message ready to send.", terima: "Almost done.", belum: "No official contact is connected yet.",
      disalin: "Message copied.", gagalSalin: "Could not copy automatically. Select the text and copy it yourself.",
      mod: {
        digester: ["Digester", "5,000 L HDPE tank, outdoors. Food waste becomes biogas here."],
        modulgas: ["Gas module", "A 2.5 m³ bag, a sulfur filter and a pressure relief, under a netted canopy for natural ventilation. The net opening has not been tested."],
        umpan: ["Feed station", "Sorting table, mixing tank and pump. Food waste enters here every day."],
        retort: ["Retort", "A stainless steel tube with a screw conveyor. Dry chips move slowly, are heated without air, and leave as char."],
        cerobong: ["Chimney", "4.34 m tall (design). Combustion exhaust leaves here, above the operator’s head."],
        bin: ["Char bin", "A closed bin with a water seal. Char is removed once cool, below 80 °C."],
        panel: ["Operator panel", "Start and stop buttons, green, orange and red status lights, and an emergency stop. Safety does not depend on the screen."]
      },
      def: {
        digester: "Digester: a closed tank where bacteria break food waste down into biogas.",
        biogas: "Biogas: a flammable gas (mostly methane) made when material rots without air.",
        retort: "Retort: a kiln built as a closed tube that heats dry chips without air until they become char.",
        digestat: "Digestate: the liquid and solids left over from the digester. Its quality as fertilizer has not been tested.",
        arang: "Char (also called biochar): what is left when chips are heated without air. Its quality has not been tested.",
        serpih: "Dry chips: dry biomass cut to 20 mm or smaller (design assumption), from dry-waste suppliers."
      }
    }
  };
  var TX = I18N[L];
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var REDUCE = mqReduce.matches;
  if (REDUCE) html.classList.add("reduce");
  var conn = navigator.connection || {};
  var HEMAT = !!conn.saveData || (navigator.deviceMemory && navigator.deviceMemory <= 2);
  var BERAT_MATI = REDUCE || HEMAT;            // video, tur, 3D otomatis dimatikan
  var mqPonsel = window.matchMedia("(max-width: 767px)");
  var heroProg = function () { return 1; };   // diganti initHero: kemajuan cerita hero (0..1)
  var mqHalus = window.matchMedia("(pointer: fine)");
  var mqKasar = window.matchMedia("(pointer: coarse)");
  function fmt(v, dec) { return v.toLocaleString(TX.locale, { minimumFractionDigits: dec, maximumFractionDigits: dec }); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function smooth(t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); }
  function sineIO(t) { return -(Math.cos(Math.PI * t) - 1) / 2; }
  function idle(fn, t) { if ("requestIdleCallback" in window) requestIdleCallback(fn, { timeout: t || 2500 }); else setTimeout(fn, 300); }
  function modul(nama, fn) { try { fn(); } catch (e) { console.error("[lokalola] modul gagal: " + nama, e); } }
  function io(el, cb, opt) { if (!el || !("IntersectionObserver" in window)) return null; var o = new IntersectionObserver(cb, opt || {}); o.observe(el); return o; }

  function init() {
    if (!window.gsap || !window.ScrollTrigger) { console.error("[lokalola] GSAP tidak termuat"); return; }
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    gsap.ticker.lagSmoothing(0);

    modul("kontak", initKontak);
    modul("nav", initNav);
    modul("reveal", initReveal);
    modul("hero", initHero);
    modul("masalah", initMasalah);
    modul("alur", initAlur);
    modul("tur", initTur);
    modul("mesin", initMesin);
    modul("operator", initOperator);
    modul("denah", initDenah);
    modul("spek", initSpek);
    modul("status", initStatus);
    modul("form", initForm);
    modul("mitra", initMitra);
    modul("istilah", initIstilah);
    modul("tipo", initTipo);

    html.classList.remove("js-gagal");
    html.classList.add("js-ok");
    window.dispatchEvent(new Event("scroll"));   // sinkronkan nav setelah cerita hero siap
    // tautan #bagian: refresh ScrollTrigger mengembalikan halaman ke atas, jadi posisi disetel lagi setelah tata letak tetap, selama pembaca belum menggulir
    var hashEl = location.hash.length > 1 ? document.getElementById(location.hash.slice(1)) : null, sudahGulir = false;
    if (hashEl) {
      if ("scrollRestoration" in history) history.scrollRestoration = "manual";
      ["wheel", "touchstart", "keydown", "pointerdown"].forEach(function (ev) { window.addEventListener(ev, function () { sudahGulir = true; }, { once: true, passive: true }); });
    }
    function keHash() { if (hashEl && !sudahGulir) { if (scrollTween) scrollTween.kill(); var y = hashEl.getBoundingClientRect().top + window.scrollY - (hashEl.matches("section") ? 0 : (parseFloat(getComputedStyle(html).getPropertyValue("--nav-h")) || 56) + 16); window.scrollTo(0, Math.max(0, Math.round(y))); } }
    window.addEventListener("load", function () { setTimeout(function () { ScrollTrigger.refresh(); keHash(); setTimeout(keHash, 700); }, 200); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); keHash(); });
  }

  /* ------------ KONTAK ------------ */
  var KONTAK_ADA = { email: false, wa: false };
  function initKontak() {
    KONTAK_ADA.email = typeof KONTAK.email === "string" && KONTAK.email.charAt(0) !== "[" && KONTAK.email.indexOf("@") > 0;
    KONTAK_ADA.wa = typeof KONTAK.wa === "string" && KONTAK.wa.charAt(0) !== "[" && KONTAK.wa.replace(/\D/g, "").length >= 8;
    var lokal = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
    if (lokal && !KONTAK_ADA.email && !KONTAK_ADA.wa) {
      var p = $("#dev-plat"); if (p) p.hidden = false;
      console.warn("[lokalola] KONTAK belum diisi: ubah konstanta KONTAK di baris pertama main.js.");
    }
    var ft = $("#ft-kontak");
    if (ft && (KONTAK_ADA.email || KONTAK_ADA.wa)) {
      var h = [];
      if (KONTAK_ADA.email) h.push('<a class="tautan" href="mailto:' + encodeURI(KONTAK.email) + '">' + KONTAK.email.replace(/</g, "&lt;") + "</a>");
      if (KONTAK_ADA.wa) h.push('<a class="tautan" rel="noopener" target="_blank" href="https://wa.me/' + KONTAK.wa.replace(/\D/g, "") + '">' + TX.wa + "</a>");
      ft.innerHTML = h.join(" · "); ft.hidden = false;
    }
  }

  /* ------------ SCROLL KE ------------ */
  var scrollTween = null;
  function scrollKe(y, dur) {
    if (scrollTween) scrollTween.kill();
    y = Math.max(0, Math.round(y));
    if (REDUCE || !dur) { window.scrollTo(0, y); return; }
    var o = { y: window.scrollY };
    scrollTween = gsap.to(o, { y: y, duration: dur, ease: "power3.inOut", onUpdate: function () { window.scrollTo(0, o.y); }, onComplete: function () { scrollTween = null; } });
  }
  function scrollKeEl(el) {
    var navh = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 56;
    if (el.id === "hero") { scrollKe(0, .8); return; }
    var y = el.getBoundingClientRect().top + window.scrollY - (el.matches("section") ? 0 : navh + 16);
    scrollKe(y, .8);
  }
  window.addEventListener("wheel", function () { if (scrollTween) { scrollTween.kill(); scrollTween = null; } }, { passive: true });
  window.addEventListener("touchstart", function () { if (scrollTween) { scrollTween.kill(); scrollTween = null; } }, { passive: true });

  /* ------------ NAV ------------ */
  function initNav() {
    var nav = $("#nav"), navAksi = $("#nav-aksi"), prog = $("#nav-progres");
    var links = $$(".nav-links a");
    var logo = $(".nav-logo");
    function scrolled() { nav.classList.toggle("sc", window.scrollY > 80); }
    scrolled(); window.addEventListener("scroll", scrolled, { passive: true });
    if (!REDUCE) {
      gsap.fromTo(prog, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: true } });
    } else {
      window.addEventListener("scroll", function () { var m = document.documentElement.scrollHeight - innerHeight; prog.style.transform = "scaleX(" + (m > 0 ? scrollY / m : 0) + ")"; }, { passive: true });
    }
    // tombol aksi nav tampil setelah tombol hero keluar layar
    var heroAksi = $("#hero-aksi");
    function setAksi(on) { navAksi.classList.toggle("tampil", on); navAksi.tabIndex = on ? 0 : -1; if (on) navAksi.removeAttribute("aria-hidden"); else navAksi.setAttribute("aria-hidden", "true"); }
    // tema bilah mengikuti bagian di bawahnya; tautan aktif
    var secs = $$("main > section[data-tema], footer[data-tema]");
    var navh = function () { return parseFloat(getComputedStyle(html).getPropertyValue("--nav-h")) || 56; };
    function cek() {
      var y = navh() / 2, cur = null;
      setAksi(heroAksi.getBoundingClientRect().bottom < navh() || heroProg() < .7);
      secs.forEach(function (s) { var r = s.getBoundingClientRect(); if (r.top <= y && r.bottom > y) cur = s; });
      if (!cur) return;
      if (nav.dataset.tema !== cur.dataset.tema) nav.dataset.tema = cur.dataset.tema;
      links.forEach(function (a) { var on = a.getAttribute("href") === "#" + cur.id; if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current"); });
    }
    var tick = false;
    window.addEventListener("scroll", function () { if (tick) return; tick = true; requestAnimationFrame(function () { tick = false; cek(); }); }, { passive: true });
    window.addEventListener("resize", cek); cek();
    // menu ponsel
    var btn = $("#menu-btn"), menu = $("#menu"), main = $("#isi"), foot = $("#footer"), tutupM = null;
    function terbuka() { return menu.classList.contains("buka"); }
    var luarMenu = function () { return $$(".skip").concat([$(".nav-logo"), navAksi]); };
    function buka() {
      menu.hidden = false; menu.classList.add("buka"); nav.classList.add("menu-buka");
      btn.setAttribute("aria-expanded", "true"); btn.setAttribute("aria-label", TX.menuTutup);
      main.inert = true; foot.inert = true; document.body.style.overflow = "hidden";
      luarMenu().forEach(function (e) { if (e) e.inert = true; });
      if (!REDUCE) { gsap.fromTo(menu, { opacity: 0 }, { opacity: 1, duration: .2, ease: "none" }); gsap.fromTo($$("li, .btn", menu), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .32, stagger: .05, ease: "power2.out" }); }
      var f = $("a", menu); if (f) f.focus();
    }
    function tutup(balik) {
      if (!terbuka()) return;
      menu.classList.remove("buka"); menu.hidden = true; nav.classList.remove("menu-buka");
      btn.setAttribute("aria-expanded", "false"); btn.setAttribute("aria-label", TX.menuBuka);
      main.inert = false; foot.inert = false; document.body.style.overflow = "";
      luarMenu().forEach(function (e) { if (e) e.inert = false; });
      if (balik !== false) btn.focus();
    }
    btn.addEventListener("click", function () { terbuka() ? tutup() : buka(); });
    document.addEventListener("keydown", function (e) {
      if (!terbuka()) return;
      if (e.key === "Escape") { tutup(); return; }
      if (e.key === "Tab") {
        var f = [btn].concat($$("a, button", menu)).filter(function (x) { return !x.disabled && x.getClientRects().length; });
        var i = f.indexOf(document.activeElement);
        if (i < 0) { e.preventDefault(); f[0].focus(); return; }
        if (e.shiftKey && i === 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    });
    // klik tautan jangkar
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute("href").slice(1); if (!id) return;
      var el = document.getElementById(id); if (!el) return;
      if (a.closest("#menu")) { e.preventDefault(); tutup(false); setTimeout(function () { scrollKeEl(el); history.replaceState(null, "", "#" + id); syncLang(); }, 30); return; }
      e.preventDefault(); scrollKeEl(el); history.replaceState(null, "", "#" + id); syncLang();
      if (a.classList.contains("skip")) { el.setAttribute("tabindex", "-1"); el.focus({ preventScroll: true }); }
    });
    // tombol bahasa: tetap di bagian yang sama (#hash) di halaman setara
    var lsw = $$(".lang a[data-base]");
    function syncLang() { lsw.forEach(function (a) { a.setAttribute("href", a.dataset.base + (location.hash || "")); }); }
    syncLang(); window.addEventListener("hashchange", syncLang);
    lsw.forEach(function (a) { ["click", "focus", "pointerenter", "touchstart", "contextmenu"].forEach(function (ev) { a.addEventListener(ev, syncLang, { passive: true }); }); });
    // masuk logo
    if (!REDUCE) gsap.from(logo, { opacity: 0, y: -8, duration: .48, delay: .2, ease: "power2.out", clearProps: "opacity,y" });
    window.addEventListener("resize", function () { if (terbuka() && innerWidth >= 1200) tutup(false); });
  }

  /* ------------ TIPOGRAFI: dua kata terakhir tidak terpisah (tanpa kata yatim), di luar hero ------------ */
  function initTipo() {
    // kutipan besar tidak diikat: dua kata terakhirnya bisa lebih lebar dari layar 320 px
    $$("main p, main li, main figcaption, main .nilai, main .spek-ket, footer p").forEach(function (e) {
      if (e.closest("#hero, .sr-only, .tur-sr, [hidden]") || e.querySelector("p, li, h3, h4, div, ul, ol")) return;
      var w = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), n, last = null;
      while ((n = w.nextNode())) if (n.nodeValue.trim()) last = n;
      if (last) last.nodeValue = last.nodeValue.replace(/[ \t\r\n]+(?=\S+[ \t\r\n]*$)/, " ");
    });
  }

  /* ------------ REVEAL UMUM ------------ */
  function initReveal() {
    if (REDUCE) return;
    var rv = $$("main section:not(#hero) .rv").filter(function (e) { return !e.classList.contains("angka-blok"); });
    ScrollTrigger.batch(rv, {
      start: "top 90%", once: true,
      onEnter: function (els) {
        gsap.to(els, { opacity: 1, y: 0, duration: .64, ease: "power2.out", stagger: .08, overwrite: "auto" });
      }
    });
    // judul bertopeng: kelompok per induk
    var groups = new Map();
    $$("main section:not(#hero) .baris").forEach(function (b) { var p = b.parentElement; if (!groups.has(p)) groups.set(p, []); groups.get(p).push(b); });
    groups.forEach(function (list, p) {
      var spans = list.map(function (b) { return b.firstElementChild; });
      gsap.set(spans, { y: 0, yPercent: 105 });
      ScrollTrigger.create({ trigger: p, start: "top 88%", once: true, onEnter: function () { gsap.to(spans, { yPercent: 0, duration: .72, ease: "expo.out", stagger: .11 }); } });
    });
    // tirai media (kecuali foto masalah dan operator, yang punya urutan sendiri)
  }

  /* ------------ HERO ------------ */
  function initHero() {
    var hero = $("#hero"), tutup = $("#hero-tutup"), video = $("#hero-video"), jeda = $("#hero-jeda");
    var panggung = $("#hero-panggung"), tagBig = $("#hero-tag-big"), h1 = $("#h-hero"), wrap = $("#hero-mesin"), img = $("#hero-mesin-img");
    var lantai = $("#hero-tirai-lantai"), heroB = $(".hero-b", hero), hint = $("#hero-hint");
    if (!hero || !panggung || !tagBig || !h1 || !wrap || !img || !heroB) return;
    // proporsi mesin di dalam frame 16:9 (dari matte)
    var F = { kiri: 237 / 1920, kanan: 1784 / 1920, pusat: .5263, dasar: 810 / 1080, tangki: 480 / 1080 };
    var G = { skala: 1, y: 0, naik: 0, geserAwal: 0 };   // hasil tata(): dibaca fungsi-nilai animasi
    var ponsel = false, masukSudah = false;
    var jarak = function () { return Math.round(innerHeight * (innerWidth < 1024 ? 1.8 : 2.2)); };
    var bar = function (el) { return $$(".bar", el); };
    var dgn = function (o, f) { if (!ponsel) o.filter = f; return o; };   // blur hanya di desktop (berat di ponsel)

    // pecah baris dari atribut data (| = baris baru, [..] = frasa lime, ~ = spasi dengan celah lebar); teks utuh tetap dengan spasi tunggal antarbaris
    function isi(el) {
      var pola = ponsel ? el.dataset.m : el.dataset.d;
      if (!pola) return;
      el.innerHTML = pola.split("|").map(function (b) { return '<span class="bar"><span>' + b.replace(/\[([^\]]*)\]/g, '<span class="acc">$1</span>').replace(/~/g, '<span class="celah"> </span>') + "</span></span>"; }).join(" ");
    }
    // tiap baris dibuat selebar `lebar`: ukur di 100 px (offsetWidth, kebal scale panggung), lalu skalakan
    function pas(el, lebar) {
      var bs = [].slice.call(el.children), tinggi = 0;
      var ukur = bs.map(function (b) { b.style.fontSize = "100px"; return Math.max(1, b.firstChild.offsetWidth); });
      bs.forEach(function (b, i) { var fs = lebar / ukur[i] * 100; b.style.fontSize = fs + "px"; b.style.lineHeight = "1"; tinggi += fs; });
      return { tinggi: tinggi, akhir: parseFloat(bs[bs.length - 1].style.fontSize) };
    }
    function tata() {
      if (!bar(tagBig).length || !bar(h1).length) return;
      var vw = hero.clientWidth, vh = hero.clientHeight, ph = ponsel;
      var nav = parseFloat(getComputedStyle(html).getPropertyValue("--nav-h")) || (ph ? 56 : 64);
      // lebar blok = lebar mesin, supaya tulisan dan mesin berbagi dua tepi yang sama
      var lebar = vw - (ph ? 32 : Math.max(48, vw * .1)), hasil, ht, tBawah, tAtas, fw, dasar, tangki;
      for (var i = 0; i < 12; i++) {
        fw = lebar / (F.kanan - F.kiri);
        var fh = fw * 9 / 16;
        hasil = pas(tagBig, lebar); ht = pas(h1, lebar);
        var tMaks = Math.max(hasil.tinggi, ht.tinggi), X = (F.dasar - F.tangki) * fh;
        // garis dasar huruf tepat di atas kubah tangki: hanya turunan huruf, tiang, dan cerobong yang menimpa
        // desktop: dasar di 83% tinggi, kecuali layar tegak (tablet) yang membuat atas kosong: tumpukan dipusatkan antara nav dan petunjuk gulir
        dasar = ph ? nav + 14 + tMaks - hasil.akhir * .15 + X : Math.min(vh * .83, nav + (vh - 60 - nav + X + tMaks - hasil.akhir * .15) / 2);
        tangki = dasar - X;
        tBawah = tangki + hasil.akhir * .15;
        tAtas = tBawah - tMaks;
        if (ph || tAtas >= nav + 6) break;
        lebar *= .96;
      }
      wrap.style.width = fw + "px";
      wrap.style.height = (fw * 9 / 16) + "px";
      wrap.style.left = (vw / 2 - F.pusat * fw) + "px";
      wrap.style.top = (dasar - F.dasar * fw * 9 / 16) + "px";
      tagBig.style.top = (tBawah - hasil.tinggi) + "px";
      h1.style.top = (tangki + ht.akhir * .15 - ht.tinggi) + "px";   // tiap blok memakai ukuran baris terakhirnya sendiri, supaya garis dasarnya sama
      G.naik = Math.max(hasil.tinggi, ht.tinggi) * .62;
      // ruang = jarak teks dari mesin + sisa bawah: desktop 44 + 32; ponsel 24 + 76 (76 px di bawah catatan: tombol jeda 44 px di bottom 16 punya napas 16 px)
      var hb = heroB.offsetHeight, ruang = ph ? 24 + 76 : 44 + 32, batasAtas = nav + (ph ? 6 : 18);   // desktop: kepala huruf paling sedikit 18 px di bawah nav
      G.skala = Math.min(1, (vh - hb - ruang) / dasar);
      G.y = 0;
      if (tAtas * G.skala < batasAtas) {
        // layar pendek: panggung mengecil sambil turun agar judul tidak menabrak nav
        G.skala = Math.min(1, (vh - hb - ruang - batasAtas) / (dasar - tAtas));
        G.y = batasAtas - tAtas * G.skala;
      }
      G.geserAwal = ph ? Math.max(0, (vh - dasar - 70) / 2) : 0;   // ponsel: babak 1 dan 2 dipusatkan pada tinggi layar
      var dasarAkhir = dasar * G.skala + G.y;
      heroB.style.top = (dasarAkhir + (ph ? 24 : 44)) + "px";
      if (lantai) lantai.style.top = (dasarAkhir - 8) + "px";   // tirai lantai tepat di bawah kaki mesin
    }
    // masuk (sekali, setelah font siap): tirai terbuka, mesin tampil, baris tagline naik dari belakang mesin, baris bawah dulu
    function masuk() {
      if (masukSudah) return;
      masukSudah = true;
      var tl = gsap.timeline();
      if (tutup) tl.to(tutup, { opacity: 0, duration: .5, onComplete: function () { tutup.style.display = "none"; } }, 0);
      tl.to(wrap, { opacity: 1, duration: 1.1, ease: "power2.out" }, .1)
        .to(bar(tagBig).reverse(), dgn({ opacity: 1, y: 0, duration: 1.5, stagger: .16, ease: "power3.out" }, "blur(0px)"), .7);
    }

    if (!REDUCE) {
      gsap.set(wrap, { opacity: 0 });
      // babak 2 dan 3: hero dipin, digulir mulus (scrub). Tanpa JS atau gerak dikurangi: semua babak tampil statis (CSS dasar).
      var mm = gsap.matchMedia();
      mm.add({ ph: "(max-width: 767px)", dk: "(min-width: 768px)" }, function (ctx) {
        ponsel = !!ctx.conditions.ph;
        isi(tagBig); isi(h1);   // baris dibangun ulang saat melewati 768
        tata();
        var tb = bar(tagBig), hb = bar(h1), bw = [].slice.call(heroB.children);
        var naik = function () { return G.naik; };
        gsap.set(panggung, { y: G.geserAwal });
        gsap.set(hb, dgn({ opacity: 0, y: naik }, "blur(10px)"));
        gsap.set(bw, { opacity: 0, y: 14 });
        gsap.set(heroB, { pointerEvents: "none" });   // tombol babak 3 belum terlihat: jangan bisa diklik tak sengaja
        if (!masukSudah) gsap.set(tb, dgn({ opacity: 0, y: naik }, "blur(14px)"));
        var tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { id: "hero-cerita", trigger: hero, start: "top top", end: function () { return "+=" + jarak(); }, pin: true, scrub: .8, anticipatePin: 1, invalidateOnRefresh: true, refreshPriority: 10 }
        });
        if (hint) tl.to(hint, { opacity: 0, duration: .4 }, 0);
        // tagline: titik awal tetap (terlihat penuh), supaya tidak bergantung pada animasi masuk yang mungkin belum selesai saat refresh
        tl.fromTo(tb, dgn({ opacity: 1, y: 0 }, "blur(0px)"), dgn({ opacity: 0, y: naik, duration: 1.1, stagger: .1, ease: "power2.in", immediateRender: false }, "blur(12px)"), .3)
          .to(hb.slice().reverse(), dgn({ opacity: 1, y: 0, duration: 1.3, stagger: .14, ease: "power3.out" }, "blur(0px)"), 1.4)
          .fromTo(panggung, { scale: 1, y: function () { return G.geserAwal; } }, { scale: function () { return G.skala; }, y: function () { return G.y; }, duration: 1.2, ease: "power2.inOut" }, 3.2);
        if (lantai) tl.to(lantai, { opacity: 1, duration: .9 }, 3.4);
        tl.to(bw, { opacity: 1, y: 0, duration: .8, stagger: .14, ease: "power2.out" }, 3.8)
          .set(heroB, { pointerEvents: "auto" }, 3.9)
          .to({}, { duration: 1 }, 5);
        var st = tl.scrollTrigger;
        heroProg = function () { return st.progress; };
        // fokus keyboard masuk ke babak 3: gulir ke sana supaya teks dan tombol terlihat
        var fokus = function () { if (st.progress < .8) window.scrollTo(0, st.start + (st.end - st.start) * .86); };
        heroB.addEventListener("focusin", fokus);
        return function () { heroB.removeEventListener("focusin", fokus); heroProg = function () { return 1; }; };
      });
      // ukuran baris dihitung ulang sebelum setiap refresh dan saat lebar layar berubah
      ScrollTrigger.addEventListener("refreshInit", tata);
      var lebarAwal = innerWidth, tUkuran = 0;
      window.addEventListener("resize", function () {
        clearTimeout(tUkuran);
        tUkuran = setTimeout(function () { if (innerWidth === lebarAwal) return; lebarAwal = innerWidth; ScrollTrigger.refresh(); }, 150);
      });
      (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () { tata(); masuk(); });
    }

    // video kemas: warna di atas, matte di bawah, digambar ke kanvas WebGL tembus pandang; gambar diam jadi cadangan
    // gerbang: bukan hemat data, ponsel hanya 4g, ada WebGL; dimuat setelah load + idle; main hanya saat hero terlihat
    var userPause = false, visible = true, dimuat = false, mati = false, tampil = false;
    var ponselLambat = mqPonsel.matches && conn.effectiveType && conn.effectiveType !== "4g";
    var gl = null, kanvas = null, rvfc = 0, raf = 0, jalan = false;
    function sinkron() {
      if (!dimuat || mati) return;
      var mau = visible && !userPause && !document.hidden;
      if (mau && video.paused) video.play().catch(function () {});
      if (!mau && !video.paused) video.pause();
    }
    function berhenti() {
      jalan = false;
      if (rvfc && video.cancelVideoFrameCallback) video.cancelVideoFrameCallback(rvfc);
      if (raf) cancelAnimationFrame(raf);
      rvfc = raf = 0;
    }
    function gambar() {
      if (video.readyState < 2) return;
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (!tampil) { tampil = true; wrap.appendChild(kanvas); img.style.visibility = "hidden"; if (jeda) jeda.classList.add("ada"); }
    }
    function langkah() { rvfc = raf = 0; jalan = false; if (mati || video.paused) return; gambar(); minta(); }
    function minta() {   // satu panggilan per frame, berhenti sendiri saat video pause
      if (jalan || mati || !gl) return;
      jalan = true;
      if (video.requestVideoFrameCallback) rvfc = video.requestVideoFrameCallback(langkah); else raf = requestAnimationFrame(langkah);
    }
    function ukuran() {
      var w = video.videoWidth;
      if (!w || !gl) return;
      var h = Math.round(w * 9 / 16);
      if (kanvas.width !== w || kanvas.height !== h) { kanvas.width = w; kanvas.height = h; gl.viewport(0, 0, w, h); }
    }
    function balik() {   // galat video atau konteks hilang: kembali ke gambar diam
      if (mati) return;
      mati = true; berhenti();
      try { video.pause(); video.removeAttribute("src"); video.load(); } catch (e) { /* abaikan */ }
      if (kanvas && kanvas.parentNode) kanvas.parentNode.removeChild(kanvas);
      img.style.visibility = "";
      if (jeda) jeda.classList.remove("ada");
    }
    function muat() {
      if (BERAT_MATI || ponselLambat || !video || mati || dimuat || !window.WebGLRenderingContext) return;
      var m = innerWidth < 768 && video.dataset.srcM, w0 = m ? 800 : 1600;
      kanvas = document.createElement("canvas"); kanvas.width = w0; kanvas.height = w0 * 9 / 16; kanvas.setAttribute("aria-hidden", "true");
      gl = kanvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false });
      if (!gl) { kanvas = null; return; }
      function sh(t, s) { var o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); return o; }
      var pr = gl.createProgram();
      gl.attachShader(pr, sh(gl.VERTEX_SHADER, "attribute vec2 p;varying vec2 u;void main(){u=vec2(p.x*.5+.5,.5-p.y*.5);gl_Position=vec4(p,0.,1.);}"));
      gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, "precision mediump float;varying vec2 u;uniform sampler2D t;uniform float k;void main(){float h=1./(1.+k);vec3 c=texture2D(t,vec2(u.x,u.y*h)).rgb;float m=texture2D(t,vec2(u.x*k,h+u.y*(1.-h))).r;m=smoothstep(.03,.97,m);float l=clamp((u.y-.7222)/.0324,0.,1.);float a=max(m,l);gl_FragColor=vec4(c*smoothstep(0.,.12,a),a);}"));
      gl.linkProgram(pr);
      if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { gl = null; kanvas = null; return; }
      gl.useProgram(pr);
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      var lp = gl.getAttribLocation(pr, "p"); gl.enableVertexAttribArray(lp); gl.vertexAttribPointer(lp, 2, gl.FLOAT, false, 0, 0);
      gl.uniform1f(gl.getUniformLocation(pr, "k"), 1);
      gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
      [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]].forEach(function (x) { gl.texParameteri(gl.TEXTURE_2D, x[0], x[1]); });
      kanvas.addEventListener("webglcontextlost", function (e) { e.preventDefault(); balik(); });
      video.addEventListener("error", balik);
      video.addEventListener("loadedmetadata", ukuran);
      video.addEventListener("playing", minta);
      video.addEventListener("pause", berhenti);
      dimuat = true;
      video.preload = "auto";
      video.src = m ? video.dataset.srcM : video.dataset.src;
      sinkron();
    }
    function mulai() { idle(muat, 3000); }
    if (document.readyState === "complete") mulai(); else window.addEventListener("load", mulai);
    io(hero, function (e) { visible = e[0].isIntersecting && (e[0].intersectionRatio > .5 || e[0].intersectionRect.height > innerHeight * .5); sinkron(); }, { threshold: [0, .5, 1] });
    document.addEventListener("visibilitychange", sinkron);
    if (jeda) jeda.addEventListener("click", function () { userPause = !userPause; jeda.setAttribute("aria-pressed", userPause); jeda.setAttribute("aria-label", userPause ? TX.putarHero : TX.jedaHero); jeda.innerHTML = userPause ? '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>' : '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>'; sinkron(); });
  }

  /* ------------ MASALAH ------------ */
  function stokVideo(video, tombol, wadah) {
    var user = false, vis = false;
    function sink() { if (!video.dataset.siap) return; var mau = vis && !user && !document.hidden && !BERAT_MATI; if (mau && video.paused) video.play().catch(function () {}); if (!mau && !video.paused) video.pause(); }
    function pasang() { if (video.dataset.siap) return; video.dataset.siap = "1"; video.src = video.dataset.src + (BERAT_MATI ? "#t=0.6" : ""); video.preload = BERAT_MATI ? "metadata" : "auto"; }
    video.addEventListener("error", function () {
      var cad = video.dataset.cadangan;
      if (cad && video.dataset.src !== cad && video.dataset.siap) { video.removeAttribute("poster"); video.dataset.src = cad; video.src = cad; if (vis && !user && !BERAT_MATI) video.play().catch(function () {}); }
    });
    if (BERAT_MATI) { if (!video.hasAttribute("poster")) pasang(); if (tombol) tombol.hidden = true; return; }
    io(wadah || video, function (e) { vis = e[0].isIntersecting; if (vis) pasang(); sink(); }, { threshold: .3, rootMargin: "200px 0px" });
    document.addEventListener("visibilitychange", sink);
    if (tombol) tombol.addEventListener("click", function () { user = !user; tombol.setAttribute("aria-pressed", user); tombol.setAttribute("aria-label", user ? TX.putarVideo : TX.jedaVideo); tombol.innerHTML = user ? '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>' : '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>'; sink(); });
  }
  function countUp(el, dur, delay) {
    var ke = parseFloat(el.dataset.ke), dec = parseInt(el.dataset.dec || "0", 10), suf = el.dataset.suf || "";
    var o = { v: 0 };
    el.textContent = fmt(0, dec) + suf;
    return gsap.to(o, { v: ke, duration: dur || 1.4, delay: delay || 0, ease: "power2.out", onUpdate: function () { el.textContent = fmt(o.v, dec) + suf; }, onComplete: function () { el.textContent = fmt(ke, dec) + suf; } });
  }
  function initMasalah() {
    stokVideo($("#stok-video"), $("#video-jeda"), $("#m-video-band"));
    stokVideo($("#stok-serpih"), $("#serpih-jeda"), $("#stok-serpih").closest(".media-in"));
    if (REDUCE) return;
    var fig = $("#m-foto"), tirai = $(".tirai", fig), img = $("img", fig), judul = $(".m-h2");
    gsap.set(img, { scale: 1.12 });
    ScrollTrigger.create({ trigger: fig, start: "top 75%", once: true, onEnter: function () {
      var tl = gsap.timeline();
      tl.to(tirai, { scaleX: 0, transformOrigin: "100% 50%", duration: .9, ease: "power3.inOut" }, .3)
        .to(img, { scale: 1, duration: 1.2, ease: "expo.out" }, .3);
    } });
    // angka: nilai akhir sudah ada di HTML; hanya saat JS hidup angka dikosongkan sesaat sebelum hitung-naik
    var blokAngka = $$(".angka-blok");
    gsap.set(blokAngka, { opacity: 0, y: 24 });
    ScrollTrigger.create({ trigger: ".m-angka", start: "top 82%", once: true, onEnter: function () {
      gsap.to(blokAngka, { opacity: 1, y: 0, duration: .64, ease: "power2.out", stagger: .16, delay: .2 });
      $$(".cnt-a").forEach(function (c, i) { countUp(c, 1.4, .25 + i * .16); });
    } });
    if (mqHalus.matches || innerWidth >= 768) {
      var wrap = $(".m-foto-in");
      gsap.fromTo(img, { y: -24 }, { y: 24, ease: "none", scrollTrigger: { trigger: wrap, start: "top bottom", end: "bottom top", scrub: true } });
    }
  }

  /* ------------ CARA KERJA: modul dan pipa menyala berurutan ------------ */
  function initFlow() {
    var flow = $("#flow"); if (!flow) return;
    var stages = $$(".stage, .mini", flow), pipes = $$(".pipe, .mp", flow);
    // giliran menyala (x520 ms): s1=1, s2=4, digestat=6, s3=7, serpih=8, gas sisa=9, s4=10, s5=12
    var urut = { "1": 1, "2": 4, "d": 6, "3": 7, "g": 9, "k": 8, "4": 10, "5": 12 };
    var STEP = 520, timers = [], sudah = false, btn = $("#fl-ulang");
    function semua() { stages.concat(pipes).forEach(function (e) { e.classList.add("on"); }); }
    function reset() { timers.forEach(clearTimeout); timers = []; stages.concat(pipes).forEach(function (e) { e.classList.remove("on"); }); }
    function putar() {
      reset();
      if (REDUCE) { semua(); return; }
      void flow.offsetWidth;
      stages.forEach(function (e) { var t = urut[e.getAttribute("data-st")]; timers.push(setTimeout(function () { e.classList.add("on"); }, t * STEP)); });
      pipes.forEach(function (e) { var t = +e.getAttribute("data-seq"); timers.push(setTimeout(function () { e.classList.add("on"); }, t * STEP)); });
    }
    if (btn) { btn.textContent = TX.alurUlang; if (!REDUCE) { btn.hidden = false; btn.addEventListener("click", putar); } }
    if (REDUCE) { semua(); return; }
    var o = io(flow, function (es) { es.forEach(function (e) { if (e.isIntersecting && !sudah) { sudah = true; putar(); if (o) o.disconnect(); } }); }, { threshold: 0, rootMargin: "0px 0px -22% 0px" });
    if (!o) semua();
  }

  /* ------------ ALUR SVG (legenda + diagram mitra) ------------ */
  // urutan fraksi progres: [mulai, selesai]
  var URUT = { basah: [0, .22], biogas: [.22, .5], kering: [.45, .6], panas: [.55, .72], arang: [.72, .88], digestat: [.5, .68] };
  var ORIGIN = { x: "0% 50%", xr: "100% 50%", y: "50% 100%", y0: "50% 0%" };
  var beadSets = [];
  function siapAlur(svg, mode, trigger) {
    var segs = {};
    $$(".seg", svg).forEach(function (g) {
      var key = g.dataset.key, dir = g.dataset.dir, mid = /#([^)]+)\)/.exec(g.getAttribute("mask"))[1];
      var rect = $("#" + mid + " .mk", svg) || document.querySelector("#" + mid + " .mk");
      segs[key] = { g: g, dir: dir, rect: rect, path: $(".pth", g), key: key };
    });
    var nodes = {}; $$(".nd", svg).forEach(function (n) { nodes[n.dataset.key] = n; });
    var halo = $(".halo", svg), beadsG = $(".beads", svg);
    var ns = "http://www.w3.org/2000/svg";
    // manik: 4 per segmen
    var beads = [];
    Object.keys(segs).forEach(function (k) {
      var s = segs[k], L = s.path.getTotalLength();
      s.L = L; s.beads = [];
      for (var i = 0; i < 4; i++) {
        var c = document.createElementNS(ns, "circle"); c.setAttribute("r", "4"); c.setAttribute("class", "bead"); c.setAttribute("fill", "#F2F5F1"); c.style.opacity = 0; beadsG.appendChild(c);
        s.beads.push({ el: c, off: i / 4 });
      }
      beads.push(s);
    });
    function posisiManik(s, t) { // t detik
      var scale = svg.getBoundingClientRect().width / svg.viewBox.baseVal.width || 1;
      var v = 90 / scale; // unit SVG per detik
      s.beads.forEach(function (b) {
        var d = ((t * v) + b.off * s.L) % s.L, pt = s.path.getPointAtLength(d);
        b.el.setAttribute("transform", "translate(" + pt.x.toFixed(1) + " " + pt.y.toFixed(1) + ")");
      });
    }
    function manikTengah(s) { s.beads.forEach(function (b, i) { var pt = s.path.getPointAtLength(s.L * (.2 + i * .2)); b.el.setAttribute("transform", "translate(" + pt.x + " " + pt.y + ")"); b.el.style.opacity = 1; }); }
    var nodeKey = { basah: "basah", biogas: "basah", digestat: "digestat", panas: "biogas", arang: "arang" }; // simpul muncul saat segmen ini selesai
    // keadaan awal
    function awal() {
      Object.keys(segs).forEach(function (k) { gsap.set(segs[k].rect, { scaleX: segs[k].dir === "x" || segs[k].dir === "xr" ? 0 : 1, scaleY: segs[k].dir === "y" || segs[k].dir === "y0" ? 0 : 1, transformOrigin: ORIGIN[segs[k].dir] }); gsap.set(segs[k].g, { opacity: 1 }); });
      Object.keys(nodes).forEach(function (k) { gsap.set(nodes[k], { opacity: 0, scale: .6, transformOrigin: "50% 50%" }); });
      if (halo) gsap.set(halo, { opacity: 0, transformOrigin: "50% 50%" });
      if (nodes.basah) gsap.set(nodes.basah, { opacity: 1, scale: 1 });
    }
    function akhir() {
      Object.keys(segs).forEach(function (k) { gsap.set(segs[k].rect, { scaleX: 1, scaleY: 1 }); gsap.set(segs[k].g, { opacity: 1 }); manikTengah(segs[k]); });
      Object.keys(nodes).forEach(function (k) { gsap.set(nodes[k], { opacity: 1, scale: 1 }); });
      if (halo) gsap.set(halo, { opacity: .8 });
    }
    if (REDUCE) { akhir(); return; }
    awal();
    var selesai = {}, aktif = false, t0 = 0;
    var tl = gsap.timeline({ paused: true, onUpdate: function () {
      var p = tl.progress();
      Object.keys(segs).forEach(function (k) { selesai[k] = p >= URUT[k][1] - .001; });
    } });
    var total = mode === "timed" ? 3.2 : 1;
    function pos(f) { return f * total; }
    Object.keys(segs).forEach(function (k) {
      var s = segs[k], a = URUT[k][0], b = URUT[k][1];
      var vars = s.dir === "x" || s.dir === "xr" ? { scaleX: 1 } : { scaleY: 1 };
      tl.to(s.rect, Object.assign({ duration: pos(b - a), ease: "none" }, vars), pos(a));
    });
    function munculNode(key, f) { var n = nodes[key]; if (n) tl.to(n, { opacity: 1, scale: 1, duration: pos(.04) + (mode === "timed" ? .32 : 0), ease: "back.out(1.4)" }, pos(f)); }
    munculNode("biogas", URUT.basah[1] - .02); munculNode("digestat", URUT.digestat[1] - .02);
    munculNode("panas", URUT.biogas[1] - .02); munculNode("arang", URUT.arang[1] - .02);
    if (halo) {
      if (mode === "timed") {
        tl.fromTo(halo, { opacity: 0 }, { opacity: .9, duration: .7 * .4, ease: "power2.out" }, pos(URUT.biogas[1] - .03))
          .to(halo, { opacity: .35, duration: .7 * .6, ease: "power2.inOut" }, pos(URUT.biogas[1] - .03) + .28);
      } else {
        tl.to(halo, { opacity: 1, duration: pos(.17), ease: "none" }, pos(.55));
      }
    }
    tl.add(function () {}, total);
    tl.duration(total);
    if (mode === "timed") {
      ScrollTrigger.create({ trigger: trigger, start: "top 75%", once: true, onEnter: function () { aktif = true; tl.timeScale(1).play(0); } });
    } else {
      tl.pause();
      ScrollTrigger.create({ trigger: trigger, start: "top 70%", end: "bottom 55%", scrub: .5, animation: tl });
    }
    // manik berjalan di ticker GSAP, hanya bila terlihat
    var lihat = false;
    io(trigger, function (e) { lihat = e[0].isIntersecting; }, { rootMargin: "100px" });
    gsap.ticker.add(function (time) {
      if (!lihat || document.hidden || svg.getClientRects().length === 0) return;
      beads.forEach(function (s) {
        if (!selesai[s.key]) { s.beads.forEach(function (b) { b.el.style.opacity = 0; }); return; }
        s.beads.forEach(function (b) { b.el.style.opacity = 1; });
        posisiManik(s, time);
      });
    });
  }
  function initAlur() {
    initFlow();
    $$("#mt-diag svg").forEach(function (s) { siapAlur(s, "timed", $("#mt-diag")); });
  }

  /* ------------ TUR VIDEO ------------ */
  var WARNA_ADEGAN = ["#F2F5F1", "#BFEBD0", "#2EC4D3", "#E066C0", "#8A8D94"];
  var IKON_JEDA = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>';
  var IKON_MAIN = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
  function initTur() {
    var tur = $("#tur"), tv = $("#tv"), v = $("#tv-video"); if (!tur || !tv || !v) return;
    var teks = $$(".tur-teks", tv), hitung = $("#tv-hitung"), relBtn = $$("#tur-rel button", tv);
    var putar = $("#tv-putar"), ulang = $("#tv-ulang"), umum = $("#tv-umum");
    var mulai = teks.map(function (t) { return parseFloat(t.dataset.mulai) || 0; });
    var kecil = innerWidth < 768;                       // sumber dipilih sekali saat dimuat
    var user = BERAT_MATI;                              // true = belum/tidak diputar pengguna (hemat: menunggu tombol putar)
    var lihat = false, selesai = false, dipasang = false, mati = false, aktif = -1, rvfc = 0, terakhir = "";
    function statis() {
      if (mati) return; mati = true;
      v.pause(); tur.classList.add("statis");
      setTimeout(function () { ScrollTrigger.refresh(); }, 50);
      console.warn("[lokalola] tur: video gagal, beralih ke mode statis");
    }
    function pasang() {
      if (dipasang) return; dipasang = true;
      v.preload = "auto";
      v.src = kecil ? v.dataset.srcM : v.dataset.src;
    }
    function main() {
      var pr = v.play();
      if (pr && pr.catch) pr.catch(function (e) { if (e && e.name === "NotAllowedError") { user = true; tombol(); } });
    }
    function tombol() {
      putar.setAttribute("aria-pressed", user);
      putar.setAttribute("aria-label", user ? TX.putarTur : TX.jedaTur);
      putar.innerHTML = user ? IKON_MAIN : IKON_JEDA;
    }
    // jalan bila: terlihat, tab aktif, tidak dijeda pengguna, belum selesai
    function sink() {
      if (!dipasang || mati || selesai) return;
      var mau = lihat && !user && !document.hidden;
      if (mau && v.paused) main(); else if (!mau && !v.paused) v.pause();
    }
    function bab(t) { var i = 0; mulai.forEach(function (m, k) { if (t >= m) i = k; }); return i; }
    function ganti(i) {
      aktif = i;
      teks.forEach(function (t, k) { t.classList.toggle("aktif", k === i); });
      relBtn.forEach(function (b, k) { if (k === i) b.setAttribute("aria-current", "step"); else b.removeAttribute("aria-current"); });
      hitung.textContent = "0" + (i + 1) + " / 05";
    }
    function perbarui() {
      var t = v.currentTime || 0, d = v.duration || 34.21, i = selesai ? 4 : bab(t);
      if (i !== aktif) ganti(i);
      var fr = relBtn.map(function (b, k) {
        var akhir = k < 4 ? mulai[k + 1] : d;
        return selesai || k < i ? 1 : k === i ? clamp((t - mulai[k]) / Math.max(.01, akhir - mulai[k]), 0, 1) : 0;
      });
      var kunci = fr.map(function (f) { return f.toFixed(3); }).join();
      if (kunci === terakhir) return;
      terakhir = kunci;
      relBtn.forEach(function (b, k) { $("b", b).style.transform = "scaleX(" + fr[k] + ")"; });
    }
    // progres halus per frame video, hanya selama diputar
    function minta() {
      if (!v.requestVideoFrameCallback || rvfc) return;
      rvfc = v.requestVideoFrameCallback(function () { rvfc = 0; perbarui(); if (!v.paused && !v.ended) minta(); });
    }
    function umumkan(i) {
      if (!umum) return;
      umum.textContent = "";
      setTimeout(function () { umum.textContent = hitung.textContent + ": " + $("h3", teks[i]).textContent; }, 60);
    }
    function ulangi() {
      selesai = false; user = false; ulang.hidden = true; tombol();
      v.currentTime = 0; main(); putar.focus();
    }

    relBtn.forEach(function (b, k) {
      $("b", b).style.background = WARNA_ADEGAN[k];
      b.addEventListener("click", function () {
        pasang(); selesai = false; user = false; ulang.hidden = true; tombol();
        v.currentTime = mulai[k] + .01;
        ganti(k); perbarui(); umumkan(k); main();
      });
    });
    putar.addEventListener("click", function () {
      if (selesai) { ulangi(); return; }
      user = !user; tombol();
      if (user) { v.pause(); return; }
      pasang(); main();
    });
    ulang.addEventListener("click", ulangi);
    ulang.setAttribute("aria-label", TX.ulangTur);

    v.addEventListener("timeupdate", perbarui);
    v.addEventListener("seeked", perbarui);
    v.addEventListener("playing", minta);
    v.addEventListener("pause", perbarui);
    v.addEventListener("ended", function () {
      selesai = true; ulang.hidden = false; user = true; tombol();
      ganti(4); perbarui();
    });
    v.addEventListener("error", function () { if (dipasang) statis(); });
    document.addEventListener("visibilitychange", sink);

    ganti(0); perbarui(); tombol();
    if (!("IntersectionObserver" in window)) { lihat = true; if (!BERAT_MATI) { pasang(); sink(); } return; }
    // hemat/reduced motion: tidak memuat dan tidak memutar sampai tombol putar ditekan
    if (!BERAT_MATI) io(tur, function (e) { if (e[0].isIntersecting) pasang(); }, { rootMargin: "300px 0px" });
    io(v, function (e) {
      lihat = e[0].isIntersecting && e[0].intersectionRatio >= .49;   // putar otomatis bila >= 50% terlihat
      if (lihat && !BERAT_MATI) pasang();
      sink();
    }, { threshold: [0, .25, .49, .5, .75, 1] });
  }

  /* ------------ MESIN 3D ------------ */
  var MOD = {
    digester: { n: 1, nama: TX.mod.digester[0], pos: [-2.439, 1.175, .655], tgt: [-2.439, 1.175, .655], orb: "-20deg 80deg 6m", skid: "a", teks: TX.mod.digester[1] },
    modulgas: { n: 2, nama: TX.mod.modulgas[0], pos: [-3.239, 1.07, -2.045], tgt: [-3.239, 1.07, -2.045], orb: "-35deg 80deg 5.5m", skid: "a", teks: TX.mod.modulgas[1] },
    umpan: { n: 3, nama: TX.mod.umpan[0], pos: [-.236, .645, 1.308], tgt: [-.236, .645, 1.308], orb: "-12deg 84deg 4.5m", skid: "b", teks: TX.mod.umpan[1] },
    retort: { n: 4, nama: TX.mod.retort[0], pos: [4.357, 1.12, .155], tgt: [4.357, 1.4, .155], orb: "20deg 78deg 7m", skid: "c", teks: TX.mod.retort[1] },
    cerobong: { n: 5, nama: TX.mod.cerobong[0], pos: [4.907, 3.095, -1.035], tgt: [4.907, 3.095, -1.035], orb: "25deg 72deg 7m", skid: "c", teks: TX.mod.cerobong[1] },
    bin: { n: 6, nama: TX.mod.bin[0], pos: [4.567, .301, 1.395], tgt: [4.567, .301, 1.395], orb: "30deg 80deg 3.5m", skid: "c", teks: TX.mod.bin[1] },
    panel: { n: 7, nama: TX.mod.panel[0], pos: [3.786, 1.245, 3.042], tgt: [3.786, 1.245, 3.042], orb: "-15deg 80deg 3m", skid: "d", teks: TX.mod.panel[1] }
  };
  var SKID = { a: [-3.2, 0, 0], b: [0, 0, 3.0], c: [3.2, 0, 0], d: [1.6, 0, 2.4] };
  var KLIP = "pisahkan_modul", KLIP_DUR = 2.5, KLIP_AKHIR = 2.49;
  var AWAL = { tgt: "0m 1.4m 0m", orb: "-28deg 78deg 11m" }, TERPISAH = { tgt: "-0.5m 1.0m 1.2m", orb: "-28deg 70deg 15.5m" };
  function skalaR(orb, aspek) { var f = Math.max(1, 1.6 / Math.max(.5, aspek)); return orb.replace(/([\d.]+)m$/, function (m, r) { return (parseFloat(r) * f).toFixed(2) + "m"; }); }
  function webglAda() { try { var c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch (e) { return false; } }
  function m3(v) { return v[0].toFixed(3) + "m " + v[1].toFixed(3) + "m " + v[2].toFixed(3) + "m"; }
  function initMesin() {
    var viewer = $("#mv-viewer"), mv = $("#mv"), sec = $("#mesin");
    var chips = $$(".chip-mod"), panel = $("#mv-panel"), pJudul = $("#mv-p-judul"), pTeks = $("#mv-p-teks"), pNo = $("#mv-p-no"), pTutup = $("#mv-p-tutup");
    var btnPisah = $("#mv-pisah"), btnJel = $("#mv-jelajah"), bar = $("#mv-keluar"), zoomBox = $("#mv-zoom"), live = $("#mv-live");
    var muatI = $("#mv-muat i"), muatT = $("#mv-muat-t"), galat = $("#mv-galat"), btnUlang = $("#mv-ulang");
    var btnAR = $("#mv-ar"), arTidak = $("#mv-ar-tidak"), arBantu = $(".mv-ar-bantu");
    var hs = $$(".hs", mv);
    function R(o) { return skalaR(o, viewer.clientWidth / Math.max(1, viewer.clientHeight)); }
    // kamera awal/reset: di ponsel radius +30% agar digester tidak terpotong
    function RA(o) { var r = R(o); return mqPonsel.matches ? r.replace(/([\d.]+)m$/, function (m, v) { return (parseFloat(v) * 1.3).toFixed(2) + "m"; }) : r; }
    var state = { ditunda: !!HEMAT, dimuat: false, memuat: false, aktif: null, pemicu: null, pisah: false, sibuk: false, spin: false, jelajah: false, fracSep: 0, siap: false };
    chips.forEach(function (c) { c.setAttribute("aria-pressed", "false"); });

    function sembunyiKontrol() { }
    function tanpa3D(alasan) {
      viewer.classList.add("tanpa3d"); viewer.classList.remove("memuat");
      galat.hidden = false; btnPisah.hidden = true; btnJel.hidden = true; zoomBox.hidden = true;
      if (alasan) console.warn("[lokalola] 3D: " + alasan);
    }
    function pastikanTombol() {
      btnJel.hidden = !mqKasar.matches;
      zoomBox.hidden = !(mqHalus.matches || state.jelajah);
    }
    // ---------- muat
    var terpasang = false, percobaan = 0;
    function pasangPendengar() {
      if (terpasang) return; terpasang = true;
      mv.addEventListener("progress", function (e) { var f = e.detail.totalProgress || 0; gsap.set(muatI, { scaleX: f }); muatT.textContent = TX.mvMuat + Math.round(f * 100) + "%"; });
      mv.addEventListener("load", function () { selesaiMuat(); });
      mv.addEventListener("error", function (e) { console.error("[lokalola] model-viewer error", e.detail); state.memuat = false; tanpa3D("galat memuat"); });
    }
    function muat() {
      if (state.memuat || state.dimuat) return;
      if (!webglAda()) { tanpa3D("tanpa WebGL"); return; }
      state.memuat = true; galat.hidden = true; viewer.classList.remove("tanpa3d"); viewer.classList.add("memuat");
      import("./vendor/model-viewer.min.js").then(function (mod) {
        var MVE = mod.ModelViewerElement || customElements.get("model-viewer");
        if (MVE) { MVE.dracoDecoderLocation = BASE + "vendor/draco/"; }
        return customElements.whenDefined("model-viewer");
      }).then(function () {
        mv.cameraOrbit = REDUCE ? RA(AWAL.orb) : RA("-68deg 74deg 14m");
        mv.cameraTarget = AWAL.tgt;
        mv.interpolationDecay = REDUCE ? 0 : 120;
        pasangPendengar();
        mv.removeAttribute("src");
        percobaan++;
        mv.src = BASE + "assets/3d/lokalola.glb" + (percobaan > 1 ? "?r=" + Date.now() : "");
      }).catch(function (e) { console.error("[lokalola] impor model-viewer gagal", e); state.memuat = false; tanpa3D("impor gagal"); });
    }
    function selesaiMuat() {
      state.dimuat = true; state.memuat = false; viewer.classList.remove("memuat"); viewer.classList.add("pasti");
      pastikanTombol();
      var ada = (mv.availableAnimations || []).indexOf(KLIP) >= 0;
      btnPisah.hidden = !ada;
      if (ada) { mv.animationName = KLIP; mv.pause(); mv.currentTime = 0; }
      if (mv.canActivateAR) { btnAR.hidden = false; arTidak.hidden = true; } else { btnAR.hidden = true; arTidak.hidden = false; arBantu.hidden = true; }
      if (state.aktif) { mv.cameraTarget = m3(targetPonsel(state.aktif)); mv.cameraOrbit = R(MOD[state.aktif].orb); }
      jalankanPembuka();
      setTimeout(function () { if (typeof mulaiAuto === "function" && state.terlihat60) mulaiAuto(); }, 2200);
    }
    function jalankanPembuka() {
      if (state.spin) return;
      if (!state.terlihat) return;
      state.spin = true;
      if (!REDUCE) { mv.interpolationDecay = 120; mv.cameraOrbit = RA(AWAL.orb); setTimeout(function () { mv.interpolationDecay = 100; munculHotspot(); }, 1800); }
      else munculHotspot();
    }
    function munculHotspot() {
      if (state.siap) return; state.siap = true;
      if (REDUCE) return;
      gsap.fromTo(hs, { scale: .6 }, { scale: 1, duration: .32, ease: "back.out(1.4)", stagger: .07 });
      hs.forEach(function (h, i) { gsap.fromTo($("i", h), { scale: 1, opacity: .5 }, { scale: 1.9, opacity: 0, duration: 1.8, ease: "power1.out", repeat: 2, delay: i * .07, onComplete: function () { gsap.set($("i", h), { clearProps: "all" }); } }); });
    }
    io(sec, function (e) { if (e[0].isIntersecting && !state.dimuat && !state.memuat && !state.ditunda) muat(); }, { rootMargin: "150% 0px" });
    io(viewer, function (e) {
      state.terlihat = e[0].intersectionRatio >= .45; if (state.terlihat && state.dimuat) jalankanPembuka();
      if (!e[0].isIntersecting && state.jelajah) keluarJelajah();
    }, { threshold: [0, .45] });
    btnUlang.addEventListener("click", function () { state.memuat = false; state.dimuat = false; galat.hidden = true; muat(); });
    // ---------- pilih modul
    function tampilPanel(k) {
      var m = MOD[k];
      pJudul.textContent = m.nama; pTeks.textContent = m.teks; pNo.textContent = m.n + " / 7";
      panel.hidden = false;
      if (REDUCE) { gsap.set(panel, { opacity: 1, x: 0, y: 0 }); }
      else gsap.fromTo(panel, mqPonsel.matches ? { opacity: 0, y: 24 } : { opacity: 0, x: 24 }, { opacity: 1, x: 0, y: 0, duration: .32, ease: "power2.out", clearProps: "transform" });
      pJudul.focus({ preventScroll: true });
      setTimeout(function () { panel.classList.toggle("bisa-gulir", panel.scrollHeight > panel.clientHeight + 4); }, 360);
      live.textContent = m.nama + ": " + m.teks;
    }
    function targetPonsel(k) {
      var t = posModul(k);
      if (mqPonsel.matches) { var r = parseFloat((R(MOD[k].orb).match(/([\d.]+)m$/) || [0, 6])[1]); t[1] -= r * .1; }
      return t;
    }
    function posModul(k) { var m = MOD[k], s = state.pisah ? SKID[m.skid] : [0, 0, 0]; return [m.tgt[0] + s[0], m.tgt[1] + s[1], m.tgt[2] + s[2]]; }
    function pilih(k, pemicu) {
      if (!MOD[k]) return;
      state.aktif = k; state.pemicu = pemicu || null;
      chips.forEach(function (c) { c.setAttribute("aria-pressed", c.dataset.modul === k ? "true" : "false"); });
      hs.forEach(function (h) { h.classList.toggle("pilih", h.dataset.modul === k); h.classList.toggle("redup", h.dataset.modul !== k); });
      if (state.dimuat) {
        mv.interpolationDecay = REDUCE ? 0 : 100;
        mv.cameraTarget = m3(targetPonsel(k)); mv.cameraOrbit = R(MOD[k].orb);
        if (REDUCE && mv.jumpCameraToGoal) mv.jumpCameraToGoal();
      }
      var tunda = REDUCE || !state.dimuat ? 0 : 350;
      setTimeout(function () { if (state.aktif === k) tampilPanel(k); }, tunda);
      if (!state.dimuat && !state.memuat) { state.ditunda = false; muat(); }
    }
    function tutupPanel(balik) {
      var k = state.aktif; if (!k) return;
      state.aktif = null;
      chips.forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
      hs.forEach(function (h) { h.classList.remove("pilih", "redup"); });
      var selesai = function () { panel.hidden = true; };
      if (REDUCE) selesai(); else gsap.to(panel, { opacity: 0, duration: .2, ease: "none", onComplete: selesai });
      if (state.dimuat) { var T = state.pisah ? TERPISAH : AWAL; mv.interpolationDecay = REDUCE ? 0 : 100; mv.cameraTarget = T.tgt; mv.cameraOrbit = RA(T.orb); if (REDUCE && mv.jumpCameraToGoal) mv.jumpCameraToGoal(); }
      if (balik !== false && state.pemicu && document.contains(state.pemicu)) state.pemicu.focus({ preventScroll: true });
    }
    chips.forEach(function (c) { c.addEventListener("click", function () { if (state.aktif === c.dataset.modul) tutupPanel(); else pilih(c.dataset.modul, c); }); });
    hs.forEach(function (h) { h.addEventListener("click", function (e) { e.stopPropagation(); pilih(h.dataset.modul, h); }); });
    pTutup.addEventListener("click", function () { tutupPanel(); });
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      if (state.jelajah) { keluarJelajah(); return; }
      if (state.aktif && !panel.hidden) tutupPanel();
    });
    $("#mv-reset").addEventListener("click", function () { if (state.aktif) tutupPanel(false); else if (state.dimuat) { var T = state.pisah ? TERPISAH : AWAL; mv.cameraTarget = T.tgt; mv.cameraOrbit = RA(T.orb); } });
    mv.addEventListener("click", function (e) { if (e.target === mv && state.aktif) tutupPanel(false); });
    // ---------- zoom
    function zoom(f) { if (!state.dimuat) return; var o = mv.getCameraOrbit(); mv.cameraOrbit = o.theta + "rad " + o.phi + "rad " + clamp(o.radius * f, 2, 26) + "m"; }
    $("#mv-plus").addEventListener("click", function () { zoom(1 / 1.12); });
    $("#mv-min").addEventListener("click", function () { zoom(1.12); });
    // ---------- mode jelajah (layar sentuh)
    function masukJelajah() { state.jelajah = true; viewer.classList.add("jelajah"); mv.removeAttribute("disable-zoom"); bar.hidden = false; zoomBox.hidden = false; btnJel.setAttribute("aria-pressed", "true"); live.textContent = TX.jelajahOn; }
    function keluarJelajah() { state.jelajah = false; viewer.classList.remove("jelajah"); mv.setAttribute("disable-zoom", ""); bar.hidden = true; btnJel.setAttribute("aria-pressed", "false"); zoomBox.hidden = !mqHalus.matches; live.textContent = TX.jelajahOff; }
    btnJel.setAttribute("aria-pressed", "false");
    btnJel.addEventListener("click", function () { state.jelajah ? keluarJelajah() : masukJelajah(); });
    $("#mv-keluar-btn").addEventListener("click", keluarJelajah);
    // ---------- pisahkan modul
    var proxy = { t: 0 };
    function posisiHotspot(f) {
      hs.forEach(function (h) {
        var m = MOD[h.dataset.modul], s = SKID[m.skid], b = h.dataset.basis ? h.dataset.basis.split(" ").map(Number) : (h.dataset.basis = h.dataset.position, h.dataset.position.split(" ").map(Number));
        try { mv.updateHotspot({ name: h.getAttribute("slot"), position: (b[0] + s[0] * f).toFixed(3) + " " + (b[1] + s[1] * f).toFixed(3) + " " + (b[2] + s[2] * f).toFixed(3) }); } catch (e) {}
      });
    }
    function setPisah(on) {
      if (state.sibuk || !state.dimuat) return;
      state.sibuk = true;
      if (state.aktif) tutupPanel(false);
      state.pisah = on;
      btnPisah.setAttribute("aria-pressed", on ? "true" : "false");
      var tinggalLabel = function () { btnPisah.textContent = on ? TX.satukan : TX.pisah; };
      var T = on ? TERPISAH : AWAL;
      hs.forEach(function (h) { h.classList.add("sembunyi"); });
      var akhirnya = function () { proxy.t = on ? KLIP_AKHIR : 0; mv.currentTime = proxy.t; posisiHotspot(on ? 1 : 0); state.sibuk = false; setTimeout(function () { hs.forEach(function (h) { h.classList.remove("sembunyi"); }); }, REDUCE ? 0 : 240); };
      mv.interpolationDecay = REDUCE ? 0 : 100; mv.cameraTarget = T.tgt; mv.cameraOrbit = RA(T.orb);
      if (REDUCE) { tinggalLabel(); akhirnya(); if (mv.jumpCameraToGoal) mv.jumpCameraToGoal(); return; }
      gsap.to(btnPisah, { opacity: 0, duration: .12, onComplete: function () { tinggalLabel(); gsap.to(btnPisah, { opacity: 1, duration: .12 }); } });
      mv.animationName = KLIP; mv.pause();
      gsap.to(proxy, { t: on ? KLIP_AKHIR : 0, duration: 1.4, ease: "none", delay: .16, onUpdate: function () { mv.currentTime = proxy.t; }, onComplete: akhirnya });
    }
    btnPisah.addEventListener("click", function () { batalAuto(); setPisah(!state.pisah); });
    // pisah modul otomatis sekali: viewer >=60% terlihat, belum disentuh, bukan reduced-motion/saveData
    var auto = { selesai: false, batal: false, t: [] };
    function batalAuto() {
      if (auto.batal) return; auto.batal = true;
      auto.t.forEach(clearTimeout); auto.t = [];
      if (auto.terpisahOtomatis && state.pisah && !state.sibuk) { auto.terpisahOtomatis = false; setPisah(false); }
    }
    ["pointerdown", "keydown", "wheel", "touchstart"].forEach(function (ev) { viewer.addEventListener(ev, batalAuto, { passive: true }); });
    chips.forEach(function (c) { c.addEventListener("click", batalAuto); });
    function mulaiAuto() {
      if (auto.selesai || auto.batal || REDUCE || HEMAT || !state.dimuat || btnPisah.hidden) return;
      auto.selesai = true;
      auto.t.push(setTimeout(function () {
        if (auto.batal || state.aktif || !state.terlihat60) { auto.selesai = false; return; }
        auto.terpisahOtomatis = true; setPisah(true);
        auto.t.push(setTimeout(function () { if (auto.batal) return; auto.terpisahOtomatis = false; setPisah(false); }, 1400 + 160 + 1200));
      }, 2400));
    }
    io(viewer, function (e) { state.terlihat60 = e[0].intersectionRatio >= .6; if (state.terlihat60) mulaiAuto(); else if (auto.t.length && !auto.selesai) { /* tunggu */ } }, { threshold: [0, .6, 1] });
    window.__autoPisah = function () { mulaiAuto(); };
    // ---------- AR
    btnAR.addEventListener("click", function () { try { mv.activateAR(); } catch (e) { console.warn(e); } });
    pastikanTombol();
    mqKasar.addEventListener && mqKasar.addEventListener("change", pastikanTombol);
    window.__mv = { state: state, mv: mv, pilih: pilih };
  }

  /* ------------ OPERATOR ------------ */
  function initOperator() {
    var tabs = $$(".op-baris"), imgs = $$(".op-img"), panel = $("#op-panel"), jeda = $("#op-jeda"), sec = $("#operator");
    var bars = tabs.map(function (t) { return $(".op-bar", t); });
    var aktif = 0, tw = null, berhentiUser = false, terlihat = false, userJeda = false;
    function tampilPenuh(i) { bars.forEach(function (b, k) { gsap.killTweensOf(b); b.classList.remove("full"); gsap.set(b, { scaleX: 0 }); }); bars[i].classList.add("full"); gsap.set(bars[i], { scaleX: 1 }); }
    function pilih(i, manual) {
      if (i === aktif && !manual) return;
      var lama = aktif; aktif = i;
      tabs.forEach(function (t, k) { t.setAttribute("aria-selected", k === i); t.tabIndex = k === i ? 0 : -1; });
      panel.setAttribute("aria-labelledby", "op-tab-" + i);
      imgs.forEach(function (im, k) { im.setAttribute("aria-hidden", k === i ? "false" : "true"); });
      if (REDUCE) { imgs.forEach(function (im, k) { gsap.to(im, { opacity: k === i ? 1 : 0, duration: .2, ease: "none" }); }); }
      else if (lama !== i) {
        gsap.to(imgs[lama], { opacity: 0, x: -24, duration: .6, ease: "power3.inOut" });
        gsap.fromTo(imgs[i], { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: .6, ease: "power3.inOut" });
      }
    }
    function jalan() {
      if (REDUCE || berhentiUser || userJeda || !terlihat || document.hidden) return;
      if (tw) tw.kill();
      bars.forEach(function (b, k) { b.classList.remove("full"); if (k !== aktif) gsap.set(b, { scaleX: 0 }); });
      tw = gsap.fromTo(bars[aktif], { scaleX: 0 }, { scaleX: 1, duration: 6, ease: "none", onComplete: function () { var n = (aktif + 1) % tabs.length; pilih(n, true); jalan(); } });
    }
    function henti() { if (tw) { tw.kill(); tw = null; } bars.forEach(function (b, k) { gsap.set(b, { scaleX: k === aktif ? 1 : 0 }); b.classList.toggle("full", k === aktif); }); }
    function stopUser() { berhentiUser = true; henti(); }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { stopUser(); pilih(i, true); henti(); });
      t.addEventListener("mouseenter", function () { if (mqHalus.matches) stopUser(); });
      t.addEventListener("focus", stopUser);
      t.addEventListener("touchstart", stopUser, { passive: true });
      t.addEventListener("keydown", function (e) {
        var k = null;
        if (e.key === "ArrowDown" || e.key === "ArrowRight") k = (i + 1) % tabs.length;
        else if (e.key === "ArrowUp" || e.key === "ArrowLeft") k = (i + tabs.length - 1) % tabs.length;
        else if (e.key === "Home") k = 0; else if (e.key === "End") k = tabs.length - 1;
        if (k !== null) { e.preventDefault(); stopUser(); pilih(k, true); tabs[k].focus(); henti(); }
      });
    });
    jeda.addEventListener("click", function () {
      userJeda = !userJeda; jeda.setAttribute("aria-pressed", userJeda); jeda.setAttribute("aria-label", userJeda ? TX.putarOp : TX.jedaOp);
      jeda.innerHTML = userJeda ? '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>' : '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>';
      if (userJeda) henti(); else { berhentiUser = false; jalan(); }
    });
    if (REDUCE) { jeda.hidden = true; tampilPenuh(0); }
    imgs.forEach(function (im, k) { gsap.set(im, { opacity: k === 0 ? 1 : 0, x: 0 }); im.classList.remove("on"); });
    io(sec, function (e) {
      terlihat = e[0].intersectionRatio > .5 || (e[0].isIntersecting && e[0].boundingClientRect.height > innerHeight * 1.4 && e[0].intersectionRatio > .25);
      if (terlihat) jalan(); else { if (tw) { tw.kill(); tw = null; } if (!e[0].isIntersecting) { berhentiUser = false; } }
    }, { threshold: [0, .25, .5] });
    document.addEventListener("visibilitychange", function () { if (document.hidden) { if (tw) { tw.kill(); tw = null; } } else jalan(); });
    // masuk: tirai gambar
    if (!REDUCE) {
      var tirai = $(".tirai", panel);
      gsap.set(imgs[0], { scale: 1.12 });
      ScrollTrigger.create({ trigger: panel, start: "top 80%", once: true, onEnter: function () { gsap.to(tirai, { scaleX: 0, transformOrigin: "100% 50%", duration: .9, ease: "power3.inOut" }); gsap.to(imgs[0], { scale: 1, duration: 1.2, ease: "expo.out" }); } });
      ScrollTrigger.batch($$(".op-baris"), { start: "top 88%", once: true, onEnter: function (els) { gsap.to(els, { opacity: 1, y: 0, duration: .64, stagger: .14, ease: "power2.out", overwrite: "auto" }); } });
    }
  }

  /* ------------ DENAH KESELAMATAN ------------ */
  function initDenah() {
    var svg = $("#denah"); if (!svg) return;
    var lis = $$("#kes-daftar li"), pens = $$(".pen", svg), tgs = $$(".tg", svg), angka = $("#dn-angka-n");
    var nums = function (el) { return (el.getAttribute("data-n") || "").split(/\s+/); };
    function fokus(n) {
      svg.classList.add("has-f");
      pens.forEach(function (p) { p.classList.toggle("is-f", p.getAttribute("data-n") === n); });
      tgs.forEach(function (t) { t.classList.toggle("is-f", nums(t).indexOf(n) > -1); });
      lis.forEach(function (l) { l.classList.toggle("is-f", l.getAttribute("data-pen") === n); });
    }
    function lepas() {
      svg.classList.remove("has-f"); svg.classList.remove("no-f-lahan");
      pens.concat(tgs, lis).forEach(function (e) { e.classList.remove("is-f"); });
    }
    lis.forEach(function (l) {
      var n = l.getAttribute("data-pen");
      function on() { if (n === "0") return; if (n === "L") { svg.classList.add("no-f-lahan"); return; } fokus(n); }
      l.addEventListener("mouseenter", on); l.addEventListener("focus", on); l.addEventListener("mouseleave", lepas); l.addEventListener("blur", lepas);
      l.addEventListener("click", on);   // ketuk di ponsel
      l.setAttribute("aria-describedby", "dn-d");
    });
    pens.forEach(function (p) {
      var n = p.getAttribute("data-n");
      function on() { fokus(n); }
      p.addEventListener("mouseenter", on); p.addEventListener("focus", on); p.addEventListener("mouseleave", lepas); p.addEventListener("blur", lepas);
      p.addEventListener("click", function () {
        on();
        var li = lis.filter(function (l) { return l.getAttribute("data-pen") === n; })[0];
        if (li && window.matchMedia("(max-width:1023px)").matches) li.scrollIntoView({ block: "center", behavior: REDUCE ? "auto" : "smooth" });
      });
      p.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); p.dispatchEvent(new Event("click")); } });
    });
    document.addEventListener("click", function (e) { if (!e.target.closest(".pen") && !e.target.closest("#kes-daftar li")) lepas(); });

    if (REDUCE) { angka.textContent = fmt(5.62, 2); return; }
    // ---- animasi gambar saat digulir ----
    var q = function (s) { return $$(s, svg); };
    var uk = $(".ukur", svg), len = Math.hypot(291, 15);
    gsap.set(q(".g-lahan,.g-jalur,.g-jejak,.mod"), { opacity: 0 });
    gsap.set(q(".g-jalur rect"), { transformOrigin: "0% 50%", scaleX: 0 });
    gsap.set(q(".g-zona"), { svgOrigin: "537 300", scale: .02 });
    gsap.set(uk, { strokeDasharray: len, strokeDashoffset: len });
    gsap.set(q(".ukur-t,.g-pil,.api-wrap,.gas-g,.g-dim"), { opacity: 0 });
    gsap.set(pens, { opacity: 0 });
    angka.textContent = fmt(0, 2);
    var o = { v: 0 };
    ScrollTrigger.create({ trigger: svg, start: "top 70%", once: true, onEnter: function () {
      var tl = gsap.timeline();
      tl.to(q(".g-lahan"), { opacity: 1, duration: .5 })
        .to(q(".g-jejak"), { opacity: 1, duration: .4 }, .25)
        .to(q(".g-jalur"), { opacity: 1, duration: .1 }, .35).to(q(".g-jalur rect"), { scaleX: 1, duration: .7, ease: "power3.inOut" }, .35)
        .to(q(".mod"), { opacity: 1, duration: .45, stagger: .1, ease: "power2.out" }, .5)
        .to(q(".api-wrap"), { opacity: 1, duration: .3 }, 1.05)
        .to(q(".g-zona"), { scale: 1, duration: 1.1, ease: "expo.out" }, 1.1)
        .to(q(".g-dim"), { opacity: 1, duration: .4 }, 1.4)
        .to(q(".gas-g"), { opacity: 1, duration: .5 }, 1.6)
        .to(uk, { strokeDashoffset: 0, duration: .9, ease: "power3.inOut" }, 1.7)
        .to(q(".ukur-t"), { opacity: 1, duration: .2 }, 2.45)
        .to(q(".g-pil"), { opacity: 1, duration: .3 }, 2.0)
        .to(o, { v: 5.62, duration: .9, ease: "power2.out", onUpdate: function () { angka.textContent = fmt(o.v, 2); }, onComplete: function () { angka.textContent = fmt(5.62, 2); } }, 2.0)
        .add(function () { pens.forEach(function (p, i) { setTimeout(function () { p.style.opacity = 1; p.classList.add("pop"); }, i * 110); }); }, 2.2)
        .add(function () {
          gsap.set(q(".mod,.gas-g,.api-wrap,.g-pil,.g-ukur,.g-lahan,.g-jalur,.g-jejak,.g-dim,.ukur-t"), { clearProps: "opacity" });
          setTimeout(function () { pens.forEach(function (p) { p.style.removeProperty("opacity"); p.classList.remove("pop"); }); }, 900);
        }, 3.2);
    } });
  }

  /* ------------ SPESIFIKASI ------------ */
  function initSpek() {
    var rows = $$(".spek tbody tr");
    if (REDUCE) return;
    rows.forEach(function (tr, i) {
      var th = $("th", tr), nilai = $(".nilai", tr), pelat = $(".pelat", tr), kepala = tr.classList.contains("kepala");
      var ket = $$(".spek-ket", tr), isi = [th, nilai].concat(ket);
      gsap.set(isi, { opacity: 0, y: 16 });
      if (!kepala) gsap.set(pelat, { opacity: 0 });
      ScrollTrigger.create({ trigger: tr, start: "top 88%", once: true, onEnter: function () {
        var d = i < 6 ? i * .07 : 0, tl = gsap.timeline({ delay: d });
        tl.to(isi, { opacity: 1, y: 0, duration: .48, ease: "power2.out" }, 0);
        if (!kepala) tl.to(pelat, { opacity: 1, duration: .32, ease: "none" }, .12 + .48 - .3);
        $$(".num", tr).forEach(function (n) { n.textContent = "0"; var ke = +n.dataset.ke, o = { v: 0 }; tl.to(o, { v: ke, duration: 1.4, ease: "power2.out", onUpdate: function () { n.textContent = fmt(Math.round(o.v), 0); }, onComplete: function () { n.textContent = fmt(ke, 0); } }, 0); });
      } });
    });
  }

  /* ------------ STATUS ------------ */
  function initStatus() {
    // still hero pembuka: parallax +-24 px (mati pada gerak dikurangi)
    var band = $("#st-band"), bimg = $("#st-band-img");
    if (band && bimg && !REDUCE) gsap.fromTo(bimg, { y: -24 }, { y: 24, ease: "none", scrollTrigger: { trigger: band, start: "top bottom", end: "bottom top", scrub: true } });
    var fig = $("#st-tangga"); if (!fig || REDUCE) return;
    var svgs = $$(".st-svg", fig);
    svgs.forEach(function (s) {
      var bars = $$(".bar", s), rects = $$(".bar rect", s), b1 = $(".b1", s), ini = $(".st-ini", s), next = $(".st-next", s);
      gsap.set(rects, { scaleY: 0, transformOrigin: "50% 100%" });
      gsap.set(bars, { opacity: 0 }); gsap.set([ini, next], { opacity: 0 });
      ScrollTrigger.create({ trigger: fig, start: "top 72%", once: true, onEnter: function () {
        var tl = gsap.timeline();
        bars.forEach(function (b, k) {
          var nanti = b.classList.contains("nanti"), isB1 = b.classList.contains("b1");
          tl.to($("rect", b), { scaleY: 1, duration: .48, ease: "expo.out" }, k * .12)
            .to(b, { opacity: nanti ? .55 : 1, duration: .3 }, k * .12);
        });
        tl.to(ini, { opacity: 1, duration: .3 }, .24).to(next, { opacity: 1, duration: .3 }, .5);
        tl.add(function () {
          gsap.fromTo(b1, { opacity: .4 }, { opacity: 1, duration: .9, ease: "sine.inOut", repeat: 2, yoyo: true, onComplete: function () { gsap.set(b1, { opacity: 1 }); } });
        }, 1.0);
      } });
    });
  }

  /* ------------ FORM PILOT ------------ */
  var RE_HP = /^(\+?62|0)8[1-9]\d{6,10}$/, RE_INTL = /^\+\d{8,15}$/, RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function kontakValid(v) { var s = v.trim(); if (RE_EMAIL.test(s)) return true; var d = s.replace(/[\s\-().]/g, ""); return RE_HP.test(d) || RE_INTL.test(d); }
  var PESAN_GALAT = TX.galat;
  function initForm() {
    var form = $("#form-pilot"), ring = $("#f-ringkas"), hasil = $("#f-hasil"), panel = $("#pilot-panel");
    var F = { nama: $("#f-nama"), dapur: $("#f-dapur"), kota: $("#f-kota"), porsi: $("#f-porsi"), kontak: $("#f-kontak") };
    var E = { nama: $("#e-nama"), dapur: $("#e-dapur"), kota: $("#e-kota"), porsi: $("#e-porsi"), kontak: $("#e-kontak") };
    var tersentuh = {}, sudahKirim = false;
    // label dan contoh kolom volume mengikuti jenis pemasok
    var lPorsi = $("#l-porsi"), rJenis = $$('input[name="jenis"]');
    function jenisAktif() { return rJenis.filter(function (r) { return r.checked; })[0]; }
    function sinkJenis() { var k = jenisAktif().value; lPorsi.innerHTML = lPorsi.getAttribute("data-" + k); F.porsi.placeholder = F.porsi.getAttribute("data-" + k); F.dapur.placeholder = F.dapur.getAttribute("data-" + k); }
    rJenis.forEach(function (r) { r.addEventListener("change", sinkJenis); });
    sinkJenis(); window.addEventListener("pageshow", sinkJenis);
    // tanpa nomor WhatsApp: tombol WhatsApp disembunyikan, tombol email jadi tombol utama
    var bWA = $("#kirim-wa"), bEm = $("#kirim-email");
    if (!KONTAK_ADA.wa) {
      bWA.hidden = true; bEm.classList.remove("sek"); bEm.classList.add("aksi");
      bEm.insertAdjacentHTML("beforeend", ' <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>');
    }
    function cek(k) {
      var v = F[k].value.trim(), m = "";
      if (k === "nama" && v.length < 2) m = PESAN_GALAT.nama;
      if (k === "dapur" && v.length < 2) m = PESAN_GALAT.dapur;
      if (k === "kota" && v.length < 2) m = PESAN_GALAT.kota;
      if (k === "porsi" && v.length > 60) m = PESAN_GALAT.porsi;
      if (k === "kontak") { if (!v) m = PESAN_GALAT.kontak0; else if (!kontakValid(v)) m = PESAN_GALAT.kontak1; }
      E[k].textContent = m;
      if (m) { F[k].setAttribute("aria-invalid", "true"); F[k].setAttribute("aria-describedby", (k === "porsi" ? "b-porsi " : "") + E[k].id); }
      else { F[k].removeAttribute("aria-invalid"); if (k !== "porsi") F[k].removeAttribute("aria-describedby"); else F[k].setAttribute("aria-describedby", "b-porsi e-porsi"); }
      return !m;
    }
    Object.keys(F).forEach(function (k) {
      F[k].addEventListener("blur", function () { if (F[k].value || tersentuh[k]) { tersentuh[k] = true; cek(k); } });
      F[k].addEventListener("input", function () { if (F[k].getAttribute("aria-invalid") === "true") cek(k); });
    });
    function semua() {
      var salah = [];
      Object.keys(F).forEach(function (k) { tersentuh[k] = true; if (!cek(k)) salah.push(k); });
      if (salah.length) {
        ring.hidden = false;
        ring.innerHTML = TX.ringkas(salah.length, salah.map(function (k) { return '<a class="tautan" href="#f-' + k + '">' + $('label[for="f-' + k + '"]').textContent + "</a>"; }).join(", "));
        $$("a", ring).forEach(function (a) { a.addEventListener("click", function (e) { e.preventDefault(); $(a.getAttribute("href")).focus(); }); });
        F[salah[0]].focus();
        return false;
      }
      ring.hidden = true; ring.textContent = ""; return true;
    }
    function nilai() {
      var c = function (s, n) { return String(s).trim().replace(/\s+/g, " ").slice(0, n); };
      return { nama: c(F.nama.value, 120), dapur: c(F.dapur.value, 160), kota: c(F.kota.value, 120), porsi: c(F.porsi.value, 60), kontak: c(F.kontak.value, 120) };
    }
    function barisPesan(v) {
      var b = TX.baris; return [TX.barisJenis + jenisAktif().parentNode.textContent.trim(), b[0] + v.nama, b[1] + v.dapur, b[2] + v.kota, b[3] + v.porsi, b[4] + v.kontak];
    }
    function urlEmail(v) {
      var body = barisPesan(v).map(encodeURIComponent).join("%0A");
      return "mailto:" + KONTAK.email + "?subject=" + encodeURIComponent(TX.subjekPilot) + "&body=" + body;
    }
    function urlWA(v) {
      var t = [TX.subjekPilot].concat(barisPesan(v)).map(encodeURIComponent).join("%0A");
      return "https://wa.me/" + KONTAK.wa.replace(/\D/g, "") + "?text=" + t;
    }
    window.__pesan = { urlEmail: function (v) { return urlEmail(v); }, urlWA: function (v) { return urlWA(v); } };
    var pesanTeks = "";
    function kirim(via, btn) {
      if (btn.getAttribute("aria-busy") === "true") return;
      if (!semua()) return;
      var v = nilai(), ada = via === "wa" ? KONTAK_ADA.wa : KONTAK_ADA.email;
      pesanTeks = [TX.subjekPilot].concat(barisPesan(v)).join("\n");
      var label = btn.innerHTML, w = btn.offsetWidth;
      btn.style.minWidth = w + "px"; btn.setAttribute("aria-busy", "true"); btn.textContent = TX.menyiapkan;
      if (ada) {
        if (via === "wa") window.open(urlWA(v), "_blank", "noopener");
        else { var u = urlEmail(v); if (u.length > 1800) u = u.slice(0, 1800); window.location.href = u; }
      }
      setTimeout(function () {
        btn.removeAttribute("aria-busy"); btn.innerHTML = label; btn.style.minWidth = "";
        tampilHasil(ada, via);
      }, 600);
    }
    function tampilHasil(ada, via) {
      sudahKirim = true;
      var h = form.offsetHeight; panel.style.minHeight = h + "px";
      var belum = $("#f-belum"); belum.hidden = ada; $("#f-pesan").value = pesanTeks;
      $("#f-hasil-t").textContent = ada ? (via === "wa" ? TX.hasilOkWA : TX.hasilOk) : "";
      $("#f-hasil-j").textContent = ada ? TX.terima : TX.belum;
      var tampil = function () {
        form.hidden = true; hasil.hidden = false;
        if (REDUCE) { hasil.style.opacity = 1; } else { gsap.fromTo(hasil, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .32, ease: "power2.out" }); var mk = $("#mk-centang .mk"); gsap.fromTo(mk, { scaleX: 0, transformOrigin: "0% 50%" }, { scaleX: 1, duration: .4, ease: "power2.out", delay: .2 }); }
        $("#f-hasil-j").focus({ preventScroll: true });
      };
      if (REDUCE) tampil(); else gsap.to(form, { opacity: 0, duration: .2, onComplete: function () { form.style.opacity = ""; tampil(); } });
    }
    $("#kirim-wa").addEventListener("click", function (e) { kirim("wa", e.currentTarget); });
    $("#kirim-email").addEventListener("click", function (e) { kirim("email", e.currentTarget); });
    form.addEventListener("submit", function (e) { e.preventDefault(); });
    $("#f-ubah").addEventListener("click", function () { hasil.hidden = true; form.hidden = false; form.style.opacity = 1; panel.style.minHeight = ""; F.nama.focus(); });
    $("#f-salin").addEventListener("click", function () {
      var st = $("#f-salin-st");
      function ok() { st.textContent = TX.disalin; } function gagal() { st.textContent = TX.gagalSalin; var ta = $("#f-pesan"); $("#f-belum").hidden = false; ta.focus(); ta.select(); }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(pesanTeks).then(ok, gagal);
      else { var ta = $("#f-pesan"); $("#f-belum").hidden = false; ta.value = pesanTeks; ta.select(); try { document.execCommand("copy") ? ok() : gagal(); } catch (e) { gagal(); } }
    });
  }

  /* ------------ MITRA ------------ */
  function initMitra() {
    // tombol hubungi
    var a = $("#mitra-aksi"), belum = $("#mitra-belum");
    if (KONTAK_ADA.email) a.setAttribute("href", "mailto:" + KONTAK.email + "?subject=" + encodeURIComponent(TX.subjekMitra));
    else a.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); belum.hidden = false; });
    // indeks: blok yang terlihat
    var links = $$("#mt-indeks a"), blok = links.map(function (l) { return document.getElementById(l.getAttribute("href").slice(1)); });
    function cek() {
      var y = innerHeight * .4, cur = 0;
      blok.forEach(function (b, i) { if (b.getBoundingClientRect().top <= y) cur = i; });
      links.forEach(function (l, i) { if (i === cur) l.setAttribute("aria-current", "true"); else l.removeAttribute("aria-current"); });
    }
    var tk = false; window.addEventListener("scroll", function () { if (tk) return; tk = true; requestAnimationFrame(function () { tk = false; cek(); }); }, { passive: true }); cek();
    // tangga bukti
    if (!REDUCE) {
      var li = $$("#mt-anak li");
      gsap.set(li, { opacity: 0, x: -24 });
      ScrollTrigger.create({ trigger: "#mt-anak", start: "top 82%", once: true, onEnter: function () { gsap.to(li, { opacity: 1, x: 0, duration: .5, ease: "power2.out", stagger: .12 }); } });
    }
  }

  /* ------------ KARTU ISTILAH ------------ */
  function initIstilah() {
    var DEF = TX.def;
    var kartu = $("#kartu-ist"), btns = $$(".ist-btn"), buka = null;
    function tampil(b) {
      if (buka === b) return; if (buka) buka.setAttribute("aria-expanded", "false");
      buka = b; kartu.textContent = DEF[b.dataset.ist]; kartu.hidden = false; b.setAttribute("aria-expanded", "true");
      var box = $("#istilah").getBoundingClientRect(), r = b.getBoundingClientRect();
      kartu.style.left = clamp(r.left - box.left, 0, Math.max(0, box.width - 280)) + "px";
      kartu.classList.add("tampil");
      if (!REDUCE) gsap.fromTo(kartu, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: .16, ease: "none" });
    }
    function tutup() { if (!buka) return; buka.setAttribute("aria-expanded", "false"); buka = null; kartu.classList.remove("tampil"); kartu.hidden = true; }
    btns.forEach(function (b) {
      b.setAttribute("aria-expanded", "false");
      b.addEventListener("mouseenter", function () { if (mqHalus.matches) tampil(b); });
      b.addEventListener("focus", function () { tampil(b); });
      b.addEventListener("click", function (e) { e.stopPropagation(); if (buka === b && !mqHalus.matches) tutup(); else tampil(b); });
      b.addEventListener("blur", function () { setTimeout(function () { if (!document.activeElement || !document.activeElement.classList.contains("ist-btn")) tutup(); }, 0); });
    });
    $("#istilah").addEventListener("mouseleave", function () { if (mqHalus.matches && document.activeElement && !document.activeElement.classList.contains("ist-btn")) tutup(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") tutup(); });
    document.addEventListener("click", function (e) { if (!e.target.closest(".istilah")) tutup(); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
