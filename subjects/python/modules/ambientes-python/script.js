const PROGRESS_KEY = 'code-zone-progress:python';
const isEnglish = () => document.documentElement.lang === 'en';
let selectedTool = 'venv';
let selectedShell = 'powershell';

const labels = {
  tools: { venv: 'venv + pip', uv: 'uv' },
  shells: { powershell: 'PowerShell', unix: 'macOS / Linux' }
};

const commandSets = {
  venv: {
    powershell: ['python -m venv .venv', '.venv\\Scripts\\Activate.ps1', 'python -m pip install -r requirements.txt', 'python -m equipment_health.main'],
    unix: ['python3 -m venv .venv', 'source .venv/bin/activate', 'python -m pip install -r requirements.txt', 'python -m equipment_health.main']
  },
  uv: {
    powershell: ['uv sync', 'uv run equipment-health'],
    unix: ['uv sync', 'uv run equipment-health']
  }
};

const createOptions = (selector, values, selected, onSelect) => {
  const shell = document.querySelector(selector);
  if (!shell) return;
  shell.replaceChildren(...Object.entries(values).map(([id, label]) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.classList.toggle('active', id === selected);
    button.setAttribute('aria-pressed', String(id === selected));
    button.addEventListener('click', () => onSelect(id));
    return button;
  }));
};

const renderBuilder = () => {
  createOptions('[data-tool-options]', labels.tools, selectedTool, (value) => { selectedTool = value; renderBuilder(); });
  createOptions('[data-shell-options]', labels.shells, selectedShell, (value) => { selectedShell = value; renderBuilder(); });
  const commands = commandSets[selectedTool][selectedShell];
  document.querySelector('[data-command-list]')?.replaceChildren(...commands.map((command) => {
    const item = document.createElement('li'); item.textContent = command; return item;
  }));
  const mode = `${selectedTool.toUpperCase()} · ${selectedShell === 'powershell' ? 'POWERSHELL' : 'MACOS / LINUX'}`;
  document.querySelector('[data-builder-label]').textContent = mode;
  document.querySelector('[data-builder-note]').textContent = selectedTool === 'venv'
    ? (isEnglish() ? 'Activate the environment before installing and running.' : 'Ative o ambiente antes de instalar e executar.')
    : (isEnglish() ? '`uv run` selects the project environment without manual activation.' : '`uv run` seleciona o ambiente do projeto sem ativação manual.');
};

const copyCommands = document.querySelector('[data-copy-commands]');
copyCommands?.addEventListener('click', async () => {
  const commands = commandSets[selectedTool][selectedShell].join('\n');
  try { await navigator.clipboard.writeText(commands); copyCommands.textContent = isEnglish() ? 'Copied' : 'Copiado'; }
  catch { copyCommands.textContent = isEnglish() ? 'Select and copy' : 'Selecione e copie'; }
  window.setTimeout(() => { copyCommands.textContent = isEnglish() ? 'Copy commands' : 'Copiar comandos'; }, 1600);
});

const completeButton = document.querySelector('[data-complete-lesson]');
const isComplete = () => { try { return (JSON.parse(localStorage.getItem(PROGRESS_KEY)) || []).includes('04'); } catch { return false; } };
const setComplete = (completed) => {
  if (!completeButton) return;
  completeButton.classList.toggle('is-complete', completed);
  completeButton.replaceChildren(document.createTextNode(completed ? (isEnglish() ? 'Block completed ' : 'Bloco concluído ') : (isEnglish() ? 'Mark block as complete ' : 'Marcar bloco como concluído ')));
  const icon = document.createElement('span'); icon.textContent = '✓'; completeButton.appendChild(icon);
};
completeButton?.addEventListener('click', () => {
  try { const values = new Set(JSON.parse(localStorage.getItem(PROGRESS_KEY)) || []); values.add('04'); localStorage.setItem(PROGRESS_KEY, JSON.stringify([...values])); } catch {}
  setComplete(true);
});
window.addEventListener('codezone:languagechange', () => { renderBuilder(); setComplete(isComplete()); });
renderBuilder();
setComplete(isComplete());
