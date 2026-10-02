/* SEM 10-XP — Tracker Sort / Filter enhancement */
(function installTrackerSortFilter(){
  if (typeof window === 'undefined' || typeof document === 'undefined' || window.__sem10TrackerSortFilterInstalled) return;
  window.__sem10TrackerSortFilterInstalled = true;

  function scanWindows(){
    const windows = Array.from(document.querySelectorAll('.xp-window'));
    for (const win of windows) {
      const toolbar = win.querySelector('.toolbar');
      if (!toolbar || toolbar.dataset.sfReady === 'true') continue;

      toolbar.dataset.sfReady = 'true';

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'xp-btn xp-btn-small';
      button.textContent = 'Sort / Filter';
      button.title = 'Sort / filter lectures';
      button.setAttribute('aria-label', 'Sort / Filter lectures');
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
      });

      toolbar.appendChild(button);
    }
  }

  scanWindows();

  if (document.body) {
    const observer = new MutationObserver(() => scanWindows());
    observer.observe(document.body, { childList: true, subtree: true });
  }

  window.addEventListener('load', scanWindows, { once: true });
})();
