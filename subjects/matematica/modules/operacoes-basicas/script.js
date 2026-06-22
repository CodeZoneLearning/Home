const PROGRESS_KEY = 'code-zone-progress:matematica';
const isEnglish = () => document.documentElement.lang === 'en';

const plannedInput = document.querySelector('[data-planned]');
const downtimeInput = document.querySelector('[data-downtime]');
const formatDecimal = (value, digits = 1) => value.toLocaleString(isEnglish() ? 'en-US' : 'pt-BR', { maximumFractionDigits: digits });
const renderAvailability = () => {
  if (!plannedInput || !downtimeInput) return;
  const planned = Number(plannedInput.value);
  const downtime = Math.min(Number(downtimeInput.value), planned);
  const uptime = planned - downtime;
  const availability = (uptime / planned) * 100;
  document.querySelector('[data-planned-output]').textContent = `${planned} min`;
  document.querySelector('[data-downtime-output]').textContent = `${downtime} min`;
  document.querySelector('[data-uptime]').textContent = `${uptime} min`;
  document.querySelector('[data-availability]').textContent = `${formatDecimal(availability)}%`;
  document.querySelector('[data-availability-formula]').textContent = `(${planned} − ${downtime}) ÷ ${planned} × 100`;
};
plannedInput?.addEventListener('input', renderAvailability);
downtimeInput?.addEventListener('input', renderAvailability);

const matrix = [[0.42, 0.31, 0.18], [0.48, 0.35, 0.22], [0.87, 0.81, 0.76]];
const weights = [0.25, 0.45, 0.30];
let matrixMode = 'original';
const transpose = (values) => values[0].map((_, column) => values.map((row) => row[column]));
const dot = (left, right) => left.reduce((sum, value, index) => sum + value * right[index], 0);
const renderMatrix = () => {
  const output = document.querySelector('[data-matrix-output]');
  if (!output) return;
  const values = matrixMode === 'transpose' ? transpose(matrix) : matrixMode === 'scores' ? matrix.map((row) => [dot(row, weights)]) : matrix;
  output.replaceChildren(...values.map((row) => {
    const line = document.createElement('div'); line.className = 'matrix-row';
    line.append(...row.map((value) => { const cell = document.createElement('span'); cell.className = 'matrix-cell'; cell.textContent = formatDecimal(value, 3); return cell; }));
    return line;
  }));
  const captions = {
    original: ['3 testes × 3 sensores', '3 tests × 3 sensors'],
    transpose: ['3 sensores × 3 testes', '3 sensors × 3 tests'],
    scores: ['1 score ponderado por teste', '1 weighted score per test']
  };
  document.querySelector('[data-matrix-caption]').textContent = captions[matrixMode][isEnglish() ? 1 : 0];
  document.querySelectorAll('[data-matrix-mode]').forEach((button) => { const active = button.dataset.matrixMode === matrixMode; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); });
};
document.querySelectorAll('[data-matrix-mode]').forEach((button) => button.addEventListener('click', () => { matrixMode = button.dataset.matrixMode; renderMatrix(); }));

const copyButton = document.querySelector('[data-copy-code]');
copyButton?.addEventListener('click', async () => {
  const code = document.querySelector('.math-code code')?.textContent || '';
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
  const icon = document.createElement('span'); icon.textContent = '✓'; completeButton.appendChild(icon);
};
completeButton?.addEventListener('click', () => {
  try { const values = new Set(JSON.parse(localStorage.getItem(PROGRESS_KEY)) || []); values.add('01'); localStorage.setItem(PROGRESS_KEY, JSON.stringify([...values])); } catch {}
  setComplete(true);
});
window.addEventListener('codezone:languagechange', () => { renderAvailability(); renderMatrix(); setComplete(isComplete()); });
renderAvailability();
renderMatrix();
setComplete(isComplete());
