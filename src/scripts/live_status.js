/**
 * Twitch "LIVE" badge for the Schedule nav link.
 *
 * Polls a public, unauthenticated uptime endpoint (no API keys/secrets
 * needed) for each channel in CHANNELS, in array order, and links the
 * #rr-live-status badge to the first (highest-priority) one currently
 * streaming. Reorder CHANNELS to change priority.
 *
 */
(function () {
  'use strict';

  var CHANNELS = ['Rocket_Rivals', 'Rocket_Rivals_Alt', 'ayjjake']; // The current list of channels that will trigger the live badge
  var POLL_INTERVAL_MS = 60000;

  function init() {
    var badge = document.getElementById('rr-live-status');
    if (!badge) return;

    checkAll(badge);
    setInterval(function () {
      checkAll(badge);
    }, POLL_INTERVAL_MS);
  }

  function checkChannel(channel) {
    return fetch('https://decapi.me/twitch/uptime/' + channel)
      .then(function (res) { return res.text(); })
      .then(function (text) {
        var isLive = text.trim().toLowerCase().indexOf('offline') === -1;
        return { channel: channel, isLive: isLive };
      })
      .catch(function () {
        // Network hiccup or the third-party service is down for this
        // channel — treat it as not live rather than guessing.
        return { channel: channel, isLive: false };
      });
  }

  function checkAll(badge) {
    // Promise.all preserves input order, so the first live result here
    // is the highest-priority channel per CHANNELS' array position.
    Promise.all(CHANNELS.map(checkChannel)).then(function (results) {
      var live = null;
      for (var i = 0; i < results.length; i++) {
        if (results[i].isLive) {
          live = results[i];
          break;
        }
      }
      setLive(badge, live);
    });
  }

  function setLive(badge, live) {
    badge.classList.toggle('is-live', !!live);
    badge.textContent = live ? 'LIVE' : '';
    if (live) {
      badge.href = 'https://www.twitch.tv/' + live.channel;
      badge.title = 'Watch ' + live.channel + ' live now';
    } else {
      badge.removeAttribute('href');
      badge.removeAttribute('title');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
