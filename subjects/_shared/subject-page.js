const subjectConfig = window.codeZoneSubject || { id: 'subject' };
const storageKey = `code-zone-progress:${subjectConfig.id}`;
const moduleChecks = [...document.querySelectorAll('[data-module]')];
const progressBar = document.querySelector('[data-progress-bar]');
const progressText = document.querySelector('[data-progress-text]');

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

  if (progressBar) progressBar.style.width = `${percentage}%`;
  if (progressText) progressText.textContent = `${completed.length}/${moduleChecks.length} módulos`;

  try {
    localStorage.setItem(storageKey, JSON.stringify(completed));
  } catch {
    // Progress remains available for the current session when storage is blocked.
  }
};

const savedProgress = readProgress();
moduleChecks.forEach((check) => {
  check.checked = savedProgress.includes(check.dataset.module);
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

const researchRoot = document.querySelector('[data-research-root]');
const researchCatalog = window.codeZoneResearch?.[subjectConfig.id] || [];

if (researchRoot && researchCatalog.length) {
  const typeLabels = {
    paper: 'Paper',
    material: 'Matéria',
    book: 'Livro'
  };

  researchRoot.innerHTML = `
    <p class="subject-section-label">// RESEARCH</p>
    <div class="research-heading">
      <div>
        <h2>Para ir além da trilha.</h2>
        <p class="section-intro">Papers, matérias e livros selecionados para aprofundar decisões e fundamentos.</p>
      </div>
      <span class="research-total" data-research-total></span>
    </div>
    <div class="research-filters" role="group" aria-label="Filtrar referências">
      <button class="research-filter active" type="button" data-research-filter="all" aria-pressed="true">Todos</button>
      <button class="research-filter" type="button" data-research-filter="paper" aria-pressed="false">Papers</button>
      <button class="research-filter" type="button" data-research-filter="material" aria-pressed="false">Matérias</button>
      <button class="research-filter" type="button" data-research-filter="book" aria-pressed="false">Livros</button>
    </div>
    <div class="research-grid" data-research-grid></div>
  `;

  const researchGrid = researchRoot.querySelector('[data-research-grid]');
  const researchTotal = researchRoot.querySelector('[data-research-total]');
  const researchFilters = [...researchRoot.querySelectorAll('[data-research-filter]')];

  const renderResearch = (selectedType = 'all') => {
    const visibleItems = researchCatalog.filter((item) => selectedType === 'all' || item.type === selectedType);
    researchGrid.replaceChildren();

    visibleItems.forEach((item, index) => {
      const card = document.createElement('a');
      card.className = 'research-card';
      card.href = item.url;
      card.target = '_blank';
      card.rel = 'noreferrer';

      const cardTop = document.createElement('div');
      cardTop.className = 'research-card-top';

      const type = document.createElement('span');
      type.className = `research-kind research-kind-${item.type}`;
      type.textContent = typeLabels[item.type] || item.type;

      const year = document.createElement('span');
      year.textContent = item.year || '';
      cardTop.append(type, year);

      const title = document.createElement('h3');
      title.textContent = item.title;

      const meta = document.createElement('p');
      meta.className = 'research-meta';
      meta.textContent = item.meta || '';

      const description = document.createElement('p');
      description.className = 'research-description';
      description.textContent = item.description || '';

      const tags = document.createElement('div');
      tags.className = 'research-tags';
      (item.tags || []).forEach((tag) => {
        const tagElement = document.createElement('span');
        tagElement.textContent = tag;
        tags.appendChild(tagElement);
      });

      const footer = document.createElement('div');
      footer.className = 'research-card-footer';
      footer.innerHTML = `<span>REF_${String(index + 1).padStart(2, '0')}</span><strong>Ler referência ↗</strong>`;

      card.append(cardTop, title, meta, description, tags, footer);
      researchGrid.appendChild(card);
    });

    researchTotal.textContent = `${visibleItems.length} referências`;
  };

  researchFilters.forEach((button) => {
    button.addEventListener('click', () => {
      researchFilters.forEach((filter) => {
        const isActive = filter === button;
        filter.classList.toggle('active', isActive);
        filter.setAttribute('aria-pressed', String(isActive));
      });
      renderResearch(button.dataset.researchFilter);
    });
  });

  renderResearch();
} else if (researchRoot) {
  researchRoot.hidden = true;
  document.querySelector('.subject-side-nav a[href="#research"]')?.setAttribute('hidden', '');
}

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
