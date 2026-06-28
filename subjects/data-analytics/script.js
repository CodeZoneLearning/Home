window.codeZoneSubject = {
  id: 'data-analytics'
};

document.querySelectorAll('[data-module-open]').forEach((link) => {
  const moduleId = link.dataset.moduleOpen;
  const moduleCard = link.closest('.module-card');
  const startedKey = `code-zone-started:data-analytics:${moduleId}`;

  try {
    moduleCard?.classList.toggle('is-started', localStorage.getItem(startedKey) === 'true');
  } catch {
    // The module remains usable when local storage is unavailable.
  }

  link.addEventListener('click', () => {
    moduleCard?.classList.add('is-started');
    try {
      localStorage.setItem(startedKey, 'true');
    } catch {
      // The visual state still works for the current page view.
    }
  });
});
