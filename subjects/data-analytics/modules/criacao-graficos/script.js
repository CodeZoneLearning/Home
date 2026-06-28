const DATA_PATH = 'data/learning_activity.csv';
const SUMMARY_PATH = 'outputs/chart_summary.csv';
const PROGRESS_KEY = 'code-zone-progress:data-analytics';

const parseCsv = (source) => {
  const rows = [];
  let row = [];
  let value = '';
  let quoted = false;

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    const nextCharacter = source[index + 1];

    if (character === '"' && quoted && nextCharacter === '"') {
      value += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === ',' && !quoted) {
      row.push(value);
      value = '';
    } else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && nextCharacter === '\n') index += 1;
      row.push(value);
      if (row.some((cell) => cell !== '')) rows.push(row);
      row = [];
      value = '';
    } else {
      value += character;
    }
  }

  if (value || row.length) {
    row.push(value);
    rows.push(row);
  }

  const [headers, ...records] = rows;
  return records.map((record) => Object.fromEntries(headers.map((header, index) => [header, record[index]])));
};

const createCell = (value) => {
  const cell = document.createElement('td');
  cell.textContent = value;
  return cell;
};

const renderPreview = (records) => {
  const body = document.querySelector('[data-preview-body]');
  if (!body) return;
  body.replaceChildren();

  records.slice(0, 8).forEach((record) => {
    const row = document.createElement('tr');
    row.append(
      createCell(record.week),
      createCell(record.learner_id),
      createCell(record.track),
      createCell(Number(record.study_hours).toFixed(2)),
      createCell(record.practice_tasks),
      createCell(`${Math.round(Number(record.completion_rate) * 100)}%`),
      createCell(Number(record.challenge_score).toFixed(1)),
      createCell(Number(record.satisfaction).toFixed(2))
    );
    body.appendChild(row);
  });
};

const renderSummary = (records) => {
  const body = document.querySelector('[data-summary-body]');
  if (!body) return;
  body.replaceChildren();

  records.forEach((record) => {
    const row = document.createElement('tr');
    row.append(
      createCell(record.track),
      createCell(record.learners),
      createCell(Number(record.mean_study_hours).toFixed(2)),
      createCell(`${(Number(record.mean_completion_rate) * 100).toFixed(1)}%`),
      createCell(Number(record.mean_challenge_score).toFixed(1)),
      createCell(Number(record.mean_satisfaction).toFixed(2))
    );
    body.appendChild(row);
  });
};

const updateMetrics = (records) => {
  const values = {
    rows: records.length,
    tracks: new Set(records.map((record) => record.track)).size,
    weeks: new Set(records.map((record) => record.week)).size,
    outputs: 5
  };

  Object.entries(values).forEach(([metric, value]) => {
    const element = document.querySelector(`[data-metric="${metric}"]`);
    if (element) element.textContent = value;
  });
};

const loadLessonData = async () => {
  try {
    const [dataResponse, summaryResponse] = await Promise.all([fetch(DATA_PATH), fetch(SUMMARY_PATH)]);
    if (!dataResponse.ok || !summaryResponse.ok) throw new Error('Lesson data could not be loaded.');

    const [dataSource, summarySource] = await Promise.all([dataResponse.text(), summaryResponse.text()]);
    const records = parseCsv(dataSource);
    const summary = parseCsv(summarySource);

    updateMetrics(records);
    renderPreview(records);
    renderSummary(summary);
  } catch (error) {
    document.body.classList.add('data-load-error');
    console.error(error);
  }
};

document.querySelectorAll('[data-copy-code]').forEach((button) => {
  button.addEventListener('click', async () => {
    const code = button.closest('.code-card')?.querySelector('code')?.textContent || '';
    try {
      await navigator.clipboard.writeText(code);
      button.textContent = 'Copiado';
      window.setTimeout(() => { button.textContent = 'Copiar'; }, 1600);
    } catch {
      button.textContent = 'Selecione';
    }
  });
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
  setCompleteState(saved.includes('02'));
} catch {
  setCompleteState(false);
}

completeButton?.addEventListener('click', () => {
  try {
    const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY)) || [];
    const completed = new Set(saved);
    completed.add('02');
    localStorage.setItem(PROGRESS_KEY, JSON.stringify([...completed]));
  } catch {
    // The completion state still updates for the current session.
  }
  setCompleteState(true);
});

loadLessonData();
