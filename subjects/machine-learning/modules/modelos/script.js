const DATA_PATH = 'outputs/model_results.json';
const PROGRESS_KEY = 'code-zone-progress:machine-learning-v2';

let modelData;
let activeDepth = '2';

const isEnglish = () => document.documentElement.lang === 'en';
const locale = () => isEnglish() ? 'en-US' : 'pt-BR';
const formatPercent = (value) => new Intl.NumberFormat(locale(), {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1
}).format(value);
const formatGap = (value) => `${new Intl.NumberFormat(locale(), {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
  signDisplay: 'exceptZero'
}).format(value * 100)} pp`;

const translations = {
  pt: {
    unlimited: 'sem limite',
    yes: 'sim',
    no: 'não',
    high: 'alta',
    medium: 'média',
    low: 'baixa',
    linear: 'linear',
    distance: 'distância',
    tree: 'árvore',
    ensemble: 'ensemble',
    kernel: 'kernel',
    best: 'melhor validação',
    underfit: 'UNDERFITTING',
    balanced: 'EQUILÍBRIO',
    watch: 'ATENÇÃO AO GAP',
    overfit: 'OVERFITTING',
    depthOne: 'A árvore é simples demais: treino e validação ficam limitados por alto viés.',
    depthBalanced: 'A árvore captura a estrutura sem abrir regras demais.',
    depthWatch: 'O treino continua subindo, mas a validação não acompanha na mesma proporção.',
    depthOverfit: 'A árvore memoriza o treino: a validação recua e o gap aumenta.',
    completed: 'Bloco concluído ',
    markComplete: 'Marcar bloco como concluído '
  },
  en: {
    unlimited: 'unlimited',
    yes: 'yes',
    no: 'no',
    high: 'high',
    medium: 'medium',
    low: 'low',
    linear: 'linear',
    distance: 'distance',
    tree: 'tree',
    ensemble: 'ensemble',
    kernel: 'kernel',
    best: 'best validation',
    underfit: 'UNDERFITTING',
    balanced: 'BALANCED',
    watch: 'WATCH THE GAP',
    overfit: 'OVERFITTING',
    depthOne: 'The tree is too simple: high bias limits both training and validation.',
    depthBalanced: 'The tree captures the structure without creating too many rules.',
    depthWatch: 'Training keeps improving, but validation does not follow at the same rate.',
    depthOverfit: 'The tree memorizes training data: validation declines and the gap grows.',
    completed: 'Block completed ',
    markComplete: 'Mark block as complete '
  }
};

const copy = () => isEnglish() ? translations.en : translations.pt;
const depthKey = (value) => String(value);

const getDepthReading = (depth) => {
  const value = depthKey(depth.max_depth);
  if (value === '1') return { label: copy().underfit, analysis: copy().depthOne };
  if (value === '2' || value === '4') return { label: copy().balanced, analysis: copy().depthBalanced };
  if (value === '8') return { label: copy().watch, analysis: copy().depthWatch };
  return { label: copy().overfit, analysis: copy().depthOverfit };
};

const renderComplexity = () => {
  const candidates = modelData?.tree_complexity || [];
  const selected = candidates.find((candidate) => depthKey(candidate.max_depth) === activeDepth);
  if (!selected) return;

  const controls = document.querySelector('[data-depth-controls]');
  if (controls) {
    controls.replaceChildren();
    candidates.forEach((candidate) => {
      const key = depthKey(candidate.max_depth);
      const button = document.createElement('button');
      const active = key === activeDepth;
      button.type = 'button';
      button.textContent = key === 'unlimited' ? copy().unlimited : key;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
      button.addEventListener('click', () => {
        activeDepth = key;
        renderComplexity();
      });
      controls.appendChild(button);
    });
  }

  const label = document.querySelector('[data-fit-label]');
  const depthValue = document.querySelector('[data-depth-value]');
  const leafCount = document.querySelector('[data-leaf-count]');
  const gapValue = document.querySelector('[data-gap-value]');
  const analysis = document.querySelector('[data-complexity-analysis]');
  const reading = getDepthReading(selected);
  const gap = selected.train_accuracy - selected.validation_accuracy;

  if (label) label.textContent = reading.label;
  if (depthValue) depthValue.textContent = activeDepth === 'unlimited' ? '∞' : activeDepth;
  if (leafCount) leafCount.textContent = selected.leaves;
  if (gapValue) gapValue.textContent = formatGap(gap);
  if (analysis) analysis.textContent = reading.analysis;

  ['train', 'validation'].forEach((split) => {
    const value = selected[`${split}_accuracy`];
    const bar = document.querySelector(`[data-score-bar="${split}"]`);
    const output = document.querySelector(`[data-score-value="${split}"]`);
    if (bar) bar.style.width = `${Math.max(2, value * 100)}%`;
    if (output) output.textContent = formatPercent(value);
  });
};

const renderModelTable = () => {
  const families = modelData?.families || [];
  const container = document.querySelector('[data-model-results]');
  if (!container || !families.length) return;
  const bestScore = Math.max(...families.map((model) => model.validation_accuracy));
  container.replaceChildren();

  families.forEach((model) => {
    const row = document.createElement('div');
    const best = model.validation_accuracy === bestScore;
    row.className = 'model-row';
    row.classList.toggle('best', best);

    const values = [
      model.name,
      copy()[model.family] || model.family,
      model.scaling ? copy().yes : copy().no,
      model.nonlinear ? copy().yes : copy().no,
      copy()[model.interpretability] || model.interpretability,
      formatPercent(model.validation_accuracy),
      formatGap(model.generalization_gap)
    ];

    values.forEach((value, index) => {
      const cell = document.createElement(index === 0 ? 'strong' : 'span');
      cell.textContent = value;
      if (best && index === 5) cell.title = copy().best;
      row.appendChild(cell);
    });
    container.appendChild(row);
  });
};

const renderAll = () => {
  if (!modelData) return;
  renderComplexity();
  renderModelTable();
};

const loadModels = async () => {
  try {
    const response = await fetch(DATA_PATH);
    if (!response.ok) throw new Error(`Model data returned ${response.status}.`);
    modelData = await response.json();
    renderAll();
  } catch (error) {
    document.body.classList.add('models-load-error');
    console.error(error);
  }
};

const completeButton = document.querySelector('[data-complete-lesson]');

const setCompleteState = (completed) => {
  if (!completeButton) return;
  completeButton.classList.toggle('is-complete', completed);
  completeButton.replaceChildren(document.createTextNode(completed ? copy().completed : copy().markComplete));
  const icon = document.createElement('span');
  icon.textContent = '✓';
  completeButton.appendChild(icon);
};

const isLessonComplete = () => {
  try {
    return (JSON.parse(localStorage.getItem(PROGRESS_KEY)) || []).includes('02');
  } catch {
    return false;
  }
};

setCompleteState(isLessonComplete());

completeButton?.addEventListener('click', () => {
  try {
    const completed = new Set(JSON.parse(localStorage.getItem(PROGRESS_KEY)) || []);
    completed.add('02');
    localStorage.setItem(PROGRESS_KEY, JSON.stringify([...completed]));
  } catch {
    // The completion state remains available for the current session.
  }
  setCompleteState(true);
});

window.addEventListener('codezone:languagechange', () => {
  renderAll();
  setCompleteState(isLessonComplete());
});

loadModels();
