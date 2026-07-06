/**
 * Particle-toggle button for the Rocket Rivals footer.
 *
 * Reads/writes 'rr_bg_enabled' in localStorage and dispatches a
 * 'rr:bg-toggle' CustomEvent on document so rr_background.js can
 * start or stop the animation loop without a page reload.
 */
(function () {
  'use strict';

  function init() {
    const btn = document.getElementById('rr-bg-toggle');
    if (!btn || btn.dataset.toggleAttached) return;
    btn.dataset.toggleAttached = 'true';

    // Default preference is enabled; only disabled when explicitly set.
    const isEnabled = localStorage.getItem('rr_bg_enabled') !== 'false';
    applyState(btn, isEnabled);

    btn.addEventListener('click', function () {
      const next = localStorage.getItem('rr_bg_enabled') === 'false';
      localStorage.setItem('rr_bg_enabled', next ? 'true' : 'false');
      applyState(btn, next);
      document.dispatchEvent(
        new CustomEvent('rr:bg-toggle', { detail: { enabled: next } })
      );
    });
  }

  function applyState(btn, enabled) {
    btn.classList.toggle('is-off', !enabled);
    btn.setAttribute('aria-pressed', enabled ? 'true' : 'false');
    btn.querySelector('.rr-bg-toggle__label').textContent = 'Background Effect';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
