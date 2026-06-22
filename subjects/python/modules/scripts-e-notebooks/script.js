const PROGRESS_KEY = 'code-zone-progress:python';
const isEnglish = () => document.documentElement.lang === 'en';

let kernelScore;
let kernelState = 'initial';
const kernelOutput = document.querySelector('[data-kernel-output]');
const renderKernel = () => {
  if (!kernelOutput) return;
  const messages = {
    initial: isEnglish() ? 'score: <not defined>' : 'score: <não definido>',
    defined: isEnglish() ? 'In [1]: score = 0.91' : 'In [1]: score = 0,91',
    missing: 'NameError: score is not defined',
    used: isEnglish() ? `In [2]: health confidence = ${kernelScore}` : `In [2]: confiança de saúde = ${kernelScore}`
  };
  kernelOutput.textContent = messages[kernelState];
};
document.querySelector('[data-cell="define"]')?.addEventListener('click', () => {
  kernelScore = 0.91;
  kernelState = 'defined';
  renderKernel();
});
document.querySelector('[data-cell="use"]')?.addEventListener('click', () => {
  kernelState = kernelScore === undefined ? 'missing' : 'used';
  renderKernel();
});
document.querySelector('[data-kernel-reset]')?.addEventListener('click', () => {
  kernelScore = undefined;
  kernelState = 'initial';
  renderKernel();
});

const scenarios = [
  { id: 'explore', label: ['Explorar uma base nova', 'Explore a new dataset'], format: '.ipynb', reason: ['Explore perguntas e registre evidências antes de estabilizar uma interface.', 'Explore questions and record evidence before stabilizing an interface.'], practices: [['Markdown', 'Restart + Run All', 'saídas mínimas'], ['Markdown', 'Restart + Run All', 'minimal outputs']] },
  { id: 'automate', label: ['Executar toda madrugada', 'Run every night'], format: '.py', reason: ['Um ponto de entrada linear é mais simples de agendar, observar, testar e repetir.', 'A linear entry point is easier to schedule, observe, test, and repeat.'], practices: [['CLI', 'logging', 'exit codes'], ['CLI', 'logging', 'exit codes']] },
  { id: 'research', label: ['Entregar análise auditável', 'Deliver an auditable analysis'], format: '.ipynb + .py', reason: ['Mantenha a narrativa no notebook e extraia cálculos estáveis para funções testadas.', 'Keep the narrative in the notebook and extract stable calculations into tested functions.'], practices: [['notebook limpo', 'src/', 'tests/'], ['clean notebook', 'src/', 'tests/']] },
  { id: 'library', label: ['Criar código reutilizável', 'Create reusable code'], format: '.py', reason: ['Módulos oferecem imports, contratos e testes sem depender de estado de kernel.', 'Modules provide imports, contracts, and tests without depending on kernel state.'], practices: [['funções pequenas', 'docstrings', 'testes'], ['small functions', 'docstrings', 'tests']] }
];
let activeScenario = 'explore';
const renderScenarios = () => {
  const shell = document.querySelector('[data-scenarios]');
  if (!shell) return;
  const language = isEnglish() ? 1 : 0;
  shell.replaceChildren(...scenarios.map((scenario) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = scenario.label[language];
    button.classList.toggle('active', scenario.id === activeScenario);
    button.setAttribute('aria-pressed', String(scenario.id === activeScenario));
    button.addEventListener('click', () => { activeScenario = scenario.id; renderScenarios(); });
    return button;
  }));
  const selected = scenarios.find((scenario) => scenario.id === activeScenario);
  document.querySelector('[data-recommendation]').textContent = selected.format;
  document.querySelector('[data-reason]').textContent = selected.reason[language];
  document.querySelector('[data-practices]').replaceChildren(...selected.practices[language].map((practice) => {
    const tag = document.createElement('span');
    tag.textContent = practice;
    return tag;
  }));
};

const copyButton = document.querySelector('[data-copy-code]');
copyButton?.addEventListener('click', async () => {
  const code = document.querySelector('.code-workbench code')?.textContent || '';
  try { await navigator.clipboard.writeText(code); copyButton.textContent = isEnglish() ? 'Copied' : 'Copiado'; }
  catch { copyButton.textContent = isEnglish() ? 'Select and copy' : 'Selecione e copie'; }
  window.setTimeout(() => { copyButton.textContent = isEnglish() ? 'Copy code' : 'Copiar código'; }, 1600);
});

const completeButton = document.querySelector('[data-complete-lesson]');
const isComplete = () => { try { return (JSON.parse(localStorage.getItem(PROGRESS_KEY)) || []).includes('03'); } catch { return false; } };
const setComplete = (completed) => {
  if (!completeButton) return;
  completeButton.classList.toggle('is-complete', completed);
  completeButton.replaceChildren(document.createTextNode(completed ? (isEnglish() ? 'Block completed ' : 'Bloco concluído ') : (isEnglish() ? 'Mark block as complete ' : 'Marcar bloco como concluído ')));
  const icon = document.createElement('span'); icon.textContent = '✓'; completeButton.appendChild(icon);
};
completeButton?.addEventListener('click', () => {
  try { const values = new Set(JSON.parse(localStorage.getItem(PROGRESS_KEY)) || []); values.add('03'); localStorage.setItem(PROGRESS_KEY, JSON.stringify([...values])); } catch {}
  setComplete(true);
});
window.addEventListener('codezone:languagechange', () => { renderKernel(); renderScenarios(); setComplete(isComplete()); });
renderKernel();
renderScenarios();
setComplete(isComplete());
