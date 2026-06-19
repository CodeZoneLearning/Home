window.codeZoneSubject = {
  id: 'data-analytics'
};

const firstModule = document.querySelector('.module-card-featured');
const firstModuleLink = document.querySelector('[data-module-open]');
const startedKey = 'code-zone-started:data-analytics:01';

try {
  firstModule?.classList.toggle('is-started', localStorage.getItem(startedKey) === 'true');
} catch {
  // The module remains usable when local storage is unavailable.
}

firstModuleLink?.addEventListener('click', () => {
  firstModule?.classList.add('is-started');
  try {
    localStorage.setItem(startedKey, 'true');
  } catch {
    // The visual state still works for the current page view.
  }
});
