const PROGRESS_KEY = 'code-zone-progress:matematica';
const MODULE_ID = '04';
const isEnglish = () => document.documentElement.lang === 'en';

const money = (value) => value.toLocaleString(isEnglish() ? 'en-US' : 'pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

const qtyInput = document.querySelector('[data-qty]');
const unitInput = document.querySelector('[data-unit]');
const fixedInput = document.querySelector('[data-fixed]');

const renderCost = () => {
  if (!qtyInput || !unitInput || !fixedInput) return;
  const qty = Number(qtyInput.value);
  const unit = Number(unitInput.value);
  const fixed = Number(fixedInput.value);
  const total = fixed + qty * unit;
  document.querySelector('[data-qty-output]').textContent = qty;
  document.querySelector('[data-unit-output]').textContent = money(unit);
  document.querySelector('[data-fixed-output]').textContent = money(fixed);
  document.querySelector('[data-total-cost]').textContent = money(total);
  document.querySelector('[data-cost-formula]').textContent = `${money(fixed)} + ${qty} × ${money(unit)}`;
};

[qtyInput, unitInput, fixedInput].forEach((input) => input?.addEventListener('input', renderCost));

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
  renderCost();
  setComplete(readProgress().has(MODULE_ID));
});

renderCost();
setComplete(readProgress().has(MODULE_ID));
