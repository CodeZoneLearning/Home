const PROGRESS_KEY = 'code-zone-progress:matematica';
const isEnglish = () => document.documentElement.lang === 'en';
const baseline = [68.1, 68.4, 68.7, 69.0, 69.2, 69.4, 69.7];
let includeOutlier = false;
const format = (value, digits = 2) => value.toLocaleString(isEnglish() ? 'en-US' : 'pt-BR', { minimumFractionDigits: digits, maximumFractionDigits: digits });
const mean = (values) => values.reduce((sum, value) => sum + value, 0) / values.length;
const median = (values) => { const sorted = [...values].sort((a, b) => a - b); const middle = Math.floor(sorted.length / 2); return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2; };

const renderOutlier = () => {
  const values = includeOutlier ? [...baseline, 92] : baseline;
  const strip = document.querySelector('[data-value-strip]');
  strip?.replaceChildren(...values.map((value) => { const bar = document.createElement('i'); bar.style.height = `${Math.max(15, ((value - 60) / 32) * 100)}%`; bar.classList.toggle('outlier', value > 80); bar.title = String(value); return bar; }));
  document.querySelector('[data-stat-count]').textContent = values.length;
  document.querySelector('[data-stat-mean]').textContent = format(mean(values));
  document.querySelector('[data-stat-median]').textContent = format(median(values));
  document.querySelector('[data-stat-range]').textContent = format(Math.max(...values) - Math.min(...values));
  document.querySelector('[data-outlier-message]').textContent = includeOutlier
    ? (isEnglish() ? 'The mean moves strongly; the median remains close to the original center.' : 'A média se desloca fortemente; a mediana permanece perto do centro original.')
    : (isEnglish() ? 'The mean and median describe a similar center.' : 'A média e a mediana descrevem um centro parecido.');
  document.querySelectorAll('[data-outlier]').forEach((button) => { const active = (button.dataset.outlier === 'with') === includeOutlier; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); });
};
document.querySelectorAll('[data-outlier]').forEach((button) => button.addEventListener('click', () => { includeOutlier = button.dataset.outlier === 'with'; renderOutlier(); }));

const temperatures = [68.2, 68.8, 70.1, 69.5, 72.3, 71.8, 67.9, 69.6, 74.1, 70.4, 68.7, 73.2];
const createSeededRandom = () => { let state = 2026; return () => { state = (state * 1664525 + 1013904223) % 4294967296; return state / 4294967296; }; };
const percentile = (values, probability) => { const sorted = [...values].sort((a, b) => a - b); return sorted[Math.floor((sorted.length - 1) * probability)]; };
document.querySelector('[data-bootstrap-run]')?.addEventListener('click', () => {
  const seededRandom = createSeededRandom();
  const estimates = Array.from({ length: 1000 }, () => mean(Array.from({ length: temperatures.length }, () => temperatures[Math.floor(seededRandom() * temperatures.length)])));
  const center = mean(temperatures); const low = percentile(estimates, 0.025); const high = percentile(estimates, 0.975);
  document.querySelector('[data-bootstrap-mean]').textContent = `${format(center)} °C`;
  document.querySelector('[data-bootstrap-interval]').textContent = isEnglish() ? `Empirical 95% CI: ${format(low)} to ${format(high)} °C` : `IC empírico de 95%: ${format(low)} a ${format(high)} °C`;
  document.querySelector('[data-bootstrap-bar]').style.width = '78%';
});

const copyButton = document.querySelector('[data-copy-code]');
copyButton?.addEventListener('click', async () => { const code = document.querySelector('.math-code code')?.textContent || ''; try { await navigator.clipboard.writeText(code); copyButton.textContent = isEnglish() ? 'Copied' : 'Copiado'; } catch { copyButton.textContent = isEnglish() ? 'Select and copy' : 'Selecione e copie'; } window.setTimeout(() => { copyButton.textContent = isEnglish() ? 'Copy code' : 'Copiar código'; }, 1600); });
const completeButton = document.querySelector('[data-complete-lesson]');
const isComplete = () => { try { return (JSON.parse(localStorage.getItem(PROGRESS_KEY)) || []).includes('02'); } catch { return false; } };
const setComplete = (completed) => { if (!completeButton) return; completeButton.classList.toggle('is-complete', completed); completeButton.replaceChildren(document.createTextNode(completed ? (isEnglish() ? 'Block completed ' : 'Bloco concluído ') : (isEnglish() ? 'Mark block as complete ' : 'Marcar bloco como concluído '))); const icon = document.createElement('span'); icon.textContent = '✓'; completeButton.appendChild(icon); };
completeButton?.addEventListener('click', () => { try { const values = new Set(JSON.parse(localStorage.getItem(PROGRESS_KEY)) || []); values.add('02'); localStorage.setItem(PROGRESS_KEY, JSON.stringify([...values])); } catch {} setComplete(true); });
window.addEventListener('codezone:languagechange', () => { renderOutlier(); setComplete(isComplete()); });
renderOutlier(); setComplete(isComplete());
