const PROGRESS_KEY = 'code-zone-progress:matematica';
const MODULE_ID = '05';
const isEnglish = () => document.documentElement.lang === 'en';

const fixedInput = document.querySelector('[data-fixed]');
const targetInput = document.querySelector('[data-target]');
const penaltyInput = document.querySelector('[data-penalty]');
const rateInput = document.querySelector('[data-rate]');
const startInput = document.querySelector('[data-start]');

const number = (value, digits = 2) => value.toLocaleString(isEnglish() ? 'en-US' : 'pt-BR', {
  minimumFractionDigits: digits,
  maximumFractionDigits: digits
});

const objective = (q, fixed, target, penalty) => fixed + 17.5 * q + penalty * (q - target) ** 2;
const gradient = (q, target, penalty) => 17.5 + 2 * penalty * (q - target);

const bestByGrid = (fixed, target, penalty) => {
  let bestQ = 0;
  let bestCost = objective(0, fixed, target, penalty);
  for (let q = 0; q <= 300; q += 1) {
    const cost = objective(q, fixed, target, penalty);
    if (cost < bestCost) {
      bestQ = q;
      bestCost = cost;
    }
  }
  return { q: bestQ, cost: bestCost };
};

const renderBest = () => {
  if (!fixedInput || !targetInput || !penaltyInput) return;
  const fixed = Number(fixedInput.value);
  const target = Number(targetInput.value);
  const penalty = Number(penaltyInput.value);
  const best = bestByGrid(fixed, target, penalty);
  document.querySelector('[data-fixed-output]').textContent = number(fixed, 0);
  document.querySelector('[data-target-output]').textContent = target;
  document.querySelector('[data-penalty-output]').textContent = number(penalty, 2);
  document.querySelector('[data-best-q]').textContent = best.q;
  document.querySelector('[data-best-cost]').textContent = `${isEnglish() ? 'Estimated cost' : 'Custo estimado'}: ${number(best.cost)}`;
  renderGradient();
};

const renderGradient = () => {
  if (!rateInput || !startInput || !targetInput || !penaltyInput || !fixedInput) return;
  const rate = Number(rateInput.value);
  const target = Number(targetInput.value);
  const penalty = Number(penaltyInput.value);
  const fixed = Number(fixedInput.value);
  let q = Number(startInput.value);
  for (let step = 0; step < 20; step += 1) {
    q -= rate * gradient(q, target, penalty);
  }
  const cost = objective(q, fixed, target, penalty);
  document.querySelector('[data-rate-output]').textContent = number(rate, 2);
  document.querySelector('[data-start-output]').textContent = Number(startInput.value);
  document.querySelector('[data-gradient-x]').textContent = number(q, 1);
  document.querySelector('[data-gradient-cost]').textContent = `${isEnglish() ? 'Estimated cost' : 'Custo estimado'}: ${number(cost)}`;
};

[fixedInput, targetInput, penaltyInput].forEach((input) => input?.addEventListener('input', renderBest));
[rateInput, startInput].forEach((input) => input?.addEventListener('input', renderGradient));

const copyButtons = document.querySelectorAll('[data-copy-code], [data-copy-code-secondary]');
copyButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    const code = button.closest('.math-code')?.querySelector('code')?.textContent || '';
    try {
      await navigator.clipboard.writeText(code);
      button.textContent = isEnglish() ? 'Copied' : 'Copiado';
    } catch {
      button.textContent = isEnglish() ? 'Select and copy' : 'Selecione e copie';
    }
    window.setTimeout(() => { button.textContent = isEnglish() ? 'Copy code' : 'Copiar código'; }, 1600);
  });
});

const completeButton = document.querySelector('[data-complete-lesson]');
const readProgress = () => {
  try { return new Set(JSON.parse(localStorage.getItem(PROGRESS_KEY)) || []); } catch { return new Set(); }
};
const setComplete = (completed) => {
  if (!completeButton) return;
  completeButton.classList.toggle('is-complete', completed);
  completeButton.replaceChildren(document.createTextNode(completed ? (isEnglish() ? 'Block completed ' : 'Bloco concluído ') : (isEnglish() ? 'Mark block as complete ' : 'Marcar bloco como concluído ')));
  const icon = document.createElement('span');
  icon.textContent = '✓';
  completeButton.appendChild(icon);
};
completeButton?.addEventListener('click', () => {
  const values = readProgress();
  values.add(MODULE_ID);
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify([...values])); } catch {}
  setComplete(true);
});

window.addEventListener('codezone:languagechange', () => {
  renderBest();
  setComplete(readProgress().has(MODULE_ID));
});

renderBest();
setComplete(readProgress().has(MODULE_ID));
