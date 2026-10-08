(function () {
  'use strict';
  var key = 'concraft-cookie-choice-v1';
  var lifetime = 180 * 24 * 60 * 60 * 1000;
  var choice = null;
  var returnFocus = null;
  var banner = document.createElement('section');
  banner.className = 'cookie-banner';
  banner.setAttribute('aria-label', 'Cookie preferences');
  banner.innerHTML = '<div><h2>YOUR COOKIE CHOICE</h2><p>We use an optional Google Maps embed, which may set cookies. It stays off unless you allow it. We remember your choice for six months.</p><a href="privacy.html#cookies">Read our cookie policy</a></div><div class="cookie-actions"><button type="button" class="cookie-button" data-reject>Reject optional cookies</button><button type="button" class="cookie-button" data-accept>Allow Google Maps</button></div>';
  document.body.appendChild(banner);
  function readChoice() {
    try {
      var saved = JSON.parse(localStorage.getItem(key));
      return saved && typeof saved.maps === 'boolean' && typeof saved.at === 'number' && saved.at <= Date.now() && Date.now() - saved.at < lifetime ? saved.maps : null;
    } catch (error) { return null; }
  }
  function renderMap() {
    var host = document.getElementById('mapEmbed');
    var placeholder = document.getElementById('mapPlaceholder');
    if (!host || !placeholder) return;
    var allowed = choice === true;
    placeholder.hidden = allowed;
    host.hidden = !allowed;
    if (!allowed) { host.replaceChildren(); return; }
    if (host.querySelector('iframe')) return;
    var frame = document.createElement('iframe');
    frame.src = 'https://www.google.com/maps?q=10+Guithavon+Street,+Witham,+CM8+1BN,+UK&output=embed';
    frame.title = 'CONCRAFT office, 10 Guithavon Street, Witham';
    frame.width = '100%'; frame.height = '100%';
    frame.loading = 'lazy'; frame.referrerPolicy = 'no-referrer-when-downgrade';
    frame.allowFullscreen = true;
    host.appendChild(frame);
  }
  function save(allowed) {
    var active = document.activeElement;
    choice = allowed;
    try { localStorage.setItem(key, JSON.stringify({ maps: allowed, at: Date.now() })); } catch (error) {}
    renderMap();
    banner.hidden = true;
    var target = returnFocus || document.querySelector('[data-cookie-settings]');
    if (banner.contains(active) || (active && active.matches('[data-allow-map]'))) target.focus({ preventScroll: true });
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
  document.querySelectorAll('[data-allow-map]').forEach(function (button) {
    button.hidden = false;
    button.addEventListener('click', function () { save(true); });
  });
  window.addEventListener('storage', function (event) {
    if (event.key !== key && event.key !== null) return;
    choice = readChoice(); renderMap(); banner.hidden = choice !== null;
  });
  // Recheck expiry when returning to a page, including browser back/forward cache.
  function refresh() { choice = readChoice(); renderMap(); banner.hidden = choice !== null; }
  window.addEventListener('pageshow', refresh);
  refresh();
})();
