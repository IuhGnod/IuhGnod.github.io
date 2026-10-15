(function () {
  'use strict';

  function initReadingProgress() {
    if (document.getElementById('reading-progress')) return;

    var progress = document.createElement('div');
    progress.id = 'reading-progress';
    progress.setAttribute('role', 'progressbar');
    progress.setAttribute('aria-label', '阅读进度');
    progress.setAttribute('aria-valuemin', '0');
    progress.setAttribute('aria-valuemax', '100');
    progress.setAttribute('aria-valuenow', '0');
    progress.innerHTML = '<span class="reading-progress-bar"></span>';
    document.body.appendChild(progress);

    var bar = progress.querySelector('.reading-progress-bar');

    function updateProgress() {
      var root = document.documentElement;
      var scrollable = root.scrollHeight - root.clientHeight;
      var percent = scrollable > 0 ? (root.scrollTop / scrollable) * 100 : 0;
      percent = Math.min(100, Math.max(0, percent));
      bar.style.width = percent + '%';
      progress.setAttribute('aria-valuenow', String(Math.round(percent)));
    }

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        updateProgress();
        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    updateProgress();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReadingProgress);
  } else {
    initReadingProgress();
  }
})();
