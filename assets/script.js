// Muralla — interaction layer (accordion + theme toggle; all motion otherwise is CSS)
(function () {
  var root = document.documentElement;
  var KEY = 'muralla-theme';

  function systemPref() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  // resolve theme: stored choice wins, otherwise follow the OS
  function resolve() {
    var stored = null;
    try { stored = localStorage.getItem(KEY); } catch (e) {}
    return stored === 'light' || stored === 'dark' ? stored : systemPref();
  }

  function clonePage() {
    // full clone of the live page; it inherits <html data-theme> so it renders in that theme
    var clone = document.body.cloneNode(true);
    clone.querySelectorAll('script').forEach(function (n) { n.remove(); });
    clone.querySelectorAll('.theme-reveal').forEach(function (n) { n.remove(); });
    clone.querySelectorAll('[id]').forEach(function (n) { n.removeAttribute('id'); });
    return clone;
  }

  function apply(theme, origin) {
    root.setAttribute('data-theme', theme);
    document.querySelectorAll('.theme-toggle-btn').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.dataset.theme === theme));
    });
    if (!origin) return;

    var cx = origin.clientX, cy = origin.clientY;
    var xPct = (cx / window.innerWidth * 100) + '%';
    var yPct = (cy / window.innerHeight * 100) + '%';
    // radius that always covers the whole viewport from the click point
    var dx = Math.max(cx, window.innerWidth - cx);
    var dy = Math.max(cy, window.innerHeight - cy);
    var radius = Math.round(Math.sqrt(dx * dx + dy * dy)) + 20;

    // new theme: clone AFTER the flip (renders in the new theme), shown underneath
    var newLayer = clonePage();

    // old theme: restore the previous data-theme on this clone, shown on top
    var prev = (theme === 'light') ? 'dark' : 'light';
    root.setAttribute('data-theme', prev);
    var oldLayer = clonePage();
    root.setAttribute('data-theme', theme); // restore

    var wrap = document.createElement('div');
    wrap.className = 'theme-reveal';
    wrap.appendChild(newLayer);
    wrap.appendChild(oldLayer);
    wrap.style.setProperty('--vt-x', xPct);
    wrap.style.setProperty('--vt-y', yPct);
    wrap.style.setProperty('--vt-r', radius + 'px');
    document.body.appendChild(wrap);

    requestAnimationFrame(function () { wrap.classList.add('is-animating'); });
    var done = function () { if (wrap.parentNode) wrap.remove(); };
    wrap.querySelector('.theme-reveal-old').addEventListener('animationend', done);
    setTimeout(done, 900);
  }

  window.addEventListener('DOMContentLoaded', function () {
    apply(resolve());

    document.querySelectorAll('.theme-toggle-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        var theme = btn.dataset.theme;
        try { localStorage.setItem(KEY, theme); } catch (e2) {}
        apply(theme, { clientX: e.clientX, clientY: e.clientY });
      });
    });

    // follow the OS as long as the user hasn't chosen manually
    if (window.matchMedia) {
      var mq = window.matchMedia('(prefers-color-scheme: light)');
      var onSystemChange = function () {
        var stored = null;
        try { stored = localStorage.getItem(KEY); } catch (e) {}
        if (!stored) apply(systemPref());
      };
      if (mq.addEventListener) mq.addEventListener('change', onSystemChange);
      else if (mq.addListener) mq.addListener(onSystemChange);
    }

    var items = document.querySelectorAll('.faq-item');
    items.forEach(function (item) {
      var btn = item.querySelector('.faq-q');
      var panel = item.querySelector('.faq-a');
      btn.addEventListener('click', function () {
        var isOpen = item.getAttribute('data-open') === 'true';
        // close all others (single-open accordion keeps the sheet tidy)
        items.forEach(function (other) {
          other.setAttribute('data-open', 'false');
          other.querySelector('.faq-a').style.maxHeight = null;
          other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.setAttribute('data-open', 'true');
          btn.setAttribute('aria-expanded', 'true');
          panel.style.maxHeight = panel.scrollHeight + 'px';
        }
      });
    });
  });
})();
