const PROGRESS_KEY = 'code-zone-progress:matematica';
const MODULE_ID = '07';
const isEnglish = () => document.documentElement.lang === 'en';

const bdInput = document.querySelector('[data-bd]');
const deInput = document.querySelector('[data-de]');
const cfInput = document.querySelector('[data-cf]');

const setText = (selector, value) => {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
};

const buildGraph = () => {
  const bd = Number(bdInput?.value || 2);
  const de = Number(deInput?.value || 2);
  const cf = Number(cfInput?.value || 8);
  return {
    A: [['B', 2], ['C', 5]],
    B: [['A', 2], ['D', bd], ['E', 6]],
    C: [['A', 5], ['D', 1], ['F', cf]],
    D: [['B', bd], ['C', 1], ['E', de], ['F', 3]],
    E: [['B', 6], ['D', de], ['G', 3]],
    F: [['C', cf], ['D', 3], ['G', 1]],
    G: [['E', 3], ['F', 1]]
  };
};

const shortestPath = () => {
  const graph = buildGraph();
  const frontier = [{ node: 'A', cost: 0 }];
  const distances = { A: 0 };
  const previous = {};
  const finalized = new Set();

  while (frontier.length) {
    frontier.sort((a, b) => a.cost - b.cost);
    const current = frontier.shift();
    if (finalized.has(current.node)) continue;
    finalized.add(current.node);
    if (current.node === 'G') break;

    for (const [next, edgeCost] of graph[current.node]) {
      const candidate = current.cost + edgeCost;
      if (candidate < (distances[next] ?? Infinity)) {
        distances[next] = candidate;
        previous[next] = current.node;
        frontier.push({ node: next, cost: candidate });
      }
    }
  }

  const path = [];
  let node = 'G';
  while (node) {
    path.unshift(node);
    node = previous[node];
  }

  return { path, cost: distances.G, finalized: finalized.size, distances };
};

const render = () => {
  if (!bdInput || !deInput || !cfInput) return;
  const result = shortestPath();
  const finalizedLabel = isEnglish() ? 'finalized nodes' : 'nós finalizados';
  const distanceHost = document.querySelector('[data-distances]');

  setText('[data-bd-output]', bdInput.value);
  setText('[data-de-output]', deInput.value);
  setText('[data-cf-output]', cfInput.value);
  setText('[data-path]', result.path.join(' → '));
  setText('[data-cost]', `Custo ${result.cost} · ${result.finalized} ${finalizedLabel}`);

  if (distanceHost) {
    distanceHost.replaceChildren();
    Object.entries(result.distances).forEach(([node, cost]) => {
      const tag = document.createElement('span');
      tag.textContent = `d[${node}]=${cost}`;
      distanceHost.appendChild(tag);
    });
  }
};

[bdInput, deInput, cfInput].forEach((input) => input?.addEventListener('input', render));

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
