/**
 * Keeps --header-height in sync with #header's real rendered height, and
 * keeps the nav's aria-current in sync with the current page.
 *
 * #header is `position: absolute` (see global.css) so it never pushes
 * #main down on its own — #main's top padding has to know the header's
 * height ahead of time. The header's branding/nav are flex content now
 * (not each independently `position: absolute`), so that height changes
 * continuously with viewport width as they wrap, not just at a couple of
 * hardcoded breakpoints. A ResizeObserver on the header itself is the
 * only way to track that without re-deriving magic numbers per
 * breakpoint (same approach rr_background.js uses to track page height).
 *
 * #header also carries transition:persist (Layout.astro), so it survives
 * client-side navigations as the same DOM node instead of being replaced
 * by the new page's server-rendered header. That's what makes the
 * ResizeObserver below safe to attach only once — but it also means the
 * nav links' server-rendered aria-current goes stale after the first
 * navigation, since that markup never gets re-rendered. syncActiveNav()
 * corrects it by hand on every astro:page-load.
 */
(function () {
  'use strict';

  let observer = null;

  function sync(header) {
    document.documentElement.style.setProperty('--header-height', header.offsetHeight + 'px');
  }

  function syncActiveNav(header) {
    const path = window.location.pathname;
    header.querySelectorAll('a[href^="/"]').forEach(function (link) {
      const href = link.getAttribute('href');
      const isActive = path === href || path.indexOf(href + '/') === 0;
      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  function init() {
    const header = document.getElementById('header');
    if (!header) return;

    sync(header);
    syncActiveNav(header);

    // Observer persists across client-side navigations (the header itself
    // stays the same DOM node, per transition:persist in Layout.astro), so
    // only ever attach it once.
    if (observer) return;

    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(function () { sync(header); });
      observer.observe(header);
    } else {
      window.addEventListener('resize', function () { sync(header); });
    }
  }

  document.addEventListener('astro:page-load', init);
})();
