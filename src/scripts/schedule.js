(function () {
  'use strict';

  // astro:page-load fires after the first load AND after every client-side
  // navigation the ClientRouter performs. Both the Twitch lazy-load and the
  // tab logic now live inside it — previously the Twitch lazy-load ran at
  // the top level (once per hard page load only), which would never re-run
  // after navigating away from /schedule and back via the router.
  document.addEventListener('astro:page-load', function () {
    // Lazy-load the Twitch embed when it scrolls into view.
    var twitchWrapper = document.querySelector('[data-twitch-src]');
    if (twitchWrapper) {
      var observer = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          var iframe = document.createElement('iframe');
          iframe.src = twitchWrapper.dataset.twitchSrc + '&parent=' + window.location.hostname;
          iframe.frameBorder = '0';
          iframe.allowFullscreen = true;
          iframe.scrolling = 'no';
          twitchWrapper.appendChild(iframe);
          observer.disconnect();
        }
      }, { threshold: 0.1 });
      observer.observe(twitchWrapper);
    }

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
