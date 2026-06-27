const PROGRESS_KEY = 'code-zone-progress:matematica';
const MODULE_ID = '06';
const isEnglish = () => document.documentElement.lang === 'en';

const formatNumber = (value, digits = 2) => value.toLocaleString(isEnglish() ? 'en-US' : 'pt-BR', {
  minimumFractionDigits: digits,
  maximumFractionDigits: digits
});

const scalarInputs = {
  left: document.querySelector('[data-left]'),
  right: document.querySelector('[data-right]'),
  source: document.querySelector('[data-source]')
};

const plateInputs = {
  west: document.querySelector('[data-west]'),
  east: document.querySelector('[data-east]'),
  south: document.querySelector('[data-south]'),
  north: document.querySelector('[data-north]'),
  source: document.querySelector('[data-plate-source]')
};

const setText = (selector, value) => {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
};

const renderScalar = () => {
  if (!scalarInputs.left || !scalarInputs.right || !scalarInputs.source) return;
  const left = Number(scalarInputs.left.value);
  const right = Number(scalarInputs.right.value);
  const source = Number(scalarInputs.source.value);
  const h = 1;
  const A = 2 / h ** 2;
  const b = source + (left + right) / h ** 2;
  const x = b / A;

  setText('[data-left-output]', left);
  setText('[data-right-output]', right);
  setText('[data-source-output]', source);
  setText('[data-scalar-x]', formatNumber(x));
  setText('[data-scalar-equation]', `${formatNumber(A)} × x = ${formatNumber(b)}`);
};

const renderPlate = () => {
  if (!plateInputs.west || !plateInputs.east || !plateInputs.south || !plateInputs.north || !plateInputs.source) return;
  const west = Number(plateInputs.west.value);
  const east = Number(plateInputs.east.value);
  const south = Number(plateInputs.south.value);
  const north = Number(plateInputs.north.value);
  const source = Number(plateInputs.source.value);
  const h = 1;
  const A = 4 / h ** 2;
  const b = source + (west + east + south + north) / h ** 2;
  const x = b / A;

  setText('[data-west-output]', west);
  setText('[data-east-output]', east);
  setText('[data-south-output]', south);
  setText('[data-north-output]', north);
  setText('[data-plate-source-output]', source);
  setText('[data-plate-x]', formatNumber(x));
  setText('[data-plate-equation]', `${formatNumber(A)} × x = ${formatNumber(b)}`);
};

[...Object.values(scalarInputs), ...Object.values(plateInputs)].forEach((input) => {
  input?.addEventListener('input', () => {
    renderScalar();
    renderPlate();
  });
});

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
  renderScalar();
  renderPlate();
  setComplete(readProgress().has(MODULE_ID));
});

renderScalar();
renderPlate();
setComplete(readProgress().has(MODULE_ID));
