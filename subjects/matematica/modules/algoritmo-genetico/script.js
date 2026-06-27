const PROGRESS_KEY = 'code-zone-progress:matematica';
const MODULE_ID = '09';
const isEnglish = () => document.documentElement.lang === 'en';

const budgetInput = document.querySelector('[data-budget]');
const mutationInput = document.querySelector('[data-mutation]');
const generationsInput = document.querySelector('[data-generations]');

const items = [
  { name: 'Sensor extra', cost: 6, value: 13 },
  { name: 'Pipeline', cost: 9, value: 22 },
  { name: 'Monitoramento', cost: 7, value: 18 },
  { name: 'Treinamento', cost: 11, value: 25 },
  { name: 'Backup', cost: 5, value: 9 },
  { name: 'Dashboard', cost: 8, value: 19 },
  { name: 'Teste A/B', cost: 10, value: 21 },
  { name: 'Automação', cost: 12, value: 28 }
];

const setText = (selector, value) => {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
};

const number = (value, digits = 2) => value.toLocaleString(isEnglish() ? 'en-US' : 'pt-BR', {
  minimumFractionDigits: digits,
  maximumFractionDigits: digits
});

const seededRandom = (seed) => {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
};

const evaluate = (chromosome, budget) => {
  const totals = chromosome.reduce((acc, gene, index) => {
    if (gene) {
      acc.cost += items[index].cost;
      acc.value += items[index].value;
    }
    return acc;
  }, { cost: 0, value: 0 });
  const overflow = Math.max(0, totals.cost - budget);
  const fitness = totals.value - 4 * overflow ** 2;
  return { ...totals, overflow, fitness, feasible: overflow === 0 };
};

const runGenetic = () => {
  const budget = Number(budgetInput?.value || 28);
  const mutationRate = Number(mutationInput?.value || 0.12);
  const generations = Number(generationsInput?.value || 60);
  const rng = seededRandom(911 + budget * 31 + Math.round(mutationRate * 1000) + generations * 7);
  const length = items.length;
  const populationSize = 34;
  let population = Array.from({ length: populationSize }, () => (
    Array.from({ length }, () => rng() < 0.5 ? 1 : 0)
  ));

  const tournament = () => {
    let best = population[Math.floor(rng() * population.length)];
    for (let i = 0; i < 2; i += 1) {
      const candidate = population[Math.floor(rng() * population.length)];
      if (evaluate(candidate, budget).fitness > evaluate(best, budget).fitness) best = candidate;
    }
    return best;
  };

  const crossover = (a, b) => {
    const cut = 1 + Math.floor(rng() * (length - 1));
    return [...a.slice(0, cut), ...b.slice(cut)];
  };

  const mutate = (chromosome) => chromosome.map((gene) => (rng() < mutationRate ? 1 - gene : gene));

  for (let generation = 0; generation < generations; generation += 1) {
    population.sort((a, b) => evaluate(b, budget).fitness - evaluate(a, budget).fitness);
    const next = population.slice(0, 3);
    while (next.length < populationSize) {
      next.push(mutate(crossover(tournament(), tournament())));
    }
    population = next;
  }

  const feasible = population.filter((chromosome) => evaluate(chromosome, budget).feasible);
  const candidates = feasible.length ? feasible : population;
  candidates.sort((a, b) => evaluate(b, budget).fitness - evaluate(a, budget).fitness);
  const chromosome = candidates[0];
  return { chromosome, ...evaluate(chromosome, budget) };
};

const render = () => {
  if (!budgetInput || !mutationInput || !generationsInput) return;
  const result = runGenetic();
  const itemHost = document.querySelector('[data-items]');
  const viableLabel = result.feasible ? (isEnglish() ? 'feasible' : 'viável') : (isEnglish() ? 'over budget' : 'acima do orçamento');

  setText('[data-budget-output]', budgetInput.value);
  setText('[data-mutation-output]', number(Number(mutationInput.value), 2));
  setText('[data-generations-output]', generationsInput.value);
  setText('[data-best-value]', `${isEnglish() ? 'value' : 'valor'} ${result.value}`);
  setText('[data-best-cost]', `${isEnglish() ? 'cost' : 'custo'} ${result.cost} · fitness ${result.fitness} · ${viableLabel}`);

  if (itemHost) {
    itemHost.replaceChildren();
    result.chromosome.forEach((gene, index) => {
      if (!gene) return;
      const tag = document.createElement('span');
      tag.textContent = items[index].name;
      itemHost.appendChild(tag);
    });
  }
};

[budgetInput, mutationInput, generationsInput].forEach((input) => input?.addEventListener('input', render));

document.querySelectorAll('[data-copy-code]').forEach((button) => {
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
  render();
  setComplete(readProgress().has(MODULE_ID));
});

render();
setComplete(readProgress().has(MODULE_ID));
