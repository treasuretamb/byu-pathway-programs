/* BYU-Pathway Programs — Shared Deck JS */

(function () {
  const slides   = document.querySelectorAll('.slide');
  const TOTAL    = slides.length;
  if (!TOTAL) return;

  let current    = 0;
  let touchStartX = 0, touchStartY = 0;

  function go(dir) {
    slides[current].classList.remove('active');
    slides[current].classList.add('exit');
    const prev = current;
    setTimeout(() => slides[prev].classList.remove('exit'), 400);

    current = Math.max(0, Math.min(TOTAL - 1, current + dir));
    slides[current].classList.add('active');

    // Scroll scrollable containers back to top on mobile
    slides[current].querySelectorAll('.slide-body, .closing, .lab-slide')
      .forEach(function (el) { el.scrollTop = 0; });

    sync();
  }

  function sync() {
    document.querySelectorAll('.slide-counter')
      .forEach(function (el) { el.textContent = (current + 1) + ' / ' + TOTAL; });

    document.querySelectorAll('.prog-fill')
      .forEach(function (el) { el.style.width = ((current + 1) / TOTAL * 100) + '%'; });

    document.querySelectorAll('[data-prev]')
      .forEach(function (btn) { btn.disabled = current === 0; });

    document.querySelectorAll('[data-next]')
      .forEach(function (btn) { btn.disabled = current === TOTAL - 1; });
  }

  // Wire up buttons
  document.querySelectorAll('[data-prev]').forEach(function (btn) {
    btn.addEventListener('click', function () { go(-1); });
  });
  document.querySelectorAll('[data-next]').forEach(function (btn) {
    btn.addEventListener('click', function () { go(1); });
  });

  // Keyboard
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') go(1);
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   go(-1);
  });

  // Swipe (horizontal only, not inside carousel)
  document.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  document.addEventListener('touchend', function (e) {
    if (e.target.closest('.carousel')) return; // let carousel handle its own
    var dx = e.changedTouches[0].screenX - touchStartX;
    var dy = e.changedTouches[0].screenY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx < 0) go(1); else go(-1);
    }
  }, { passive: true });

  // Init
  slides[0].classList.add('active');
  sync();

  // ─── CAROUSEL ───
  var carSlides  = document.querySelectorAll('.carousel-slide');
  var CARC       = carSlides.length;
  if (!CARC) return;

  var carIdx    = 0;
  var carTimer  = null;
  var carTouchX = 0, carTouchY = 0;
  var dotsEl    = document.getElementById('carouselDots');
  var counter   = document.getElementById('carouselCounter');
  var prevBtn   = document.getElementById('carouselPrev');
  var nextBtn   = document.getElementById('carouselNext');

  // Build dots
  if (dotsEl) {
    for (var i = 0; i < CARC; i++) {
      (function (idx) {
        var d = document.createElement('button');
        d.className = 'carousel-dot';
        d.setAttribute('aria-label', 'Photo ' + (idx + 1));
        d.addEventListener('click', function () { carGoTo(idx); });
        dotsEl.appendChild(d);
      })(i);
    }
  }

  function carGoTo(n) {
    carSlides[carIdx].classList.remove('active');
    carIdx = (n + CARC) % CARC;
    carSlides[carIdx].classList.add('active');
    if (dotsEl) dotsEl.querySelectorAll('.carousel-dot').forEach(function (d, i) {
      d.classList.toggle('active', i === carIdx);
    });
    if (counter) counter.textContent = (carIdx + 1) + ' / ' + CARC;
  }

  function carNext() { carGoTo(carIdx + 1); }
  function carPrev() { carGoTo(carIdx - 1); }
  function carStart() { carTimer = setInterval(carNext, 5000); }
  function carStop()  { clearInterval(carTimer); }
  function carReset() { carStop(); carStart(); }

  if (prevBtn) prevBtn.addEventListener('click', function () { carPrev(); carReset(); });
  if (nextBtn) nextBtn.addEventListener('click', function () { carNext(); carReset(); });

  // Carousel touch swipe
  var carousel = document.getElementById('labCarousel');
  if (carousel) {
    carousel.addEventListener('touchstart', function (e) {
      carTouchX = e.changedTouches[0].screenX;
      carTouchY = e.changedTouches[0].screenY;
    }, { passive: true });

    carousel.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].screenX - carTouchX;
      var dy = e.changedTouches[0].screenY - carTouchY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        e.stopPropagation();
        if (dx < 0) carNext(); else carPrev();
        carReset();
      }
    });
  }

  carGoTo(0);
  carStart();
})();
