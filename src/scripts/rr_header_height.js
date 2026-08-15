/**
 * Keeps --header-height in sync with #header's real rendered height.
 *
 * #header is `position: absolute` (see global.css) so it never pushes
 * #main down on its own — #main's top padding has to know the header's
 * height ahead of time. The header's branding/nav are flex content now
 * (not each independently `position: absolute`), so that height changes
 * continuously with viewport width as they wrap, not just at a couple of
 * hardcoded breakpoints. A ResizeObserver on the header itself is the
 * only way to track that without re-deriving magic numbers per
 * breakpoint (same approach rr_background.js uses to track page height).
 */
(function () {
  'use strict';

  let observer = null;

  function sync(header) {
    document.documentElement.style.setProperty('--header-height', header.offsetHeight + 'px');
  }

  function init() {
    const header = document.getElementById('header');
    if (!header) return;

    sync(header);

    // Observer persists across client-side navigations (the header itself
    // stays in place, per transition:animate="none" in Layout.astro), so
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
