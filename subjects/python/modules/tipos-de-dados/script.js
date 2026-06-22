const PROGRESS_KEY = 'code-zone-progress:python';

const typeCatalog = [
  { id: 'list', literal: '[2, 2, 3]', mutable: ['mutável', 'mutable'], use: ['sequência que muda', 'a changing sequence'], note: ['Aceita repetição e preserva a ordem.', 'Allows duplicates and preserves order.'] },
  { id: 'tuple', literal: '(12.4, 8.7)', mutable: ['imutável', 'immutable'], use: ['registro posicional fixo', 'a fixed positional record'], note: ['Comunica que a sequência não deve mudar.', 'Communicates that the sequence should not change.'] },
  { id: 'dict', literal: '{"status": 2}', mutable: ['mutável', 'mutable'], use: ['valores nomeados por chave', 'values named by key'], note: ['Chaves únicas dão significado a cada valor.', 'Unique keys give meaning to each value.'] },
  { id: 'set', literal: '{"pump", "critical"}', mutable: ['mutável', 'mutable'], use: ['itens únicos', 'unique items'], note: ['O foco é pertencimento, não posição.', 'Membership, rather than position, is the focus.'] }
];

const isEnglish = () => document.documentElement.lang === 'en';
let activeType = 'list';
let matrixMode = 'original';
const matrix = [[68.2, 4.1, 0.32], [69.0, 4.4, 0.35]];

const renderTypes = () => {
  const shell = document.querySelector('[data-type-buttons]');
  if (!shell) return;
  shell.replaceChildren();
  typeCatalog.forEach((entry) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = entry.id;
    button.classList.toggle('active', entry.id === activeType);
    button.setAttribute('aria-pressed', String(entry.id === activeType));
    button.addEventListener('click', () => { activeType = entry.id; renderTypes(); });
    shell.appendChild(button);
  });
  const entry = typeCatalog.find((item) => item.id === activeType);
  const languageIndex = isEnglish() ? 1 : 0;
  document.querySelector('[data-type-literal]').textContent = entry.literal;
  document.querySelector('[data-type-name]').textContent = entry.id;
  document.querySelector('[data-type-mutability]').textContent = entry.mutable[languageIndex];
  document.querySelector('[data-type-use]').textContent = entry.use[languageIndex];
  document.querySelector('[data-type-note]').textContent = entry.note[languageIndex];
};

const transpose = (values) => values[0].map((_, column) => values.map((row) => row[column]));
const renderMatrix = () => {
  const output = document.querySelector('[data-matrix-output]');
  if (!output) return;
  const values = matrixMode === 'transpose'
    ? transpose(matrix)
    : matrixMode === 'row-sums'
      ? matrix.map((row) => [row.reduce((sum, value) => sum + value, 0)])
      : matrix;
  output.replaceChildren(...values.map((row) => {
    const rowElement = document.createElement('div');
    rowElement.className = 'matrix-row';
    rowElement.append(...row.map((value) => {
      const cell = document.createElement('span');
      cell.className = 'matrix-cell';
      cell.textContent = Number(value.toFixed(2));
      return cell;
    }));
    return rowElement;
  }));
  const captions = {
    original: ['2 testes × 3 sensores', '2 tests × 3 sensors'],
    transpose: ['3 sensores × 2 testes', '3 sensors × 2 tests'],
    'row-sums': ['1 soma para cada teste', '1 sum for each test']
  };
  document.querySelector('[data-matrix-caption]').textContent = captions[matrixMode][isEnglish() ? 1 : 0];
  document.querySelectorAll('[data-matrix-mode]').forEach((button) => {
    const active = button.dataset.matrixMode === matrixMode;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
};

document.querySelectorAll('[data-matrix-mode]').forEach((button) => button.addEventListener('click', () => { matrixMode = button.dataset.matrixMode; renderMatrix(); }));

const copyButton = document.querySelector('[data-copy-code]');
copyButton?.addEventListener('click', async () => {
  const code = document.querySelector('.code-workbench code')?.textContent || '';
  try { await navigator.clipboard.writeText(code); copyButton.textContent = isEnglish() ? 'Copied' : 'Copiado'; }
  catch { copyButton.textContent = isEnglish() ? 'Select and copy' : 'Selecione e copie'; }
  window.setTimeout(() => { copyButton.textContent = isEnglish() ? 'Copy code' : 'Copiar código'; }, 1600);
});

const completeButton = document.querySelector('[data-complete-lesson]');
const isComplete = () => { try { return (JSON.parse(localStorage.getItem(PROGRESS_KEY)) || []).includes('01'); } catch { return false; } };
const setComplete = (completed) => {
  if (!completeButton) return;
  completeButton.classList.toggle('is-complete', completed);
  completeButton.replaceChildren(document.createTextNode(completed ? (isEnglish() ? 'Block completed ' : 'Bloco concluído ') : (isEnglish() ? 'Mark block as complete ' : 'Marcar bloco como concluído ')));
  const icon = document.createElement('span');
  icon.textContent = '✓';
  completeButton.appendChild(icon);
};
completeButton?.addEventListener('click', () => {
  try { const values = new Set(JSON.parse(localStorage.getItem(PROGRESS_KEY)) || []); values.add('01'); localStorage.setItem(PROGRESS_KEY, JSON.stringify([...values])); } catch {}
  setComplete(true);
});
window.addEventListener('codezone:languagechange', () => { renderTypes(); renderMatrix(); setComplete(isComplete()); });
renderTypes();
renderMatrix();
setComplete(isComplete());
