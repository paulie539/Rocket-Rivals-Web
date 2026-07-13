/**
 * Backdrop octane effects for /experimental: random lean jitter, and
 * visibility tied to the footer's "Background Effects" toggle — the same
 * 'rr_bg_enabled' localStorage flag and 'rr:bg-toggle' CustomEvent that
 * rr_background.js listens for, so the cars turn off/on together with
 * the particle canvas instead of having their own separate control.
 */
(function () {
  'use strict';

  // Attached once, ever (see rr_background.js for the same pattern) —
  // 'rr:bg-toggle' fires on document, which persists across client-side
  // navigations, so re-adding this listener on every astro:page-load
  // would stack up duplicate handlers.
  var listenersAttached = false;

  function applyJitter() {
    document.querySelectorAll('.rr-fx-car').forEach(function (car) {
      var jitter = Math.random() * 10;
      car.style.setProperty('--rr-fx-jitter', jitter.toFixed(2) + 'deg');
    });
  }

  function applyVisibility(enabled) {
    var layer = document.querySelector('.rr-fx-layer');
    if (layer) layer.style.display = enabled ? '' : 'none';
  }

  function init() {
    applyJitter();

    // Read the same preference rr_background.js and rr_bg_toggle.js read
    // (default enabled, only off when explicitly set to 'false').
    applyVisibility(localStorage.getItem('rr_bg_enabled') !== 'false');

    if (listenersAttached) return;
    listenersAttached = true;

    document.addEventListener('rr:bg-toggle', function (e) {
      applyVisibility(e.detail.enabled);
    });
  }

  document.addEventListener('astro:page-load', init);
})();
