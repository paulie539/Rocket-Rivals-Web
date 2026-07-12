/**
 * Effect sandbox for /experimental — cursor boost trail and 3D
 * tilt-on-hover cards. Scoped to this page only; never loaded by
 * index.astro or any production page.
 */
(function () {
  'use strict';

  document.addEventListener('astro:page-load', init);

  function init() {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    initCursorTrail(reduceMotion);
    initCardTilt(reduceMotion);
  }

  // ── Experiment #7: cursor boost-trail particles ─────────────
  var TRAIL_COLORS = ['#c084fc', '#f97316', '#ff7eb3', '#d4af37'];

  function initCursorTrail(reduceMotion) {
    if (reduceMotion) return;

    var lastSpawn = 0;
    var SPAWN_INTERVAL = 45; // ms between particle spawns

    document.addEventListener('mousemove', function (e) {
      var now = performance.now();
      if (now - lastSpawn < SPAWN_INTERVAL) return;
      lastSpawn = now;
      spawnParticle(e.clientX, e.clientY);
    });
  }

  function spawnParticle(x, y) {
    var particle = document.createElement('div');
    particle.className = 'rr-boost-particle';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.transform = 'translate(-50%, -50%)';
    particle.style.background = TRAIL_COLORS[Math.floor(Math.random() * TRAIL_COLORS.length)];
    document.body.appendChild(particle);

    requestAnimationFrame(function () {
      particle.classList.add('is-fading');
    });

    setTimeout(function () {
      particle.remove();
    }, 550);
  }

  // ── Experiment #10: 3D tilt-on-hover cards ───────────────────
  var MAX_TILT = 8; // degrees

  function initCardTilt(reduceMotion) {
    if (reduceMotion) return;

    var cards = document.querySelectorAll('.rr-format__card');
    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width;  // 0..1
        var py = (e.clientY - rect.top) / rect.height;  // 0..1
        var rotateY = (px - 0.5) * MAX_TILT * 2;
        var rotateX = (0.5 - py) * MAX_TILT * 2;
        card.style.transform = 'perspective(600px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg)';
      });
    });
  }
})();
