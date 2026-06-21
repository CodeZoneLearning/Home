const DATA_PATH = 'outputs/metric_results.json';
const PROGRESS_KEY = 'code-zone-progress:machine-learning-v2';

let metricData;
let activeRegressionVariant = 'regular';

const locale = () => document.documentElement.lang === 'en' ? 'en-US' : 'pt-BR';
const formatNumber = (value, digits = 3) => new Intl.NumberFormat(locale(), {
  minimumFractionDigits: digits,
  maximumFractionDigits: digits
}).format(value);
const formatPercent = (value, digits = 1) => new Intl.NumberFormat(locale(), {
  style: 'percent',
  minimumFractionDigits: digits,
  maximumFractionDigits: digits
}).format(value);

const findThreshold = (value) => metricData?.classification.thresholds.find(
  (item) => Math.abs(item.threshold - Number(value)) < 0.001
);

const renderThreshold = (value) => {
  const result = findThreshold(value);
  if (!result) return;

  const thresholdLabel = document.querySelector('[data-threshold-value]');
  if (thresholdLabel) thresholdLabel.textContent = formatNumber(result.threshold, 2);

  document.querySelectorAll('[data-threshold-metric]').forEach((element) => {
    element.textContent = formatPercent(result[element.dataset.thresholdMetric]);
  });

  const analysis = document.querySelector('[data-threshold-analysis]');
  if (analysis) {
    if (result.threshold < 0.5) {
      analysis.textContent = 'Recall sobe: mais falhas são encontradas, mas a Precision cai com o aumento de alertas falsos.';
    } else if (result.threshold > 0.5) {
      analysis.textContent = 'Precision sobe: os alertas ficam mais seletivos, mas mais falhas reais deixam de ser detectadas.';
    } else {
      analysis.textContent = 'Equilíbrio intermediário entre cobertura e qualidade dos alertas.';
    }
  }
};

const renderClassification = () => {
  const baseline = findThreshold(0.5);
  if (!baseline) return;

  document.querySelectorAll('[data-confusion]').forEach((element) => {
    element.textContent = baseline[element.dataset.confusion];
  });
  document.querySelectorAll('[data-classification-metric]').forEach((element) => {
    element.textContent = formatPercent(baseline[element.dataset.classificationMetric]);
  });
  document.querySelectorAll('[data-ranking-metric]').forEach((element) => {
    element.textContent = formatNumber(
      metricData.classification.ranking_and_probability[element.dataset.rankingMetric]
    );
  });
  const thresholdControl = document.querySelector('[data-threshold-control]');
  renderThreshold(thresholdControl?.value || 0.5);
};

const renderRegression = (variant) => {
  const values = metricData?.regression[variant];
  if (!values) return;
  activeRegressionVariant = variant;

  document.querySelectorAll('[data-regression-variant]').forEach((button) => {
    const selected = button.dataset.regressionVariant === variant;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });

  document.querySelectorAll('[data-regression-metric]').forEach((element) => {
    const metric = element.dataset.regressionMetric;
    element.textContent = metric === 'mape'
      ? formatPercent(values[metric])
      : formatNumber(values[metric], metric === 'r2' ? 3 : 1);
  });

  document.querySelectorAll('[data-outlier-value]').forEach((element) => {
    const metric = element.dataset.outlierValue;
    element.textContent = formatNumber(values[metric], metric === 'r2' ? 3 : 1);
  });

  const barMaximums = { mae: 60, rmse: 125, r2: 1 };
  document.querySelectorAll('[data-regression-bar]').forEach((bar) => {
    const metric = bar.dataset.regressionBar;
    bar.style.width = `${Math.max(2, Math.min(100, (values[metric] / barMaximums[metric]) * 100))}%`;
  });

  const analysis = document.querySelector('[data-regression-analysis]');
  if (analysis) {
    analysis.textContent = variant === 'regular'
      ? 'MAE e RMSE estão próximos: os erros têm magnitudes relativamente homogêneas.'
      : 'O RMSE cresce muito mais que o MAE: um erro extremo está dominando a avaliação.';
  }
};

const renderClustering = () => {
  const candidates = metricData?.clustering.candidates || [];
  const container = document.querySelector('[data-cluster-results]');
  if (!container || !candidates.length) return;
  const bestSilhouette = Math.max(...candidates.map((candidate) => candidate.silhouette));
  container.replaceChildren();

  candidates.forEach((candidate) => {
    const row = document.createElement('div');
    row.className = 'cluster-row';
    const best = candidate.silhouette === bestSilhouette;
    row.classList.toggle('best', best);
    const values = [
      candidate.clusters,
      formatNumber(candidate.silhouette),
      formatNumber(candidate.davies_bouldin),
      formatNumber(candidate.calinski_harabasz, 0),
      best ? 'melhor candidato' : 'comparar'
    ];
    values.forEach((value, index) => {
      const cell = document.createElement(index === 0 ? 'strong' : 'span');
      cell.textContent = value;
      row.appendChild(cell);
    });
    container.appendChild(row);
  });
};

const renderAll = () => {
  if (!metricData) return;
  renderClassification();
  renderRegression(activeRegressionVariant);
  renderClustering();
};

document.querySelector('[data-threshold-control]')?.addEventListener('input', (event) => {
  renderThreshold(event.currentTarget.value);
});

document.querySelectorAll('[data-regression-variant]').forEach((button) => {
  button.addEventListener('click', () => renderRegression(button.dataset.regressionVariant));
});

const loadMetrics = async () => {
  try {
    const response = await fetch(DATA_PATH);
    if (!response.ok) throw new Error(`Metric data returned ${response.status}.`);
    metricData = await response.json();
    renderAll();
  } catch (error) {
    document.body.classList.add('metrics-load-error');
    console.error(error);
  }
};

window.addEventListener('codezone:languagechange', renderAll);

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
  setCompleteState(saved.includes('03'));
} catch {
  setCompleteState(false);
}

completeButton?.addEventListener('click', () => {
  try {
    const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY)) || [];
    const completed = new Set(saved);
    completed.add('03');
    localStorage.setItem(PROGRESS_KEY, JSON.stringify([...completed]));
  } catch {
    // The completion state remains available for the current session.
  }
  setCompleteState(true);
});

loadMetrics();
