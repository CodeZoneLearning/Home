const PROGRESS_KEY = 'code-zone-progress:machine-learning-v2';

const scatterPoints = [
  { x: 12, y: 18, group: 'a' }, { x: 18, y: 28, group: 'a' },
  { x: 25, y: 20, group: 'a' }, { x: 29, y: 34, group: 'a' },
  { x: 17, y: 41, group: 'a' }, { x: 34, y: 24, group: 'a' },
  { x: 26, y: 46, group: 'a' }, { x: 38, y: 38, group: 'a' },
  { x: 58, y: 16, group: 'b' }, { x: 66, y: 24, group: 'b' },
  { x: 73, y: 18, group: 'b' }, { x: 82, y: 29, group: 'b' },
  { x: 61, y: 36, group: 'b' }, { x: 76, y: 42, group: 'b' },
  { x: 88, y: 38, group: 'b' }, { x: 69, y: 49, group: 'b' },
  { x: 33, y: 68, group: 'c' }, { x: 42, y: 76, group: 'c' },
  { x: 51, y: 67, group: 'c' }, { x: 59, y: 79, group: 'c' },
  { x: 45, y: 88, group: 'c' }, { x: 67, y: 72, group: 'c' },
  { x: 56, y: 91, group: 'c' }, { x: 74, y: 86, group: 'c' }
];

const scatterPlot = document.querySelector('[data-scatter-plot]');
const labStatus = document.querySelector('[data-lab-status]');

scatterPoints.forEach((point) => {
  const element = document.createElement('i');
  element.className = `scatter-point group-${point.group}`;
  element.style.left = `${point.x}%`;
  element.style.bottom = `${point.y}%`;
  element.setAttribute('aria-hidden', 'true');
  scatterPlot?.appendChild(element);
});

const setPlotMode = (mode) => {
  scatterPlot?.classList.remove('supervised', 'unsupervised');
  scatterPlot?.classList.add(mode);
  document.querySelectorAll('[data-plot-mode]').forEach((button) => {
    const selected = button.dataset.plotMode === mode;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  if (labStatus) {
    labStatus.textContent = mode === 'supervised'
      ? 'Classes conhecidas orientam o treinamento.'
      : 'Os grupos são inferidos por similaridade, sem classes fornecidas.';
  }
};

document.querySelectorAll('[data-plot-mode]').forEach((button) => {
  button.addEventListener('click', () => setPlotMode(button.dataset.plotMode));
});
setPlotMode('supervised');

const scenarioCards = [...document.querySelectorAll('[data-scenario-answer]')];
const scoreCorrect = document.querySelector('[data-score-correct]');
const scoreMessage = document.querySelector('[data-score-message]');

const updateScore = () => {
  const answered = scenarioCards.filter((card) => card.dataset.resolved).length;
  const correct = scenarioCards.filter((card) => card.dataset.resolved === 'correct').length;
  if (scoreCorrect) scoreCorrect.textContent = correct;
  if (!scoreMessage) return;
  if (answered < scenarioCards.length) {
    scoreMessage.textContent = `${answered}/3 cenários respondidos.`;
  } else if (correct === scenarioCards.length) {
    scoreMessage.textContent = 'Você identificou corretamente os três paradigmas.';
  } else {
    scoreMessage.textContent = 'Revise os cenários incorretos procurando a existência do target.';
  }
};

scenarioCards.forEach((card) => {
  const feedback = card.querySelector('.scenario-feedback');
  card.querySelectorAll('[data-scenario-choice]').forEach((button) => {
    button.addEventListener('click', () => {
      const correct = button.dataset.scenarioChoice === card.dataset.scenarioAnswer;
      card.dataset.resolved = correct ? 'correct' : 'wrong';
      card.classList.toggle('is-correct', correct);
      card.classList.toggle('is-wrong', !correct);
      card.querySelectorAll('[data-scenario-choice]').forEach((choice) => {
        choice.classList.toggle('selected', choice === button);
        choice.setAttribute('aria-pressed', String(choice === button));
      });
      if (feedback) {
        feedback.textContent = correct
          ? card.dataset.scenarioAnswer === 'supervised'
            ? 'Correto. Existe uma resposta histórica conhecida para orientar o treino.'
            : 'Correto. Não existe target confiável; queremos descobrir estrutura nos dados.'
          : 'Revise o cenário: procure uma resposta histórica conhecida que possa funcionar como target.';
      }
      updateScore();
    });
  });
});

const codeFiles = {
  classification: 'classification.py',
  regression: 'regression.py',
  clustering: 'clustering.py'
};

const codeFile = document.querySelector('[data-code-file]');

const setCodeTab = (tabName) => {
  document.querySelectorAll('[data-code-tab]').forEach((button) => {
    const selected = button.dataset.codeTab === tabName;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-selected', String(selected));
  });
  document.querySelectorAll('[data-code-panel]').forEach((panel) => {
    panel.hidden = panel.dataset.codePanel !== tabName;
  });
  if (codeFile) codeFile.textContent = codeFiles[tabName];
};

document.querySelectorAll('[data-code-tab]').forEach((button) => {
  button.addEventListener('click', () => setCodeTab(button.dataset.codeTab));
});

const copyCodeButton = document.querySelector('[data-copy-active-code]');
copyCodeButton?.addEventListener('click', async () => {
  const activeCode = document.querySelector('[data-code-panel]:not([hidden])')?.textContent || '';
  try {
    await navigator.clipboard.writeText(activeCode);
    copyCodeButton.textContent = 'Código copiado';
  } catch {
    copyCodeButton.textContent = 'Selecione e copie o código';
  }
  window.setTimeout(() => { copyCodeButton.textContent = 'Copiar código'; }, 1700);
});

const completeButton = document.querySelector('[data-complete-lesson]');

const setCompleteState = (completed) => {
  if (!completeButton) return;
  completeButton.classList.toggle('is-complete', completed);
  completeButton.replaceChildren(document.createTextNode(completed ? 'Bloco concluído ' : 'Marcar bloco como concluído '));
  const icon = document.createElement('span');
  icon.textContent = '✓';
  completeButton.appendChild(icon);
};

try {
  const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY)) || [];
  setCompleteState(saved.includes('01'));
} catch {
  setCompleteState(false);
}

completeButton?.addEventListener('click', () => {
  try {
    const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY)) || [];
    const completed = new Set(saved);
    completed.add('01');
    localStorage.setItem(PROGRESS_KEY, JSON.stringify([...completed]));
  } catch {
    // The completion state remains available for the current session.
  }
  setCompleteState(true);
});
