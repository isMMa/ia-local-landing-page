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

  function apply(theme, origin) {
    // the old palette still in effect (before we flip data-theme)
    var oldBg = getComputedStyle(document.body).backgroundColor;
    root.setAttribute('data-theme', theme);
    document.querySelectorAll('.theme-toggle-btn').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.dataset.theme === theme));
    });
    if (!origin) return;
    // cover with the old palette, then wipe it away from the click point
    var reveal = document.createElement('div');
    reveal.className = 'theme-reveal';
    reveal.style.setProperty('--vt-bg', oldBg);
    reveal.style.setProperty('--vt-x', (origin.clientX / window.innerWidth * 100) + '%');
    reveal.style.setProperty('--vt-y', (origin.clientY / window.innerHeight * 100) + '%');
    reveal.style.setProperty('--vt-r', '150vmax');
    document.body.appendChild(reveal);
    requestAnimationFrame(function () { reveal.classList.add('is-animating'); });
    reveal.addEventListener('animationend', function () { reveal.remove(); });
    setTimeout(function () { if (reveal.parentNode) reveal.remove(); }, 900);
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
