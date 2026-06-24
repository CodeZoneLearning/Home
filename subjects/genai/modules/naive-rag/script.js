const scenarios = [
  {
    id: 'policy',
    label: 'Política de troca',
    title: 'Responder com confiança moderada',
    analysis: 'Os trechos recuperados mencionam prazo, exceção e origem do documento. A resposta pode ser gerada, mas precisa citar a política e preservar a exceção.',
    docs: ['DOC_01 · Política comercial · prazo de 30 dias', 'DOC_02 · Exceções · produtos personalizados', 'DOC_03 · FAQ · canal de atendimento']
  },
  {
    id: 'version',
    label: 'Versão de contrato',
    title: 'Pedir mais contexto',
    analysis: 'A busca trouxe contratos de anos diferentes. O RAG não deve misturar versões. A resposta correta pede a data, cliente ou versão desejada.',
    docs: ['DOC_04 · Contrato 2023 · cláusula antiga', 'DOC_09 · Contrato 2025 · cláusula revisada', 'DOC_11 · Nota interna · migração em andamento']
  },
  {
    id: 'missing',
    label: 'Preço futuro',
    title: 'Recusar por falta de evidência',
    analysis: 'Nenhum trecho recuperado contém preço futuro aprovado. O modelo pode explicar que a base não sustenta a resposta e indicar quais dados seriam necessários.',
    docs: ['DOC_06 · Tabela atual · preços vigentes', 'DOC_12 · Histórico · reajustes anteriores', 'DOC_14 · Planejamento · sem valores aprovados']
  }
];

const queryShell = document.querySelector('[data-rag-queries]');
const title = document.querySelector('[data-rag-title]');
const analysis = document.querySelector('[data-rag-analysis]');
const docs = document.querySelector('[data-rag-docs]');

const renderScenario = (scenario) => {
  title.textContent = scenario.title;
  analysis.textContent = scenario.analysis;
  docs.replaceChildren(...scenario.docs.map((doc) => {
    const element = document.createElement('span');
    element.textContent = doc;
    return element;
  }));

  queryShell.querySelectorAll('button').forEach((button) => {
    button.classList.toggle('active', button.dataset.scenario === scenario.id);
  });
};

scenarios.forEach((scenario) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.dataset.scenario = scenario.id;
  button.textContent = scenario.label;
  button.addEventListener('click', () => renderScenario(scenario));
  queryShell.appendChild(button);
});

renderScenario(scenarios[0]);

const completeButton = document.querySelector('[data-complete-lesson]');
completeButton?.addEventListener('click', () => {
  const key = 'code-zone-progress:genai';
  let progress = [];
  try {
    progress = JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    progress = [];
  }
  if (!progress.includes('02')) progress.push('02');
  try {
    localStorage.setItem(key, JSON.stringify(progress));
  } catch {
    // Completion still changes the visible state for this session.
  }
  completeButton.classList.add('is-complete');
  completeButton.textContent = 'Bloco concluído';
});
