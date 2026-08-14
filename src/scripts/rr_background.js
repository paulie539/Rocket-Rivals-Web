/**
 * Animated particle canvas background for Rocket Rivals.
 */
(function () {
  'use strict';

  // ── Particle colours ──
  const COLORS = [
    'rgba(168, 85,  247,',   /* purple  */
    'rgba(251, 146,  60,',   /* orange  */
    'rgba(255, 215,   0,',   /* gold    */
    'rgba(236,  72, 153,',   /* pink    */
    /* 'rgba(255, 255, 255,'   white   */      // Note: interferes with text readability
  ];

  // Moved to IIFE scope (shared across every astro:page-load run) instead of
  // living inside init(), so the document-level listeners below always act
  // on the current canvas/animation state instead of a stale one from a
  // previous navigation.
  let canvas = null;
  let ctx = null;
  let particles = [];
  let rafId = null;
  let listenersAttached = false;

  // Full document height, not just the viewport
  function pageHeight() {
    return Math.max(window.innerHeight, document.documentElement.scrollHeight);
  }

  function resize() {
    // Zero the canvas's own height before measuring. The canvas is itself
    // part of the document, so if we measured with its old (possibly too
    // tall) height still in place, pageHeight() would just read that same
    // stale height back via scrollHeight — the canvas can never shrink,
    // only grow, because it's included in the very thing deciding its size.
    canvas.height = 0;
    canvas.width = document.documentElement.clientWidth;
    canvas.height = pageHeight();
  }

  function buildParticles() {
    // Density is tuned per viewport-height's worth of page, not a flat
    // count. Otherwise, the same 80 particles that read as a lively
    // field over one screen would look sparse spread across a much
    // larger one
    const perScreen = window.innerWidth < 768 ? 35 : 80;
    const count = Math.round(perScreen * (canvas.height / window.innerHeight));
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 0.5 + Math.random() * 2,
        dx: (Math.random() - 0.5) * 0.3,
        dy: -0.05 - Math.random() * 0.35,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: 0.25 + Math.random() * 0.65,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(function (p) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.fill();

      // Move particle
      p.x += p.dx;
      p.y += p.dy;

      // Wrap around edges
      if (p.y < -5) {
        p.y = canvas.height + 5;
        p.x = Math.random() * canvas.width;
      }
      if (p.x < -5) { p.x = canvas.width + 5; }
      if (p.x > canvas.width + 5) { p.x = -5; }
    });

    rafId = requestAnimationFrame(draw);
  }

  function init() {
    // The canvas isn't part of Astro's server-rendered markup, so a view
    // transition swap removes it along with the rest of the old page's body
    // Recreate it if it's missing rather than guarding against re-init.
    if (!document.getElementById('bg-canvas')) {
      canvas = document.createElement('canvas');
      canvas.id = 'bg-canvas';
      canvas.setAttribute('aria-hidden', 'true');
      document.body.prepend(canvas);

      ctx = canvas.getContext('2d');
      resize();
      buildParticles();

      // Images/fonts below the fold can grow the page after this first
      // measurement. Re-measure once things have had a chance to load
      // so the canvas covers the page's real final height instead of
      // whatever it happened to be on the first paint.
      setTimeout(function () {
        resize();
        buildParticles();
      }, 100);
    }

    // Read saved user preference (default: enabled).
    const bgEnabled = localStorage.getItem('rr_bg_enabled') !== 'false';
    if (bgEnabled) {
      cancelAnimationFrame(rafId);
      draw();
    } else {
      canvas.style.display = 'none';
    }

    // Document-level listeners only need to be attached once, ever. They
    // close over the outer-scope canvas/ctx/rafId variables above, so they
    // stay correct even after init() recreates the canvas on a later page.
    if (listenersAttached) return;
    listenersAttached = true;

    window.addEventListener('resize', resize);

    // canvas.height is only ever set from document.documentElement.scrollHeight
    // above, so it needs to be recalculated any time the page's content height
    // changes in place, not just on a real window resize. Without this, a
    // shorter page (e.g. the live-stats search filtering table rows away)
    // leaves the canvas — and therefore the document's scrollable height —
    // stuck at its old, taller size.
    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(resize).observe(document.documentElement);
    }

    // Pause animation when tab is not visible to save CPU/battery
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
        rafId = null;
      } else if (!rafId && localStorage.getItem('rr_bg_enabled') !== 'false') {
        draw();
      }
    });

    // Listen for footer toggle button events.
    document.addEventListener('rr:bg-toggle', function (e) {
      if (e.detail.enabled) {
        canvas.style.display = '';
        if (!rafId) draw();
      } else {
        cancelAnimationFrame(rafId);
        rafId = null;
        canvas.style.display = 'none';
      }
    });
  }

  // astro:page-load fires after the first load AND after every client-side
  // navigation the ClientRouter performs, so this replaces the old
  // readyState/DOMContentLoaded check (which only ever fires once).
  document.addEventListener('astro:page-load', init);
})();
