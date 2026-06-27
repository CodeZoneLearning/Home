const PROGRESS_KEY = 'code-zone-progress:matematica';
const MODULE_ID = '07';
const isEnglish = () => document.documentElement.lang === 'en';

const bdInput = document.querySelector('[data-bd]');
const deInput = document.querySelector('[data-de]');
const heuristicInput = document.querySelector('[data-heuristic]');
const mutationInput = document.querySelector('[data-mutation]');
const generationsInput = document.querySelector('[data-generations]');
const targetInput = document.querySelector('[data-target]');

const setText = (selector, value) => {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
};

const positions = {
  A: [0, 0],
  B: [1, 0],
  C: [1, 3],
  D: [2, 0],
  E: [3, 2],
  F: [3, 0],
  G: [4, 0]
};

const distanceToGoal = (node) => {
  const [x, y] = positions[node];
  const [gx, gy] = positions.G;
  return Math.hypot(gx - x, gy - y);
};

const buildGraph = () => {
  const bd = Number(bdInput?.value || 2);
  const de = Number(deInput?.value || 2);
  return {
    A: [['B', 2], ['C', 5]],
    B: [['A', 2], ['D', bd], ['E', 6]],
    C: [['A', 5], ['D', 1], ['F', 8]],
    D: [['B', bd], ['C', 1], ['E', de], ['F', 3]],
    E: [['B', 6], ['D', de], ['G', 3]],
    F: [['C', 8], ['D', 3], ['G', 1]],
    G: [['E', 3], ['F', 1]]
  };
};

const shortestPath = (useHeuristic) => {
  const graph = buildGraph();
  const heuristicWeight = Number(heuristicInput?.value || 1);
  const frontier = [{ node: 'A', priority: 0 }];
  const costs = { A: 0 };
  const previous = {};
  const visited = new Set();
  let expansions = 0;

  while (frontier.length) {
    frontier.sort((a, b) => a.priority - b.priority);
    const current = frontier.shift().node;
    if (visited.has(current)) continue;
    visited.add(current);
    expansions += 1;
    if (current === 'G') break;

    for (const [next, edgeCost] of graph[current]) {
      const newCost = costs[current] + edgeCost;
      if (!(next in costs) || newCost < costs[next]) {
        costs[next] = newCost;
        previous[next] = current;
        const heuristic = useHeuristic ? heuristicWeight * distanceToGoal(next) : 0;
        frontier.push({ node: next, priority: newCost + heuristic });
      }
    }
  }

  const path = [];
  let node = 'G';
  while (node) {
    path.unshift(node);
    node = previous[node];
  }

  return { path, cost: costs.G, expansions };
};

const renderPaths = () => {
  if (!bdInput || !deInput || !heuristicInput) return;
  const dijkstra = shortestPath(false);
  const astar = shortestPath(true);
  const expansionLabel = isEnglish() ? 'expansions' : 'expansões';

  setText('[data-bd-output]', bdInput.value);
  setText('[data-de-output]', deInput.value);
  setText('[data-h-output]', Number(heuristicInput.value).toFixed(1));
  setText('[data-dijkstra-path]', dijkstra.path.join(' → '));
  setText('[data-dijkstra-cost]', `Custo ${dijkstra.cost} · ${dijkstra.expansions} ${expansionLabel}`);
  setText('[data-astar-path]', astar.path.join(' → '));
  setText('[data-astar-cost]', `Custo ${astar.cost} · ${astar.expansions} ${expansionLabel}`);
};

const seededRandom = (seed) => {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
};

const geneticSearch = () => {
  const target = Number(targetInput?.value || 73);
  const mutationRate = Number(mutationInput?.value || 0.2);
  const generations = Number(generationsInput?.value || 40);
  const random = seededRandom(193 + target * 17 + Math.round(mutationRate * 1000) + generations);
  const clamp = (value) => Math.max(0, Math.min(100, Math.round(value)));
  const score = (value) => -Math.abs(value - target);
  let population = Array.from({ length: 18 }, () => clamp(random() * 100));

  for (let generation = 0; generation < generations; generation += 1) {
    population.sort((a, b) => score(b) - score(a));
    const elite = population.slice(0, 6);
    const next = elite.slice(0, 3);
    while (next.length < population.length) {
      const a = elite[Math.floor(random() * elite.length)];
      const b = elite[Math.floor(random() * elite.length)];
      let child = (a + b) / 2;
      if (random() < mutationRate) child += Math.round((random() - 0.5) * 24);
      next.push(clamp(child));
    }
    population = next;
  }

  population.sort((a, b) => score(b) - score(a));
  const best = population[0];
  return { best, fitness: score(best), error: Math.abs(best - target) };
};

const renderGenetic = () => {
  if (!mutationInput || !generationsInput || !targetInput) return;
  const result = geneticSearch();
  const fitnessLabel = isEnglish() ? 'fitness' : 'fitness';
  const errorLabel = isEnglish() ? 'error' : 'erro';

  setText('[data-mutation-output]', Number(mutationInput.value).toLocaleString(isEnglish() ? 'en-US' : 'pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }));
  setText('[data-generation-output]', generationsInput.value);
  setText('[data-target-output]', targetInput.value);
  setText('[data-genetic-best]', result.best);
  setText('[data-genetic-score]', `${fitnessLabel} ${result.fitness} · ${errorLabel} ${result.error}`);
};

[bdInput, deInput, heuristicInput].forEach((input) => input?.addEventListener('input', renderPaths));
[mutationInput, generationsInput, targetInput].forEach((input) => input?.addEventListener('input', renderGenetic));

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
  renderPaths();
  renderGenetic();
  setComplete(readProgress().has(MODULE_ID));
});

renderPaths();
renderGenetic();
setComplete(readProgress().has(MODULE_ID));
