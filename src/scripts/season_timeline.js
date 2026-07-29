(function () {
  'use strict';

  // astro:page-load fires after the first load AND after every client-side
  // navigation the ClientRouter performs, so this replaces DOMContentLoaded
  // (which only ever fires once). The carousel markup itself is swapped in
  // fresh on every navigation (it's page-specific slot content, not part of
  // the persistent layout), so each run gets its own clean carousel(s) —
  // startTimer()'s own clearInterval(timer) on line 53 already guards
  // against duplicate timers within a single run.
  document.addEventListener('astro:page-load', function () {
    const now = new Date('2026-09-20');
    var items = document.querySelectorAll('.rr-timeline__item');
    if (!items.length) return;

    // "Current" = the last item whose start date has already passed.
    // -1 means the season hasn't started yet (now is before every stage).
    var currentIndex = -1;
    items.forEach(function (item, i) {
      var startDate = new Date(item.dataset.startDate);
      if (now >= startDate) currentIndex = i;
    });

    items.forEach(function (item, i) {
      var status = i < currentIndex ? 'done' : i === currentIndex ? 'active' : 'upcoming';
      item.classList.add('rr-timeline__item--' + status);
      if (status === 'active') item.setAttribute('aria-current', 'step');
    });

    var progressEl = document.querySelector('.rr-timeline__progress');
    if (progressEl) {
      var progressPct = currentIndex < 0 ? 0 : ((currentIndex + 0.5) / items.length) * 100;
      progressEl.style.setProperty('--rr-progress-pct', progressPct + '%');
    }
  });


})();
