/* * Whole file reviewed 2026-11-18. A * at the start of a comment marks a section already read.
   Head over Hills microsite. GSAP + ScrollTrigger for scenes, Lenis as the only smooth-scroll engine.
   Reduced motion: no Lenis, no scrubbed scenes, final states shown at once. */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = window.gsap && window.ScrollTrigger;
  root.classList.add('js');
  if (reduce || !hasGsap) root.classList.add('no-motion');

  /* * ---------- split headings into words (accessible name kept on the parent) ---------- (reviewed 2026-11-18) */
  function split(el) {
    if (el.dataset.done) return;
    el.dataset.done = '1';
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var w = document.createElement('span');
            w.className = 'w'; w.setAttribute('aria-hidden', 'true'); w.textContent = part;
            frag.appendChild(w);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.tagName !== 'A') { walk(n); }
      });
    })(el);
  }

  /* * ---------- smooth scroll ---------- (reviewed 2026-11-18) */
  var lenis = null;
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);
  if (!reduce && hasGsap && window.Lenis) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }
  function goTo(target) {
    var el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -64 });
    else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  }

  /* * ---------- nav ---------- (reviewed 2026-11-18) */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  function onScroll() { nav.classList.toggle('is-solid', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  window.addEventListener('load', onScroll);
  if (lenis) lenis.on('scroll', onScroll);
  function setMenu(open) {
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
    if (lenis) open ? lenis.stop() : lenis.start();
  }
  burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) setMenu(false); });

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      if (!menu.hidden) setMenu(false);
      if (a.dataset.enquire) prefill(a.dataset.enquire);
      goTo(id === '#top' ? document.body : el);
    });
  });

  /* * ---------- reveals ---------- (reviewed 2026-11-18) */
  var reveals = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (r) { r.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (r, i) { r.style.transitionDelay = (i % 4) * 0.08 + 's'; io.observe(r); });
  }

  /* * ---------- motion scenes ---------- (reviewed 2026-11-18) */
  if (hasGsap && !reduce) {
    document.querySelectorAll('[data-split]').forEach(split);

    // hero intro: photo settles, logo and line rise, buttons follow. Content is readable throughout.
    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.hero__img', { scale: 1.08, duration: 2.4, ease: 'power2.out' }, 0)
      .from('.hero__logo', { y: 24, opacity: 0, duration: 1.4 }, 0.2)
      .from('.hero__line .w', { yPercent: 60, opacity: 0, duration: 1.1, stagger: 0.07 }, 0.6)
      .from('.hero__btns', { y: 16, opacity: 0, duration: 1 }, 1.1);
    gsap.to('.hero__media', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

    // pinned scenes are created in page order so later triggers measure the right spacing
    // Place: the four photos dissolve into each other, one guide sentence each
    var place = document.querySelector('.place');
    if (place) {
      place.classList.add('is-pinned');
      var steps = place.querySelectorAll('.place__step');
      var pt = gsap.timeline({ scrollTrigger: { trigger: place, start: 'top top', end: '+=' + (steps.length * 80) + '%', scrub: 0.6, pin: '.place__pin', anticipatePin: 1 } });
      steps.forEach(function (st, i) {
        var im = st.querySelector('img'), ln = st.querySelector('.place__line');
        pt.fromTo(im, { scale: 1.08 }, { scale: 1, ease: 'none', duration: 1.2 }, i);
        if (i) {
          pt.to(steps[i - 1].querySelector('.place__line'), { opacity: 0, y: -24, duration: 0.2 }, i - 0.35);
          pt.to(st, { opacity: 1, duration: 0.4, ease: 'none' }, i - 0.2);
        }
        pt.from(ln, { y: 32, opacity: 0, duration: 0.3 }, i + (i ? 0.05 : 0));
      });
    }

    // headings: word by word, restrained
    document.querySelectorAll('[data-split]').forEach(function (el) {
      if (el.closest('.hero') || el.closest('.hastens')) return;
      gsap.from(el.querySelectorAll('.w'), {
        yPercent: 50, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.05,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });

    // Hästens: the framed photo opens to full screen, then the words arrive
    var ha = gsap.timeline({ scrollTrigger: { trigger: '.hastens', start: 'top top', end: '+=120%', scrub: 0.6, pin: '.hastens__pin', anticipatePin: 1 } });
    ha.to('.hastens__frame', { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', duration: 1 }, 0)
      .to('.hastens__frame img', { scale: 1, ease: 'none', duration: 1 }, 0)
      .to('.hastens__shade', { opacity: 1, duration: 0.5 }, 0.55)
      .to('.hastens__copy', { opacity: 1, duration: 0.01 }, 0.6)
      .from('.hastens__copy h2 .w', { yPercent: 50, opacity: 0, stagger: 0.03, duration: 0.3 }, 0.6)
      .from('.hastens__line, .hastens__sub, .hastens__copy .btns', { y: 24, opacity: 0, stagger: 0.08, duration: 0.3 }, 0.8);

    // gentle drift on the cellar photo
    gsap.fromTo('.cellar__media img', { yPercent: -4, scale: 1.06 }, { yPercent: 4, scale: 1.06, ease: 'none', scrollTrigger: { trigger: '.cellar', start: 'top bottom', end: 'bottom top', scrub: true } });

    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  }

  /* * ---------- pop-up ---------- (reviewed 2026-11-18) */
  var BOOK = 'https://services.semper.co.za/BookingEngine/full-layout/date-selection?VenueID=17385&ChannelID=1';
  var pop = document.getElementById('pop');
  var slides = document.getElementById('popSlides');
  var popText = document.getElementById('popText');
  var prev = document.getElementById('popPrev');
  var next = document.getElementById('popNext');
  var lastFocus = null;
  var dots = document.createElement('div'); dots.className = 'pop__dots'; dots.setAttribute('aria-hidden', 'true');
  slides.parentNode.appendChild(dots);
  slides.addEventListener('scroll', function () {
    var i = Math.round(slides.scrollLeft / Math.max(1, slides.clientWidth));
    Array.prototype.forEach.call(dots.children, function (d, k) { d.classList.toggle('on', k === i); });
  }, { passive: true });

  // the single-file build keeps image paths in the page and the pictures in window.__IMG
  function R(u) { return (window.__IMG && window.__IMG[u]) || u; }
  function imgsFor(src) {
    var j = src.querySelector('.pop-imgs');
    if (j) { try { return JSON.parse(j.textContent); } catch (e) {} }
    var im = src.querySelector('img');
    return im ? [im.getAttribute('src')] : [];
  }
  function openPop(src) {
    var tpl = src.querySelector('template');
    if (!tpl) return;
    lastFocus = document.activeElement;
    var list = imgsFor(src);
    slides.innerHTML = '';
    list.forEach(function (u, i) {
      var f = document.createElement('figure');
      var im = document.createElement('img');
      im.src = R(u); im.alt = i === 0 ? (src.querySelector('img') || {}).alt || '' : '';
      im.decoding = 'async';
      var abs = R(u); if (abs.indexOf('data:') !== 0) abs = new URL(abs, document.baseURI).href;
      f.style.setProperty('--bg', 'url("' + abs + '")');
      im.onload = function () {
        // never stretch a photo past its own pixel size; a small one sits on a blurred copy of itself
        var box = slides.getBoundingClientRect();
        if (im.naturalWidth < box.width || im.naturalHeight < box.height) { im.classList.add('is-small'); f.classList.add('is-small'); }
      };
      f.appendChild(im); slides.appendChild(f);
    });
    prev.hidden = next.hidden = list.length < 2;
    dots.innerHTML = list.length < 2 ? '' : list.map(function (_, i) { return '<i' + (i ? '' : ' class="on"') + '></i>'; }).join('');
    popText.innerHTML = '';
    var copy = tpl.content.cloneNode(true);
    popText.appendChild(copy);
    var h = popText.querySelector('h3');
    if (h) h.id = 'popTitle';
    var name = h ? h.textContent.trim() : 'General enquiry';
    var btns = document.createElement('div');
    btns.className = 'btns';
    var isRoom = src.classList.contains('room');
    btns.innerHTML = '<a class="btn btn--blue" target="_blank" rel="noopener" href="' + BOOK + '">Book Now</a>' +
      '<a class="btn btn--ghost" href="#contact">' + (isRoom ? 'Enquire about ' + name.replace(/^The /, 'the ') : 'Enquire Now') + '</a>';
    btns.lastChild.addEventListener('click', function (e) { e.preventDefault(); closePop(); prefill(name); setTimeout(function () { goTo('#contact'); }, 60); });
    // copy scrolls inside .pop__body; the booking buttons stay pinned below it
    var pc = popText.querySelector('.pop__copy');
    var body = document.createElement('div'); body.className = 'pop__body';
    while (pc.firstChild) body.appendChild(pc.firstChild);
    pc.appendChild(body); pc.appendChild(btns);
    body.scrollTop = 0; slides.scrollLeft = 0;
    if (lenis) lenis.stop();
    pop.showModal();
  }
  function closePop() { if (pop.open) pop.close(); }
  pop.addEventListener('close', function () { if (lenis) lenis.start(); if (lastFocus) lastFocus.focus({ preventScroll: true }); });
  pop.addEventListener('click', function (e) { if (e.target === pop) closePop(); });
  document.getElementById('popClose').addEventListener('click', closePop);
  function step(d) { slides.scrollBy({ left: d * slides.clientWidth, behavior: reduce ? 'auto' : 'smooth' }); }
  prev.addEventListener('click', function () { step(-1); });
  next.addEventListener('click', function () { step(1); });
  pop.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') step(-1); if (e.key === 'ArrowRight') step(1); });

  document.querySelectorAll('[data-pop]').forEach(function (card) {
    var h = card.querySelector('h3');
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    if (h) card.setAttribute('aria-label', h.textContent.trim() + ', learn more');
    card.addEventListener('click', function () { if (!card.dataset.dragged) openPop(card); });
    card.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPop(card); } });
  });
  /* * ---------- rooms: slow drifting carousel, hover or touch hands it back ---------- (reviewed 2026-11-18) */
  (function () {
    var track = document.getElementById('roomsTrack');
    if (!track) return;
    var rooms = Array.prototype.slice.call(track.querySelectorAll('.room'));
    // arrows, same as the photo rows
    var wrap = document.createElement('div'); wrap.className = 'rowwrap';
    track.parentNode.insertBefore(wrap, track); wrap.appendChild(track);
    var arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
    var p = document.createElement('button'), n = document.createElement('button');
    p.type = n.type = 'button'; p.className = 'pop__arrow pop__arrow--prev'; n.className = 'pop__arrow pop__arrow--next';
    p.setAttribute('aria-label', 'Previous rooms'); n.setAttribute('aria-label', 'Next rooms');
    p.innerHTML = arrow; n.innerHTML = arrow.replace('M15 5l-7 7 7 7', 'M9 5l7 7-7 7');
    wrap.appendChild(p); wrap.appendChild(n);
    var loop = !reduce;
    if (loop) {
      // a second, hidden copy of the rooms so the drift never runs out
      rooms.forEach(function (r) {
        var c = r.cloneNode(true);
        c.setAttribute('aria-hidden', 'true'); c.setAttribute('tabindex', '-1'); c.removeAttribute('aria-label');
        c.addEventListener('click', function () { openPop(c); });
        c.querySelectorAll('img').forEach(function (im) { im.alt = ''; });
        track.appendChild(c);
      });
    }
    function setW() { return loop ? track.children[rooms.length].offsetLeft - rooms[0].offsetLeft : 0; }
    function stepW() { return rooms[0].getBoundingClientRect().width + 16; }
    var pos = 0, lastSet = 0, idleUntil = 0, hover = false, inView = false, last = 0;
    var SPEED = window.innerWidth < 761 ? 18 : 26; // px per second, slow
    function wrapPos() { var w = setW(); if (!w) return; if (pos >= w) pos -= w; if (pos < 0) pos += w; }
    function apply() { track.scrollLeft = pos; lastSet = track.scrollLeft; }
    function paused(now) { return hover || now < idleUntil || !inView || pop.open || document.hidden || !!track.querySelector(":focus-visible"); }
    function upd() { if (loop) return; p.disabled = track.scrollLeft < 4; n.disabled = track.scrollLeft + track.clientWidth > track.scrollWidth - 4; }
    track.addEventListener('scroll', function () {
      if (Math.abs(track.scrollLeft - lastSet) > 1) { pos = track.scrollLeft; idleUntil = performance.now() + 2500; }
      upd();
    }, { passive: true });
    function go(d) {
      idleUntil = performance.now() + 4000;
      if (loop) { pos = track.scrollLeft; var w = setW(); if (d > 0 && pos + stepW() > track.scrollWidth - track.clientWidth) { pos -= w; apply(); } if (d < 0 && pos - stepW() < 0) { pos += w; apply(); } }
      track.scrollBy({ left: d * stepW(), behavior: reduce ? 'auto' : 'smooth' });
    }
    p.addEventListener('click', function () { go(-1); }); n.addEventListener('click', function () { go(1); });
    window.addEventListener('resize', upd); upd();
    if (!loop) return;
    // mouse over the row: stop and behave like a normal row
    track.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') hover = true; });
    track.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') { hover = false; idleUntil = performance.now() + 600; } });
    wrap.addEventListener('mouseenter', function () { hover = true; });
    wrap.addEventListener('mouseleave', function () { hover = false; idleUntil = performance.now() + 600; });
    // a finger on the row: stop, give it a few seconds after letting go
    track.addEventListener('touchstart', function () { idleUntil = Infinity; }, { passive: true });
    track.addEventListener('touchend', function () { idleUntil = performance.now() + 4000; }, { passive: true });
    function tick(now) {
      var dt = last ? Math.min(now - last, 64) : 0; last = now;
      var r = track.getBoundingClientRect(); inView = r.bottom > 0 && r.top < window.innerHeight;
      if (!paused(now)) { pos += SPEED * dt / 1000; wrapPos(); apply(); }
      else if (now > idleUntil - 2200 && !hover) { var w = setW(); if (w && track.scrollLeft >= w) { pos = track.scrollLeft - w; apply(); } }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  })();

  document.querySelectorAll('[data-pop-btn]').forEach(function (b) {
    b.addEventListener('click', function () { openPop(b.closest('.split__copy, .cellar__inner')); });
  });

  /* * ---------- sideways photo rows: arrows for mouse users ---------- (reviewed 2026-11-18) */
  document.querySelectorAll('.strip--scroll').forEach(function (row) {
    var wrap = document.createElement('div'); wrap.className = 'rowwrap';
    row.parentNode.insertBefore(wrap, row); wrap.appendChild(row);
    var arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
    var p = document.createElement('button'), n = document.createElement('button');
    p.type = n.type = 'button'; p.className = 'pop__arrow pop__arrow--prev'; n.className = 'pop__arrow pop__arrow--next';
    p.setAttribute('aria-label', 'Previous photos'); n.setAttribute('aria-label', 'Next photos');
    p.innerHTML = arrow; n.innerHTML = arrow.replace('M15 5l-7 7 7 7', 'M9 5l7 7-7 7');
    wrap.appendChild(p); wrap.appendChild(n);
    function upd() { p.disabled = row.scrollLeft < 4; n.disabled = row.scrollLeft + row.clientWidth > row.scrollWidth - 4; }
    function go(d) { row.scrollBy({ left: d * row.clientWidth * 0.75, behavior: reduce ? 'auto' : 'smooth' }); }
    p.addEventListener('click', function () { go(-1); }); n.addEventListener('click', function () { go(1); });
    row.addEventListener('scroll', upd, { passive: true }); window.addEventListener('resize', upd); upd();
  });

  /* * ---------- photo album lightbox ---------- (reviewed 2026-11-18) */
  var lb = document.getElementById('lb');
  var lbImg = document.getElementById('lbImg');
  var items = Array.prototype.slice.call(document.querySelectorAll('.album__item img, .strip img, .cellar__strip img'));
  var cur = 0;
  function showLb(i) { cur = (i + items.length) % items.length; lbImg.src = items[cur].currentSrc || items[cur].src; lbImg.alt = items[cur].alt; }
  items.forEach(function (im, i) {
    var hit = im.parentNode.classList.contains('album__item') ? im.parentNode : im;
    if (hit === im) { im.setAttribute('tabindex', '0'); im.setAttribute('role', 'button'); }
    hit.setAttribute('aria-label', 'Open photo: ' + im.alt);
    function open() { lastFocus = hit; showLb(i); if (lenis) lenis.stop(); lb.showModal(); }
    hit.addEventListener('click', open);
    if (hit === im) im.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });
  document.getElementById('lbPrev').addEventListener('click', function () { showLb(cur - 1); });
  document.getElementById('lbNext').addEventListener('click', function () { showLb(cur + 1); });
  document.getElementById('lbClose').addEventListener('click', function () { lb.close(); });
  lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
  lb.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') showLb(cur - 1); if (e.key === 'ArrowRight') showLb(cur + 1); });
  lb.addEventListener('close', function () { if (lenis) lenis.start(); if (lastFocus) lastFocus.focus({ preventScroll: true }); });

  /* * ---------- form: prefill from Enquire buttons, send by email until a form service is chosen ---------- (reviewed 2026-11-18) */
  var form = document.getElementById('form');
  var about = document.getElementById('formAbout');
  function prefill(text) {
    about.value = text;
    form.classList.remove('is-flash'); void form.offsetWidth; form.classList.add('is-flash');
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = form.elements, ok = true;
    var email = f.email.value.trim();
    [[f.name, f.name.value.trim() !== ''], [f.email, /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)]].forEach(function (p) {
      p[0].setAttribute('aria-invalid', p[1] ? 'false' : 'true'); if (!p[1]) ok = false;
    });
    document.getElementById('formErr').hidden = ok;
    if (!ok) { (f.name.value.trim() ? f.email : f.name).focus(); return; }
    var body = 'Name: ' + f.name.value + ' ' + f.surname.value + '\nEmail: ' + email + '\nContact number: ' + f.phone.value + '\nEnquiry: ' + f.about.value + '\n\n' + f.msg.value;
    window.location.href = 'mailto:info@headoverhills.co.za?subject=' + encodeURIComponent('Website enquiry: ' + (f.about.value || 'General enquiry')) + '&body=' + encodeURIComponent(body);
  });
  /* * ---------- privacy: cookie consent (lightweight, no plugin) ---------- (reviewed 2026-11-19)
     How to add a tracking script later, without code changes here:
       <script type="text/plain" data-consent="analytics" src="..."></script>   (or inline)
       <iframe data-consent="marketing" data-src="..."></iframe>
     then set inUse: true on that category below and bump VERSION so visitors are asked again. */
  (function () {
    var KEY = 'hoh-consent', VERSION = '2026-11-19';
    var CATS = [
      { id: 'essential', name: 'Essential', required: true, inUse: true,
        text: 'Needed for the website to work and to remember your cookie choice. These cannot be switched off.' },
      { id: 'analytics', name: 'Analytics', inUse: false, cookies: [/^_ga/, /^_gid$/, /^_gat/],
        text: 'Help us understand how visitors use the website so we can improve it.' },
      { id: 'marketing', name: 'Marketing', inUse: false, cookies: [/^_fbp$/, /^_fbc$/, /^_gcl/],
        text: 'Used to show relevant offers from Head over Hills on other platforms.' }
    ];
    var ck = document.getElementById('ck'), pol = document.getElementById('pol');
    var list = document.getElementById('ckpList');
    if (!ck) return;
    var state = null, opener = null;
    var views = { main: ck.querySelector('[data-ck-view="main"]'), pick: ck.querySelector('[data-ck-view="pick"]') };

    function read() {
      try { var r = JSON.parse(localStorage.getItem(KEY)); return r && r.v === VERSION && r.choices ? r : null; } catch (e) { return null; }
    }
    function choices(all) {
      var c = {}; CATS.forEach(function (k) { c[k.id] = !!(k.required || all); }); return c;
    }
    function allowed(id) { return !!(state && state.choices[id]); }
    // run consented scripts once; data-ck-done stops duplicates
    function activate() {
      document.querySelectorAll('script[type="text/plain"][data-consent]:not([data-ck-done])').forEach(function (old) {
        if (!allowed(old.dataset.consent)) return;
        old.setAttribute('data-ck-done', '');
        var n = document.createElement('script');
        Array.prototype.forEach.call(old.attributes, function (a) { if (a.name !== 'type' && a.name !== 'data-ck-done') n.setAttribute(a.name, a.value); });
        if (!old.src) n.text = old.text;
        old.parentNode.insertBefore(n, old.nextSibling);
      });
      document.querySelectorAll('iframe[data-consent][data-src]:not([src])').forEach(function (f) { if (allowed(f.dataset.consent)) f.src = f.dataset.src; });
    }
    // withdrawing: clear that category's cookies; scripts already running need a reload to stop
    function clearCookies(cat) {
      var host = location.hostname, parts = host.split('.'), doms = ['', host];
      for (var i = 1; i < parts.length - 1; i++) doms.push('.' + parts.slice(i).join('.'));
      document.cookie.split(';').forEach(function (c) {
        var name = c.split('=')[0].trim();
        if (!cat.cookies || !cat.cookies.some(function (r) { return r.test(name); })) return;
        doms.forEach(function (d) { document.cookie = name + '=; Max-Age=0; path=/' + (d ? '; domain=' + d : ''); });
      });
    }
    function save(c) {
      var before = state ? state.choices : null;
      state = { v: VERSION, ts: new Date().toISOString(), choices: c };
      try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
      var withdrew = false;
      CATS.forEach(function (k) {
        if (before && before[k.id] && !c[k.id]) { clearCookies(k); if (document.querySelector('[data-consent="' + k.id + '"][data-ck-done]')) withdrew = true; }
      });
      window.dispatchEvent(new CustomEvent('hoh:consent', { detail: c }));
      if (withdrew) { location.reload(); return; }
      activate();
      hide();
    }

    // small card in the corner, like the Conversion Advantage site: no overlay, page stays usable
    function view(name) {
      if (name === 'pick') renderPrefs();
      views.main.hidden = name !== 'main'; views.pick.hidden = name !== 'pick';
    }
    function show(name, from) {
      opener = from || null;
      view(name || 'main');
      ck.hidden = false;
      ck.classList.remove('is-out');
      if (!reduce) { void ck.offsetWidth; ck.classList.add('is-in'); }
      // only move focus when someone asked for the card (footer link); never steal it on first visit
      if (from) { var f = ck.querySelector('[data-ck-view]:not([hidden]) [role="switch"]:not([disabled]), [data-ck-view]:not([hidden]) .ck__btn'); if (f) f.focus({ preventScroll: true }); }
    }
    function hide() {
      if (ck.hidden) return;
      var had = ck.contains(document.activeElement);
      function done() { ck.hidden = true; ck.classList.remove('is-in', 'is-out'); }
      if (reduce) done(); else { ck.classList.remove('is-in'); ck.classList.add('is-out'); setTimeout(done, 400); }
      if (had) { if (opener && document.contains(opener)) opener.focus({ preventScroll: true }); else document.activeElement.blur(); }
    }

    function renderPrefs() {
      var cur = state ? state.choices : choices(false);
      var used = CATS;  // show every category with its switch, like the Conversion Advantage card (v11)
      list.innerHTML = used.map(function (k) {
        var on = !!(k.required || cur[k.id]);
        return '<li class="ck__row"><span id="ckc-' + k.id + '"><b>' + k.name + '</b><i>' + k.text + '</i></span>' +
          (k.required ? '<span class="ck__on">Always on</span>'
            : '<button type="button" class="ck__sw" role="switch" aria-checked="' + on + '" aria-labelledby="ckc-' + k.id + '" data-cat="' + k.id + '"><i></i></button>') + '</li>';
      }).join('') + (used.length === CATS.length ? '' : '<li class="ck__row ck__row--note"><i>We do not use analytics or marketing cookies at present. If that changes, they will stay off until you agree.</i></li>');
    }
    function openPolicy(from) {
      opener = from;
      if (lenis) lenis.stop();
      pol.showModal();
      pol.querySelector('.pol__body').scrollTop = 0;
    }
    pol.addEventListener('close', function () { if (lenis && !pop.open) lenis.start(); if (opener && document.contains(opener)) opener.focus({ preventScroll: true }); });
    pol.addEventListener('click', function (e) { if (e.target === pol) pol.close(); });

    document.addEventListener('click', function (e) {
      var sw = e.target.closest('.ck__sw');
      if (sw) { sw.setAttribute('aria-checked', sw.getAttribute('aria-checked') === 'true' ? 'false' : 'true'); return; }
      var b = e.target.closest('[data-ck]'); if (!b) return;
      var a = b.dataset.ck;
      if (a === 'accept') save(choices(true));
      else if (a === 'reject') save(choices(false));
      else if (a === 'save') {
        var c = choices(false);
        ck.querySelectorAll('.ck__sw').forEach(function (i) { c[i.dataset.cat] = i.getAttribute('aria-checked') === 'true'; });
        save(c);
      }
      else if (a === 'manage') {
        if (ck.contains(b)) { view('pick'); var f = views.pick.querySelector('[role="switch"], .ck__btn'); if (f) f.focus({ preventScroll: true }); }
        else { if (pol.open) pol.close(); show('pick', b); }
      }
      else if (a === 'policy') openPolicy(b);
      else if (a === 'polclose') pol.close();
    });
    // Escape inside the card closes it with optional cookies off (or just closes it when reopened from the footer)
    ck.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      e.preventDefault();
      if (state) hide(); else save(choices(false));
    });

    // small public hook: window.hohConsent.open(), .get(), .has('analytics')
    window.hohConsent = { open: function () { show('pick', document.activeElement); }, get: function () { return state; }, has: allowed };

    state = read();
    if (state) { activate(); document.addEventListener('DOMContentLoaded', activate); } else show('main');
  })();
})();
