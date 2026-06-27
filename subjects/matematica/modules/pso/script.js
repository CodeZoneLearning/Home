const PROGRESS_KEY = 'code-zone-progress:matematica';
const MODULE_ID = '10';
const isEnglish = () => document.documentElement.lang === 'en';

const inertiaInput = document.querySelector('[data-inertia]');
const cognitiveInput = document.querySelector('[data-cognitive]');
const socialInput = document.querySelector('[data-social]');
const iterationsInput = document.querySelector('[data-iterations]');

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

const objective = ([x, y]) => (x - 3) ** 2 + (y + 2) ** 2;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const runPso = () => {
  const omega = Number(inertiaInput?.value || 0.65);
  const c1 = Number(cognitiveInput?.value || 1.4);
  const c2 = Number(socialInput?.value || 1.6);
  const iterations = Number(iterationsInput?.value || 45);
  const rng = seededRandom(1201 + Math.round(omega * 100) + Math.round(c1 * 100) * 3 + Math.round(c2 * 100) * 5 + iterations);
  const particleCount = 24;
  const particles = Array.from({ length: particleCount }, () => {
    const position = [rng() * 16 - 8, rng() * 16 - 8];
    const velocity = [rng() * 2 - 1, rng() * 2 - 1];
    return { position, velocity, best: position.slice(), bestCost: objective(position) };
  });
  let globalBest = particles.reduce((best, particle) => (
    particle.bestCost < best.cost ? { position: particle.best.slice(), cost: particle.bestCost } : best
  ), { position: particles[0].best.slice(), cost: particles[0].bestCost });

  for (let step = 0; step < iterations; step += 1) {
    particles.forEach((particle) => {
      for (let dim = 0; dim < 2; dim += 1) {
        const r1 = rng();
        const r2 = rng();
        const cognitive = c1 * r1 * (particle.best[dim] - particle.position[dim]);
        const social = c2 * r2 * (globalBest.position[dim] - particle.position[dim]);
        particle.velocity[dim] = clamp(omega * particle.velocity[dim] + cognitive + social, -3, 3);
        particle.position[dim] = clamp(particle.position[dim] + particle.velocity[dim], -8, 8);
      }

      const cost = objective(particle.position);
      if (cost < particle.bestCost) {
        particle.best = particle.position.slice();
        particle.bestCost = cost;
      }
      if (cost < globalBest.cost) {
        globalBest = { position: particle.position.slice(), cost };
      }
    });
  }

  const distance = Math.hypot(globalBest.position[0] - 3, globalBest.position[1] + 2);
  return { ...globalBest, distance, particleCount, iterations };
};

const render = () => {
  if (!inertiaInput || !cognitiveInput || !socialInput || !iterationsInput) return;
  const result = runPso();
  const statsHost = document.querySelector('[data-pso-stats]');

  setText('[data-inertia-output]', number(Number(inertiaInput.value), 2));
  setText('[data-cognitive-output]', number(Number(cognitiveInput.value), 2));
  setText('[data-social-output]', number(Number(socialInput.value), 2));
  setText('[data-iterations-output]', iterationsInput.value);
  setText('[data-best-position]', `(${number(result.position[0], 2)}; ${number(result.position[1], 2)})`);
  setText('[data-best-cost]', `f(x,y)=${number(result.cost, 3)} · ${isEnglish() ? 'distance to optimum' : 'distância até ótimo'} ${number(result.distance, 3)}`);

  if (statsHost) {
    statsHost.replaceChildren();
    [
      `${result.particleCount} ${isEnglish() ? 'particles' : 'partículas'}`,
      `${result.iterations} ${isEnglish() ? 'iterations' : 'iterações'}`,
      `f*=${number(result.cost, 3)}`
    ].forEach((label) => {
      const tag = document.createElement('span');
      tag.textContent = label;
      statsHost.appendChild(tag);
    });
  }
};

[inertiaInput, cognitiveInput, socialInput, iterationsInput].forEach((input) => input?.addEventListener('input', render));

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
