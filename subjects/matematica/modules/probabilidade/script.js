const PROGRESS_KEY = 'code-zone-progress:matematica';
const isEnglish = () => document.documentElement.lang === 'en';
const locale = () => isEnglish() ? 'en-US' : 'pt-BR';
const percentage = (value, digits = 1) => `${(value * 100).toLocaleString(locale(), { maximumFractionDigits: digits })}%`;

const prevalenceInput = document.querySelector('[data-prevalence]');
const sensitivityInput = document.querySelector('[data-sensitivity]');
const fprInput = document.querySelector('[data-fpr]');
const renderBayes = () => {
  const prevalence = Number(prevalenceInput.value) / 100;
  const sensitivity = Number(sensitivityInput.value) / 100;
  const fpr = Number(fprInput.value) / 100;
  const failures = Math.round(1000 * prevalence);
  const healthy = 1000 - failures;
  const tp = Math.round(failures * sensitivity);
  const fn = failures - tp;
  const fp = Math.round(healthy * fpr);
  const tn = healthy - fp;
  const posterior = tp / (tp + fp);
  document.querySelector('[data-prevalence-output]').textContent = percentage(prevalence, 0);
  document.querySelector('[data-sensitivity-output]').textContent = percentage(sensitivity, 0);
  document.querySelector('[data-fpr-output]').textContent = percentage(fpr, 0);
  document.querySelector('[data-tp]').textContent = tp;
  document.querySelector('[data-fn]').textContent = fn;
  document.querySelector('[data-fp]').textContent = fp;
  document.querySelector('[data-tn]').textContent = tn;
  document.querySelector('[data-posterior]').textContent = percentage(posterior);
  const rounded = Math.round(posterior * 100);
  document.querySelector('[data-bayes-reading]').textContent = isEnglish() ? `Among alerts, approximately ${rounded} in 100 indicate a real failure.` : `Entre os alertas, aproximadamente ${rounded} em cada 100 indicam falha real.`;
};
[prevalenceInput, sensitivityInput, fprInput].forEach((input) => input?.addEventListener('input', renderBayes));

const predictions = [[0.05,0],[0.10,0],[0.12,0],[0.18,0],[0.22,0],[0.27,1],[0.31,0],[0.38,0],[0.42,1],[0.48,0],[0.52,1],[0.57,0],[0.61,1],[0.66,1],[0.71,0],[0.76,1],[0.81,1],[0.86,1],[0.91,1],[0.96,1]];
const thresholdInput = document.querySelector('[data-threshold]');
const renderThreshold = () => {
  const threshold = Number(thresholdInput.value) / 100;
  let tp = 0, fp = 0, fn = 0, tn = 0;
  predictions.forEach(([probability, outcome]) => { const predicted = probability >= threshold; if (predicted && outcome) tp += 1; else if (predicted) fp += 1; else if (outcome) fn += 1; else tn += 1; });
  document.querySelector('[data-threshold-output]').textContent = threshold.toLocaleString(locale(), { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  document.querySelector('[data-threshold-tp]').textContent = tp; document.querySelector('[data-threshold-fp]').textContent = fp; document.querySelector('[data-threshold-fn]').textContent = fn; document.querySelector('[data-threshold-tn]').textContent = tn;
  document.querySelector('[data-threshold-precision]').textContent = percentage(tp / (tp + fp || 1));
  document.querySelector('[data-threshold-recall]').textContent = percentage(tp / (tp + fn || 1));
  document.querySelector('[data-probability-strip]')?.replaceChildren(...predictions.map(([probability, outcome]) => { const bar = document.createElement('i'); bar.style.height = `${probability * 100}%`; bar.classList.toggle('predicted', probability >= threshold); bar.classList.toggle('positive', Boolean(outcome)); bar.title = `${probability} / ${outcome}`; return bar; }));
};
thresholdInput?.addEventListener('input', renderThreshold);

const copyButton = document.querySelector('[data-copy-code]');
copyButton?.addEventListener('click', async () => { const code = document.querySelector('.math-code code')?.textContent || ''; try { await navigator.clipboard.writeText(code); copyButton.textContent = isEnglish() ? 'Copied' : 'Copiado'; } catch { copyButton.textContent = isEnglish() ? 'Select and copy' : 'Selecione e copie'; } window.setTimeout(() => { copyButton.textContent = isEnglish() ? 'Copy code' : 'Copiar código'; }, 1600); });
const completeButton = document.querySelector('[data-complete-lesson]');
const isComplete = () => { try { return (JSON.parse(localStorage.getItem(PROGRESS_KEY)) || []).includes('03'); } catch { return false; } };
const setComplete = (completed) => { if (!completeButton) return; completeButton.classList.toggle('is-complete', completed); completeButton.replaceChildren(document.createTextNode(completed ? (isEnglish() ? 'Block completed ' : 'Bloco concluído ') : (isEnglish() ? 'Mark block as complete ' : 'Marcar bloco como concluído '))); const icon = document.createElement('span'); icon.textContent = '✓'; completeButton.appendChild(icon); };
completeButton?.addEventListener('click', () => { try { const values = new Set(JSON.parse(localStorage.getItem(PROGRESS_KEY)) || []); values.add('03'); localStorage.setItem(PROGRESS_KEY, JSON.stringify([...values])); } catch {} setComplete(true); });
window.addEventListener('codezone:languagechange', () => { renderBayes(); renderThreshold(); setComplete(isComplete()); });
renderBayes(); renderThreshold(); setComplete(isComplete());
