(function () {
  'use strict';

  // astro:page-load fires after the first load AND after every client-side
  // navigation the ClientRouter performs.
  document.addEventListener('astro:page-load', function () {
    var tabs   = document.querySelectorAll('.rr-tab-btn');
    var panels = document.querySelectorAll('.rr-schedule-panel');

    if (!tabs.length) return;

    // Activate the first tab on load
    activate(tabs[0].dataset.division);

    tabs.forEach(function (btn) {
      btn.addEventListener('click', function () {
        activate(btn.dataset.division);
      });
    });

    function activate(division) {
      tabs.forEach(function (b) {
        b.classList.toggle('is-active', b.dataset.division === division);
      });
      panels.forEach(function (p) {
        var wasVisible = p.classList.contains('is-visible');
        var willShow   = p.dataset.division === division;

        if (!wasVisible && willShow) {
          // Re-trigger animation by removing and re-adding the class
          p.classList.remove('is-visible');
          // Force reflow so the animation restarts
          void p.offsetWidth;
          p.classList.add('is-visible');
        } else {
          p.classList.toggle('is-visible', willShow);
        }
      });
    }
  });
})();
