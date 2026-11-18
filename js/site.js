/* Head over Hills microsite. GSAP + ScrollTrigger for scenes, Lenis as the only smooth-scroll engine.
   Reduced motion: no Lenis, no scrubbed scenes, final states shown at once. */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = window.gsap && window.ScrollTrigger;
  root.classList.add('js');
  if (reduce || !hasGsap) root.classList.add('no-motion');

  /* ---------- split headings into words (accessible name kept on the parent) ---------- */
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

  /* ---------- smooth scroll ---------- */
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

  /* ---------- nav ---------- */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  function onScroll() { nav.classList.toggle('is-solid', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  window.addEventListener('load', onScroll);
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

  /* ---------- reveals ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (r) { r.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (r, i) { r.style.transitionDelay = (i % 4) * 0.08 + 's'; io.observe(r); });
  }

  /* ---------- motion scenes ---------- */
  if (hasGsap && !reduce) {
    document.querySelectorAll('[data-split]').forEach(split);

    // hero intro: photo settles, logo and line rise, buttons follow. Content is readable throughout.
    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.hero__img', { scale: 1.08, duration: 2.4, ease: 'power2.out' }, 0)
      .from('.hero__logo', { y: 24, opacity: 0, duration: 1.4 }, 0.2)
      .from('.hero__line .w', { yPercent: 60, opacity: 0, duration: 1.1, stagger: 0.07 }, 0.6)
      .from('.hero__btns', { y: 16, opacity: 0, duration: 1 }, 1.1);
    gsap.to('.hero__media', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

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

    // Rooms: pinned sideways journey on wide screens, native swipe row on phones
    var mm = gsap.matchMedia();
    mm.add('(min-width: 761px)', function () {
      var track = document.getElementById('roomsTrack');
      function dist() { return Math.max(0, track.scrollWidth - window.innerWidth); }
      gsap.to(track, {
        x: function () { return -dist(); }, ease: 'none',
        scrollTrigger: { trigger: '.rooms__pin', start: 'top top', end: function () { return '+=' + dist(); }, pin: true, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1 }
      });
    });

    // gentle drift on the cellar photo
    gsap.fromTo('.cellar__media img', { yPercent: -4, scale: 1.06 }, { yPercent: 4, scale: 1.06, ease: 'none', scrollTrigger: { trigger: '.cellar', start: 'top bottom', end: 'bottom top', scrub: true } });

    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  }

  /* ---------- pop-up ---------- */
  var BOOK = 'https://services.semper.co.za/BookingEngine/full-layout/date-selection?VenueID=17385&ChannelID=1';
  var pop = document.getElementById('pop');
  var slides = document.getElementById('popSlides');
  var popText = document.getElementById('popText');
  var prev = document.getElementById('popPrev');
  var next = document.getElementById('popNext');
  var lastFocus = null;

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
      im.onload = function () {
        // never stretch a photo past its own pixel size
        var box = slides.getBoundingClientRect();
        if (im.naturalWidth < box.width || im.naturalHeight < box.height) im.classList.add('is-small');
      };
      f.appendChild(im); slides.appendChild(f);
    });
    prev.hidden = next.hidden = list.length < 2;
    popText.innerHTML = '';
    var copy = tpl.content.cloneNode(true);
    popText.appendChild(copy);
    var h = popText.querySelector('h3');
    if (h) h.id = 'popTitle';
    var name = h ? h.textContent.trim() : 'General enquiry';
    var btns = document.createElement('div');
    btns.className = 'btns';
    var isRoom = src.classList.contains('room');
    btns.innerHTML = '<a class="btn btn--mist" target="_blank" rel="noopener" href="' + BOOK + '">Book Now</a>' +
      '<a class="btn btn--ghost" href="#contact">' + (isRoom ? 'Enquire about ' + name.replace(/^The /, 'the ') : 'Enquire Now') + '</a>';
    btns.lastChild.addEventListener('click', function (e) { e.preventDefault(); closePop(); prefill(name); setTimeout(function () { goTo('#contact'); }, 60); });
    popText.querySelector('.pop__copy').appendChild(btns);
    popText.scrollTop = 0; slides.scrollLeft = 0;
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
  document.querySelectorAll('[data-pop-btn]').forEach(function (b) {
    b.addEventListener('click', function () { openPop(b.closest('.split__copy, .cellar__inner')); });
  });

  /* ---------- photo album lightbox ---------- */
  var lb = document.getElementById('lb');
  var lbImg = document.getElementById('lbImg');
  var items = Array.prototype.slice.call(document.querySelectorAll('.album__item img'));
  var cur = 0;
  function showLb(i) { cur = (i + items.length) % items.length; lbImg.src = items[cur].getAttribute('src'); lbImg.alt = items[cur].alt; }
  items.forEach(function (im, i) {
    im.parentNode.setAttribute('aria-label', 'Open photo: ' + im.alt);
    im.parentNode.addEventListener('click', function () { lastFocus = im.parentNode; showLb(i); if (lenis) lenis.stop(); lb.showModal(); });
  });
  document.getElementById('lbPrev').addEventListener('click', function () { showLb(cur - 1); });
  document.getElementById('lbNext').addEventListener('click', function () { showLb(cur + 1); });
  document.getElementById('lbClose').addEventListener('click', function () { lb.close(); });
  lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
  lb.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') showLb(cur - 1); if (e.key === 'ArrowRight') showLb(cur + 1); });
  lb.addEventListener('close', function () { if (lenis) lenis.start(); if (lastFocus) lastFocus.focus({ preventScroll: true }); });

  /* ---------- form: prefill from Enquire buttons, send by email until a form service is chosen ---------- */
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
})();
