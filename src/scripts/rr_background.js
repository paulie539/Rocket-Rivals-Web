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

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function buildParticles() {
    // Reduce particles on mobile to keep CPU/battery reasonable
    const count = window.innerWidth < 768 ? 35 : 80;
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
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
    // — recreate it if it's missing rather than guarding against re-init.
    if (!document.getElementById('bg-canvas')) {
      canvas = document.createElement('canvas');
      canvas.id = 'bg-canvas';
      canvas.setAttribute('aria-hidden', 'true');
      document.body.prepend(canvas);

      ctx = canvas.getContext('2d');
      resize();
      buildParticles();
    }

    // Read saved user preference (default: enabled).
    const bgEnabled = localStorage.getItem('rr_bg_enabled') !== 'false';
    if (bgEnabled) {
      cancelAnimationFrame(rafId);
      draw();
    } else {
      canvas.style.display = 'none';
    }

    // Document-level listeners only need to be attached once, ever — they
    // close over the outer-scope canvas/ctx/rafId variables above, so they
    // stay correct even after init() recreates the canvas on a later page.
    if (listenersAttached) return;
    listenersAttached = true;

    window.addEventListener('resize', resize);

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
