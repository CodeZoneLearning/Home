const subjectConfig = window.codeZoneSubject || { id: 'subject' };
const storageKey = `code-zone-progress:${subjectConfig.id}`;
const moduleChecks = [...document.querySelectorAll('[data-module]')];
const progressTrack = document.querySelector('.subject-progress-track');
const progressText = document.querySelector('[data-progress-text]');
const progressSegments = [];

if (progressTrack) {
  progressTrack.setAttribute('role', 'progressbar');
  progressTrack.setAttribute('aria-valuemin', '0');
  progressTrack.setAttribute('aria-valuemax', String(moduleChecks.length));
  progressTrack.replaceChildren();
  moduleChecks.forEach((_, index) => {
    const segment = document.createElement('span');
    segment.className = 'subject-progress-segment';
    segment.setAttribute('aria-hidden', 'true');
    progressSegments.push(segment);
    progressTrack.appendChild(segment);
  });
}

const readProgress = () => {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  } catch {
    return [];
  }
};

const updateProgress = () => {
  const completed = moduleChecks.filter((check) => check.checked).map((check) => check.dataset.module);
  const percentage = moduleChecks.length ? Math.round((completed.length / moduleChecks.length) * 100) : 0;

  progressSegments.forEach((segment, index) => {
    segment.classList.toggle('is-complete', moduleChecks[index]?.checked);
  });

  moduleChecks.forEach((check) => {
    check.closest('.module-card')?.classList.toggle('is-complete', check.checked);
  });

  if (progressTrack) {
    progressTrack.setAttribute('aria-valuenow', String(completed.length));
    progressTrack.setAttribute('aria-valuetext', `${percentage}% concluído`);
  }

  if (progressText) {
    const percentageLabel = document.createElement('b');
    const blocksLabel = document.createElement('span');
    percentageLabel.textContent = `${percentage}%`;
    blocksLabel.textContent = `${completed.length}/${moduleChecks.length} blocos`;
    progressText.replaceChildren(percentageLabel, blocksLabel);
  }

  try {
    localStorage.setItem(storageKey, JSON.stringify(completed));
  } catch {
    // Progress remains available for the current session when storage is blocked.
  }
};

const savedProgress = readProgress();
moduleChecks.forEach((check) => {
  check.checked = savedProgress.includes(check.dataset.module);
  const moduleTitle = check.closest('.module-card')?.querySelector('h3')?.textContent;
  check.setAttribute('aria-label', `Marcar ${moduleTitle || `bloco ${check.dataset.module}`} como concluído`);
  check.addEventListener('change', updateProgress);
});
updateProgress();

document.querySelectorAll('[data-copy]').forEach((button) => {
  button.addEventListener('click', async () => {
    const value = button.dataset.copy;
    const originalLabel = button.textContent;

    try {
      await navigator.clipboard.writeText(value);
      button.textContent = 'Copiado';
    } catch {
      const input = document.createElement('textarea');
      input.value = value;
      input.setAttribute('readonly', '');
      input.style.position = 'fixed';
      input.style.opacity = '0';
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      input.remove();
      button.textContent = 'Copiado';
    }

    window.setTimeout(() => {
      button.textContent = originalLabel;
    }, 1800);
  });
});

const sections = [...document.querySelectorAll('.subject-section[id]')];
const sectionLinks = [...document.querySelectorAll('.subject-side-nav a[href^="#"]')];

if ('IntersectionObserver' in window && sections.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visibleSection = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visibleSection) return;
    sectionLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${visibleSection.target.id}`);
    });
  }, { rootMargin: '-25% 0px -60%', threshold: [0.05, 0.2, 0.5] });

  sections.forEach((section) => sectionObserver.observe(section));
}
