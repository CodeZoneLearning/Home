const PROGRESS_KEY = 'code-zone-progress:matematica';
const MODULE_ID = '08';
const isEnglish = () => document.documentElement.lang === 'en';

const alphaInput = document.querySelector('[data-alpha]');
const bdInput = document.querySelector('[data-bd]');
const deInput = document.querySelector('[data-de]');

const positions = {
  A: [0, 0],
  B: [1, 0],
  C: [1, 3],
  D: [2, 0],
  E: [3, 2],
  F: [3, 0],
  G: [4, 0]
};

const setText = (selector, value) => {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
};

const number = (value, digits = 1) => value.toLocaleString(isEnglish() ? 'en-US' : 'pt-BR', {
  minimumFractionDigits: digits,
  maximumFractionDigits: digits
});

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

const heuristic = (node) => {
  const [x, y] = positions[node];
  const [gx, gy] = positions.G;
  return Math.hypot(gx - x, gy - y);
};

const search = (alpha) => {
  const graph = buildGraph();
  const frontier = [{ node: 'A', priority: 0 }];
  const costs = { A: 0 };
  const previous = {};
  const expanded = new Set();

  while (frontier.length) {
    frontier.sort((a, b) => a.priority - b.priority);
    const current = frontier.shift().node;
    if (expanded.has(current)) continue;
    expanded.add(current);
    if (current === 'G') break;

    for (const [next, edgeCost] of graph[current]) {
      const candidate = costs[current] + edgeCost;
      if (candidate < (costs[next] ?? Infinity)) {
        costs[next] = candidate;
        previous[next] = current;
        frontier.push({ node: next, priority: candidate + alpha * heuristic(next) });
      }
    }
  }

  const path = [];
  let node = 'G';
  while (node) {
    path.unshift(node);
    node = previous[node];
  }
  return { path, cost: costs.G, expansions: expanded.size, costs };
};

const render = () => {
  if (!alphaInput || !bdInput || !deInput) return;
  const alpha = Number(alphaInput.value);
  const astar = search(alpha);
  const optimal = search(0);
  const status = astar.cost === optimal.cost
    ? (isEnglish() ? 'optimal preserved' : 'ótimo preservado')
    : (isEnglish() ? `above optimum ${optimal.cost}` : `acima do ótimo ${optimal.cost}`);
  const expansionLabel = isEnglish() ? 'expansions' : 'expansões';
  const frontierHost = document.querySelector('[data-frontier]');

  setText('[data-alpha-output]', number(alpha, 1));
  setText('[data-bd-output]', bdInput.value);
  setText('[data-de-output]', deInput.value);
  setText('[data-path]', astar.path.join(' → '));
  setText('[data-cost]', `Custo ${astar.cost} · ${astar.expansions} ${expansionLabel} · ${status}`);

  if (frontierHost) {
    frontierHost.replaceChildren();
    Object.entries(astar.costs).forEach(([node, cost]) => {
      const tag = document.createElement('span');
      tag.textContent = `${node}: g=${cost}, h=${number(heuristic(node), 1)}`;
      frontierHost.appendChild(tag);
    });
  }
};

[alphaInput, bdInput, deInput].forEach((input) => input?.addEventListener('input', render));

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
