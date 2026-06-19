const DATA_PATH = 'data/equipment_health_tests.csv';
const INFERENCE_PATH = 'outputs/confidence_inference.csv';
const PROGRESS_KEY = 'code-zone-progress:data-analytics';
const STATUS_LABELS = { 1: 'Healthy', 2: 'Attention', 3: 'Degraded', 4: 'Critical' };

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

const createCell = (value, className = '') => {
  const cell = document.createElement('td');
  if (className) {
    const pill = document.createElement('span');
    pill.className = className;
    pill.textContent = value;
    cell.appendChild(pill);
  } else {
    cell.textContent = value;
  }
  return cell;
};

const renderPreview = (records) => {
  const body = document.querySelector('[data-preview-body]');
  if (!body) return;
  body.replaceChildren();

  records.slice(0, 7).forEach((record) => {
    const row = document.createElement('tr');
    row.append(
      createCell(record.test_id),
      createCell(record.equipment_id),
      createCell(record.site),
      createCell(record.equipment_type),
      createCell(record.temperature_c),
      createCell(record.vibration_mm_s),
      createCell(`${record.health_status} · ${STATUS_LABELS[record.health_status]}`, 'status-pill'),
      createCell(Number(record.confidence_score).toFixed(3))
    );
    body.appendChild(row);
  });
};

const summarizeEquipment = (records) => {
  const groups = new Map();
  records.forEach((record) => {
    const group = groups.get(record.equipment_id) || [];
    group.push(record);
    groups.set(record.equipment_id, group);
  });

  return [...groups.entries()].map(([equipmentId, tests]) => {
    const counts = tests.reduce((result, test) => {
      result[test.health_status] = (result[test.health_status] || 0) + 1;
      return result;
    }, {});
    const rankedStatuses = Object.entries(counts).sort((left, right) => right[1] - left[1] || Number(left[0]) - Number(right[0]));
    const [dominantStatus, dominantCount] = rankedStatuses[0];
    const agreementRate = dominantCount / tests.length;
    const uniqueStatuses = Object.keys(counts).length;
    const result = uniqueStatuses === 1
      ? 'CONSISTENT'
      : agreementRate >= 0.75 ? 'MOSTLY_CONSISTENT' : 'INCONSISTENT';

    return { equipmentId, tests: tests.length, uniqueStatuses, dominantStatus, agreementRate, result };
  }).sort((left, right) => left.equipmentId.localeCompare(right.equipmentId));
};

const resultLabels = {
  CONSISTENT: 'Consistente',
  MOSTLY_CONSISTENT: 'Maioria estável',
  INCONSISTENT: 'Inconsistente'
};

const renderResults = (summaries, filter = 'ALL') => {
  const body = document.querySelector('[data-result-body]');
  if (!body) return;
  body.replaceChildren();

  summaries
    .filter((summary) => filter === 'ALL' || summary.result === filter)
    .forEach((summary) => {
      const row = document.createElement('tr');
      row.append(
        createCell(summary.equipmentId),
        createCell(summary.tests),
        createCell(summary.uniqueStatuses),
        createCell(`${summary.dominantStatus} · ${STATUS_LABELS[summary.dominantStatus]}`),
        createCell(`${Math.round(summary.agreementRate * 100)}%`),
        createCell(resultLabels[summary.result], `result-pill ${summary.result.toLowerCase().replaceAll('_', '-')}`)
      );
      body.appendChild(row);
    });
};

const renderDistribution = (records) => {
  const counts = records.reduce((result, record) => {
    result[record.health_status] = (result[record.health_status] || 0) + 1;
    return result;
  }, {});
  const maximum = Math.max(...Object.values(counts));

  Object.entries(STATUS_LABELS).forEach(([status]) => {
    const count = counts[status] || 0;
    const countElement = document.querySelector(`[data-status-count="${status}"]`);
    const barElement = document.querySelector(`[data-status-bar="${status}"]`);
    if (countElement) countElement.textContent = count;
    if (barElement) barElement.style.width = `${(count / maximum) * 100}%`;
  });
};

const updateMetrics = (records, summaries) => {
  const values = {
    tests: records.length,
    equipment: summaries.length,
    'tests-per-unit': Math.min(...summaries.map((summary) => summary.tests)),
    classes: new Set(records.map((record) => record.health_status)).size
  };
  Object.entries(values).forEach(([metric, value]) => {
    const element = document.querySelector(`[data-metric="${metric}"]`);
    if (element) element.textContent = value;
  });
};

const renderInference = (records) => {
  const grid = document.querySelector('[data-inference-grid]');
  if (!grid) return;
  grid.replaceChildren();

  records.forEach((record) => {
    const card = document.createElement('article');
    card.className = 'inference-card';
    const label = document.createElement('span');
    const mean = document.createElement('strong');
    const caption = document.createElement('small');
    const interval = document.createElement('p');
    label.textContent = resultLabels[record.consistency_result].toUpperCase();
    mean.textContent = Number(record.mean_confidence).toFixed(3);
    caption.textContent = 'confiança média';
    interval.textContent = `IC 95% · ${Number(record.ci95_lower).toFixed(3)} — ${Number(record.ci95_upper).toFixed(3)}`;
    card.append(label, mean, caption, interval);
    grid.appendChild(card);
  });
};

const loadLessonData = async () => {
  try {
    const [dataResponse, inferenceResponse] = await Promise.all([fetch(DATA_PATH), fetch(INFERENCE_PATH)]);
    if (!dataResponse.ok || !inferenceResponse.ok) throw new Error('Lesson data could not be loaded.');
    const [dataSource, inferenceSource] = await Promise.all([dataResponse.text(), inferenceResponse.text()]);
    const records = parseCsv(dataSource);
    const summaries = summarizeEquipment(records);

    updateMetrics(records, summaries);
    renderPreview(records);
    renderDistribution(records);
    renderResults(summaries);
    renderInference(parseCsv(inferenceSource));

    document.querySelectorAll('[data-result-filter]').forEach((button) => {
      button.addEventListener('click', () => {
        document.querySelectorAll('[data-result-filter]').forEach((item) => item.classList.toggle('active', item === button));
        renderResults(summaries, button.dataset.resultFilter);
      });
    });
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
      button.textContent = 'Selecione o código';
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
    // The completion state still updates for the current session.
  }
  setCompleteState(true);
});

loadLessonData();
