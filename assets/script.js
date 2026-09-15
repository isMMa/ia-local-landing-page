// Muralla — interaction layer (accordion + theme toggle)
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
    var active = stored === 'light' || stored === 'dark' ? stored : 'auto';
    var theme = active === 'auto' ? systemPref() : active;
    return { mode: active, theme: theme };
  }

  function apply(theme, mode) {
    root.setAttribute('data-theme', theme);
    mode = mode || (theme === systemPref() ? 'auto' : theme);
    document.querySelectorAll('.theme-toggle-btn').forEach(function (btn) {
      var active = btn.dataset.theme === mode;
      btn.setAttribute('aria-pressed', String(active));
      if (active) btn.classList.add('is-active');
      else btn.classList.remove('is-active');
    });
  }

  window.addEventListener('DOMContentLoaded', function () {
    var initial = resolve();
    apply(initial.theme, initial.mode);

    document.querySelectorAll('.theme-toggle-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var mode = btn.dataset.theme;
        if (mode === 'auto') {
          try { localStorage.removeItem(KEY); } catch (e1) {}
          apply(systemPref(), 'auto');
        } else {
          try { localStorage.setItem(KEY, mode); } catch (e2) {}
          apply(mode, mode);
        }
      });
    });

    // follow the OS as long as the user hasn't chosen manually
    if (window.matchMedia) {
      var mq = window.matchMedia('(prefers-color-scheme: light)');
      var onSystemChange = function () {
        var stored = null;
        try { stored = localStorage.getItem(KEY); } catch (e) {}
        if (!stored) apply(systemPref(), 'auto');
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
