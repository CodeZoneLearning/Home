const PROGRESS_KEY = 'code-zone-progress:mlops';
const isEnglish = () => document.documentElement.lang === 'en';
const runs = [
  { id: 'lr_c_01', model: 'LogisticRegression', recall: 0.80, precision: 0.88, f1: 0.84, roc_auc: 0.91 },
  { id: 'rf_depth_06', model: 'RandomForest', recall: 0.90, precision: 0.82, f1: 0.86, roc_auc: 0.94 },
  { id: 'gb_lr_005', model: 'GradientBoosting', recall: 0.86, precision: 0.86, f1: 0.86, roc_auc: 0.95 }
];
let primaryMetric = 'recall';
let selectedRun = 'rf_depth_06';
const renderRuns = () => {
  const sorted = [...runs].sort((left, right) => right[primaryMetric] - left[primaryMetric]);
  const shell = document.querySelector('[data-runs]');
  shell?.replaceChildren(...sorted.map((run) => {
    const row = document.createElement('div'); row.className = 'runs-row'; row.classList.toggle('selected', run.id === selectedRun); row.setAttribute('role', 'button'); row.tabIndex = 0;
    const values = [run.id, run.model, run.recall, run.precision, run.f1, run.roc_auc];
    row.append(...values.map((value, index) => { const cell = document.createElement(index < 2 ? 'strong' : 'span'); cell.textContent = typeof value === 'number' ? value.toFixed(2) : value; if (index === 2) cell.className = value >= 0.88 ? 'passes' : 'fails'; return cell; }));
    const select = () => { selectedRun = run.id; renderRuns(); };
    row.addEventListener('click', select); row.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); select(); } });
    return row;
  }));
  const selected = runs.find((run) => run.id === selectedRun);
  document.querySelector('[data-recommended-run]').textContent = selected.id;
  document.querySelector('[data-run-reason]').textContent = selected.recall >= 0.88
    ? (isEnglish() ? 'Meets the Recall gate and can proceed to the remaining validations.' : 'Atende ao gate de Recall e pode seguir para as demais validações.')
    : (isEnglish() ? 'Does not meet the minimum Recall gate and should not be promoted.' : 'Não atende ao gate mínimo de Recall e não deve ser promovido.');
};
document.querySelector('[data-primary-metric]')?.addEventListener('change', (event) => { primaryMetric = event.target.value; const eligible = runs.filter((run) => run.recall >= 0.88).sort((a, b) => b[primaryMetric] - a[primaryMetric]); selectedRun = eligible[0]?.id || runs[0].id; renderRuns(); });

const copyButton = document.querySelector('[data-copy-code]');
copyButton?.addEventListener('click', async () => { const code = document.querySelector('.ops-code code')?.textContent || ''; try { await navigator.clipboard.writeText(code); copyButton.textContent = isEnglish() ? 'Copied' : 'Copiado'; } catch { copyButton.textContent = isEnglish() ? 'Select and copy' : 'Selecione e copie'; } window.setTimeout(() => { copyButton.textContent = isEnglish() ? 'Copy code' : 'Copiar código'; }, 1600); });
const completeButton = document.querySelector('[data-complete-lesson]');
const isComplete = () => { try { return (JSON.parse(localStorage.getItem(PROGRESS_KEY)) || []).includes('01'); } catch { return false; } };
const setComplete = (completed) => { if (!completeButton) return; completeButton.classList.toggle('is-complete', completed); completeButton.replaceChildren(document.createTextNode(completed ? (isEnglish() ? 'Block completed ' : 'Bloco concluído ') : (isEnglish() ? 'Mark block as complete ' : 'Marcar bloco como concluído '))); const icon = document.createElement('span'); icon.textContent = '✓'; completeButton.appendChild(icon); };
completeButton?.addEventListener('click', () => { try { const values = new Set(JSON.parse(localStorage.getItem(PROGRESS_KEY)) || []); values.add('01'); localStorage.setItem(PROGRESS_KEY, JSON.stringify([...values])); } catch {} setComplete(true); });
window.addEventListener('codezone:languagechange', () => { renderRuns(); setComplete(isComplete()); });
renderRuns(); setComplete(isComplete());
