(function () {
  'use strict';

  var root = document.documentElement;

  /* ---------- Theme toggle (dark / light) ---------- */
  var themeBtn = document.getElementById('theme-toggle');

  function applyTheme(theme) {
    root.dataset.theme = theme;
    themeBtn.setAttribute('aria-pressed', String(theme === 'light'));
    themeBtn.setAttribute('aria-label', theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
  }
  applyTheme(root.dataset.theme || 'dark');

  themeBtn.addEventListener('click', function () {
    var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('theme', next); } catch (e) { /* storage unavailable */ }
  });

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.getElementById('menu-toggle');
  var nav = document.getElementById('nav');

  function setMenu(open) {
    nav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  menuBtn.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Blueprint flashlight: grid lights up where the cursor is ---------- */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  window.addEventListener('pointermove', function (e) {
    root.style.setProperty('--sx', e.clientX + 'px');
    root.style.setProperty('--sy', e.clientY + 'px');
  }, { passive: true });

  /* ---------- ID card: tilts toward the pointer, glare follows it ---------- */
  var card = document.getElementById('id-card');
  if (card && !reduce) {
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width;
      var y = (e.clientY - r.top) / r.height;
      card.classList.add('live');
      card.style.setProperty('--rx', ((0.5 - y) * 16) + 'deg');
      card.style.setProperty('--ry', ((x - 0.5) * 20) + 'deg');
      card.style.setProperty('--gx', (x * 100) + '%');
      card.style.setProperty('--gy', (y * 100) + '%');
    });
    card.addEventListener('pointerleave', function () {
      card.classList.remove('live');
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  }

  /* ---------- Typing effect ---------- */
  var typedEl = document.getElementById('typed');
  var words = ['clean websites', 'helpful projects', 'small useful tools', 'clean UI'];

  if (typedEl) {
    if (reduce) {
      typedEl.textContent = words[0];
    } else {
      var wordIndex = 0, charCount = 0, deleting = false;

      (function type() {
        var word = words[wordIndex];
        typedEl.textContent = word.slice(0, charCount);

        if (!deleting && charCount < word.length) {
          charCount++;
        } else if (!deleting) {
          deleting = true;
          setTimeout(type, 1200);
          return;
        } else if (charCount > 0) {
          charCount--;
        } else {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
        }
        setTimeout(type, deleting ? 40 : 90);
      })();
    }
  }

  /* ---------- Footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
