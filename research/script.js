const researchSource = window.codeZoneResearch || {};
const subjectLabels = {
  python: 'Python',
  matematica: 'Matemática',
  'data-analytics': 'Data Analytics',
  'engenharia-dados': 'Engenharia de Dados',
  'machine-learning': 'Machine Learning',
  genai: 'Generative AI',
  graphrag: 'GraphRAG',
  apis: 'APIs & Systems'
};
const typeLabels = { paper: 'Paper', material: 'Matéria', book: 'Livro' };

const researchItems = Object.entries(researchSource).flatMap(([subject, items]) =>
  items.map((item, index) => ({ ...item, subject, index }))
);

const searchInput = document.querySelector('[data-research-search]');
const subjectSelect = document.querySelector('[data-subject-filter]');
const typeButtons = [...document.querySelectorAll('[data-type]')];
const tagShell = document.querySelector('[data-tag-filters]');
const results = document.querySelector('[data-research-results]');
const resultsCount = document.querySelector('[data-results-count]');
const activeFilter = document.querySelector('[data-active-filter]');
const emptyState = document.querySelector('[data-research-empty]');
const resetButton = document.querySelector('[data-reset-filters]');

const urlParams = new URLSearchParams(window.location.search);
const state = {
  query: '',
  type: 'all',
  subject: urlParams.get('subject') || 'all',
  tag: 'all'
};

const normalize = (value) => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase();

Object.keys(researchSource).forEach((subject) => {
  const option = document.createElement('option');
  option.value = subject;
  option.textContent = subjectLabels[subject] || subject;
  subjectSelect.appendChild(option);
});
subjectSelect.value = researchSource[state.subject] ? state.subject : 'all';
state.subject = subjectSelect.value;

const tagCounts = researchItems.flatMap((item) => item.tags || []).reduce((counts, tag) => {
  counts[tag] = (counts[tag] || 0) + 1;
  return counts;
}, {});

Object.entries(tagCounts)
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  .forEach(([tag, count]) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.tag = tag;
    button.textContent = `${tag} ${String(count).padStart(2, '0')}`;
    button.setAttribute('aria-pressed', 'false');
    tagShell.appendChild(button);
  });

const createCard = (item, resultIndex) => {
  const card = document.createElement('a');
  card.className = 'library-card';
  card.dataset.type = item.type;
  card.href = item.url;
  card.target = '_blank';
  card.rel = 'noreferrer';

  const top = document.createElement('div');
  top.className = 'library-card-top';
  const kind = document.createElement('span');
  kind.className = 'library-kind';
  kind.textContent = typeLabels[item.type] || item.type;
  const year = document.createElement('span');
  year.textContent = item.year || '';
  top.append(kind, year);

  const subject = document.createElement('span');
  subject.className = 'library-subject';
  subject.textContent = `// ${subjectLabels[item.subject] || item.subject}`;

  const title = document.createElement('h3');
  title.textContent = item.title;
  const meta = document.createElement('p');
  meta.className = 'library-meta';
  meta.textContent = item.meta || '';
  const description = document.createElement('p');
  description.className = 'library-description';
  description.textContent = item.description || '';

  const tags = document.createElement('div');
  tags.className = 'library-tags';
  (item.tags || []).forEach((tag) => {
    const tagElement = document.createElement('span');
    tagElement.textContent = tag;
    tags.appendChild(tagElement);
  });

  const footer = document.createElement('div');
  footer.className = 'library-card-footer';
  const reference = document.createElement('span');
  reference.textContent = `REF_${String(resultIndex + 1).padStart(2, '0')}`;
  const action = document.createElement('strong');
  action.textContent = 'Abrir referência ↗';
  footer.append(reference, action);

  card.append(top, subject, title, meta, description, tags, footer);
  return card;
};

const syncUrl = () => {
  if (!window.location.protocol.startsWith('http')) return;

  const params = new URLSearchParams();
  if (state.subject !== 'all') params.set('subject', state.subject);
  if (state.type !== 'all') params.set('type', state.type);
  if (state.tag !== 'all') params.set('tag', state.tag);
  if (state.query) params.set('q', state.query);
  const query = params.toString();
  window.history.replaceState(null, '', `${window.location.pathname}${query ? `?${query}` : ''}`);
};

const render = () => {
  const query = normalize(state.query.trim());
  const filtered = researchItems.filter((item) => {
    const searchable = normalize([item.title, item.description, item.meta, item.subject, ...(item.tags || [])].join(' '));
    return (!query || searchable.includes(query))
      && (state.type === 'all' || item.type === state.type)
      && (state.subject === 'all' || item.subject === state.subject)
      && (state.tag === 'all' || (item.tags || []).includes(state.tag));
  });

  results.replaceChildren(...filtered.map(createCard));
  resultsCount.textContent = filtered.length;
  emptyState.hidden = filtered.length > 0;
  results.hidden = filtered.length === 0;

  const activeParts = [];
  if (state.subject !== 'all') activeParts.push(subjectLabels[state.subject]);
  if (state.type !== 'all') activeParts.push(typeLabels[state.type]);
  if (state.tag !== 'all') activeParts.push(`#${state.tag}`);
  activeFilter.textContent = activeParts.length ? activeParts.join(' · ') : 'ÍNDICE_COMPLETO';
  syncUrl();
};

searchInput.value = urlParams.get('q') || '';
state.query = searchInput.value;
state.type = ['paper', 'material', 'book'].includes(urlParams.get('type')) ? urlParams.get('type') : 'all';
state.tag = tagCounts[urlParams.get('tag')] ? urlParams.get('tag') : 'all';

typeButtons.forEach((button) => {
  const isActive = button.dataset.type === state.type;
  button.classList.toggle('active', isActive);
  button.setAttribute('aria-pressed', String(isActive));
  button.addEventListener('click', () => {
    state.type = button.dataset.type;
    typeButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    render();
  });
});

tagShell.querySelectorAll('[data-tag]').forEach((button) => {
  const isActive = button.dataset.tag === state.tag;
  button.classList.toggle('active', isActive);
  button.setAttribute('aria-pressed', String(isActive));
  button.addEventListener('click', () => {
    state.tag = state.tag === button.dataset.tag ? 'all' : button.dataset.tag;
    tagShell.querySelectorAll('[data-tag]').forEach((item) => {
      const active = item.dataset.tag === state.tag;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    render();
  });
});

searchInput.addEventListener('input', () => { state.query = searchInput.value; render(); });
searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') { searchInput.value = ''; state.query = ''; render(); searchInput.blur(); }
});
subjectSelect.addEventListener('change', () => { state.subject = subjectSelect.value; render(); });
resetButton.addEventListener('click', () => {
  state.query = ''; state.type = 'all'; state.subject = 'all'; state.tag = 'all';
  searchInput.value = ''; subjectSelect.value = 'all';
  typeButtons.forEach((button) => { const active = button.dataset.type === 'all'; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); });
  tagShell.querySelectorAll('[data-tag]').forEach((button) => { button.classList.remove('active'); button.setAttribute('aria-pressed', 'false'); });
  render();
});

document.querySelector('[data-total-references]').textContent = researchItems.length;
render();
