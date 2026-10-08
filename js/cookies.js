(function () {
  'use strict';
  // If tracking is added, implement consent gating and bump this version to ask again.
  var key = 'concraft-cookie-choice-v2';
  var lifetime = 180 * 24 * 60 * 60 * 1000;
  var choice = null;
  var returnFocus = null;
  var banner = document.createElement('section');
  banner.className = 'cookie-banner';
  banner.setAttribute('aria-label', 'Cookie preferences');
  banner.innerHTML = '<div><h2>YOUR COOKIE CHOICE</h2><p>We do not currently use analytics or advertising cookies. Google Maps loads automatically and may use cookies, regardless of your choice here. We remember your preference for six months.</p><a href="privacy.html#cookies">Read our cookie policy</a></div><div class="cookie-actions"><button type="button" class="cookie-button" data-reject>Reject optional cookies</button><button type="button" class="cookie-button" data-accept>Allow</button></div>';
  document.body.appendChild(banner);
  function readChoice() {
    try {
      var saved = JSON.parse(localStorage.getItem(key));
      return saved && typeof saved.optional === 'boolean' && typeof saved.at === 'number' && saved.at <= Date.now() && Date.now() - saved.at < lifetime ? saved.optional : null;
    } catch (error) { return null; }
  }
  function save(allowed) {
    var active = document.activeElement;
    choice = allowed;
    try { localStorage.setItem(key, JSON.stringify({ optional: allowed, at: Date.now() })); } catch (error) {}
    banner.hidden = true;
    var target = returnFocus || document.querySelector('[data-cookie-settings]');
    if (banner.contains(active)) target.focus({ preventScroll: true });
    returnFocus = null;
  }
  banner.querySelector('[data-reject]').addEventListener('click', function () { save(false); });
  banner.querySelector('[data-accept]').addEventListener('click', function () { save(true); });
  document.querySelectorAll('[data-cookie-settings]').forEach(function (button) {
    button.hidden = false;
    button.addEventListener('click', function () {
      returnFocus = button;
      banner.hidden = false;
      banner.querySelector('[data-reject]').focus({ preventScroll: true });
    });
  });
  window.addEventListener('storage', function (event) {
    if (event.key !== key && event.key !== null) return;
    choice = readChoice(); banner.hidden = choice !== null;
  });
  // Recheck expiry when returning to a page, including browser back/forward cache.
  function refresh() { choice = readChoice(); banner.hidden = choice !== null; }
  window.addEventListener('pageshow', refresh);
  refresh();
})();
