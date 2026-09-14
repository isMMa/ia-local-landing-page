// Muralla — interaction layer (accordion only; all motion otherwise is CSS)
document.addEventListener('DOMContentLoaded', function () {
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
