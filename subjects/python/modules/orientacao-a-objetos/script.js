const PROGRESS_KEY = 'code-zone-progress:python';
const initialTests = [{ status: 2, confidence: 0.91 }, { status: 2, confidence: 0.88 }, { status: 3, confidence: 0.62 }];
let tests = initialTests.map((test) => ({ ...test }));

const isEnglish = () => document.documentElement.lang === 'en';
const formatConfidence = (value) => new Intl.NumberFormat(isEnglish() ? 'en-US' : 'pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);

const inferredStatus = () => {
  if (!tests.length) return null;
  const counts = tests.reduce((result, test) => ({ ...result, [test.status]: (result[test.status] || 0) + 1 }), {});
  const maximum = Math.max(...Object.values(counts));
  const candidates = new Set(Object.entries(counts).filter(([, count]) => count === maximum).map(([status]) => Number(status)));
  return [...tests].reverse().find((test) => candidates.has(test.status)).status;
};

const renderObject = () => {
  const status = inferredStatus();
  const mean = tests.length ? tests.reduce((sum, test) => sum + test.confidence, 0) / tests.length : null;
  const consistent = tests.length > 0 && new Set(tests.map((test) => test.status)).size === 1;
  document.querySelector('[data-test-count]').textContent = tests.length;
  document.querySelector('[data-inferred-status]').textContent = status ?? '—';
  document.querySelector('[data-mean-confidence]').textContent = mean === null ? '—' : formatConfidence(mean);
  document.querySelector('[data-consistent]').textContent = isEnglish() ? (consistent ? 'yes' : 'no') : (consistent ? 'sim' : 'não');

  const stack = document.querySelector('[data-test-stack]');
  stack.replaceChildren(...tests.map((test, index) => {
    const row = document.createElement('div');
    row.className = 'test-result';
    const labels = [
      `test_${String(index + 1).padStart(2, '0')}`,
      `status=${test.status}`,
      `confidence=${formatConfidence(test.confidence)}`
    ];
    labels.forEach((label) => { const item = document.createElement('span'); item.textContent = label; row.appendChild(item); });
    return row;
  }));

  const message = document.querySelector('[data-object-message]');
  if (!tests.length) message.textContent = isEnglish() ? 'The object has no test results yet.' : 'O objeto ainda não possui resultados de teste.';
  else if (consistent) message.textContent = isEnglish() ? `All tests point to class ${status}.` : `Todos os testes apontam para a classe ${status}.`;
  else message.textContent = isEnglish() ? `Class ${status} appears most often; inspect the disagreement.` : `A classe ${status} aparece mais vezes; investigue a divergência.`;
};

const confidenceControl = document.querySelector('[data-confidence]');
const confidenceOutput = document.querySelector('[data-confidence-output]');
const updateConfidence = () => { confidenceOutput.textContent = formatConfidence(Number(confidenceControl.value) / 100); };
confidenceControl?.addEventListener('input', updateConfidence);

document.querySelector('[data-add-test]')?.addEventListener('click', () => {
  tests.push({ status: Number(document.querySelector('[data-health-status]').value), confidence: Number(confidenceControl.value) / 100 });
  renderObject();
});
document.querySelector('[data-reset-object]')?.addEventListener('click', () => { tests = initialTests.map((test) => ({ ...test })); renderObject(); });

const copyButton = document.querySelector('[data-copy-code]');
copyButton?.addEventListener('click', async () => {
  const code = document.querySelector('.code-workbench code')?.textContent || '';
  try { await navigator.clipboard.writeText(code); copyButton.textContent = isEnglish() ? 'Copied' : 'Copiado'; }
  catch { copyButton.textContent = isEnglish() ? 'Select and copy' : 'Selecione e copie'; }
  window.setTimeout(() => { copyButton.textContent = isEnglish() ? 'Copy code' : 'Copiar código'; }, 1600);
});

const completeButton = document.querySelector('[data-complete-lesson]');
const isComplete = () => { try { return (JSON.parse(localStorage.getItem(PROGRESS_KEY)) || []).includes('02'); } catch { return false; } };
const setComplete = (completed) => {
  if (!completeButton) return;
  completeButton.classList.toggle('is-complete', completed);
  completeButton.replaceChildren(document.createTextNode(completed ? (isEnglish() ? 'Block completed ' : 'Bloco concluído ') : (isEnglish() ? 'Mark block as complete ' : 'Marcar bloco como concluído ')));
  const icon = document.createElement('span'); icon.textContent = '✓'; completeButton.appendChild(icon);
};
completeButton?.addEventListener('click', () => {
  try { const values = new Set(JSON.parse(localStorage.getItem(PROGRESS_KEY)) || []); values.add('02'); localStorage.setItem(PROGRESS_KEY, JSON.stringify([...values])); } catch {}
  setComplete(true);
});
window.addEventListener('codezone:languagechange', () => { updateConfidence(); renderObject(); setComplete(isComplete()); });
updateConfidence();
renderObject();
setComplete(isComplete());
