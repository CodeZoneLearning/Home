const promptScenarios = [
  {
    id: 'ticket',
    label: 'Classificar ticket',
    labelEn: 'Classify ticket',
    kind: 'CLASSIFICAÇÃO',
    kindEn: 'CLASSIFICATION',
    title: 'Classificar ticket de suporte',
    titleEn: 'Classify a support ticket',
    prompt: `Você é um analista de suporte técnico.

Tarefa:
Classifique o ticket abaixo em uma categoria e uma prioridade.

Categorias permitidas:
- billing
- access
- bug
- feature_request
- unclear

Critérios:
- Use apenas o conteúdo do ticket.
- Se a categoria não estiver clara, use "unclear".
- Prioridade vai de 1 a 4, onde 4 é crítico.
- Justifique com uma frase curta baseada em evidência.

Ticket:
"Não consigo acessar o dashboard desde ontem. Já troquei a senha e o erro continua dizendo usuário sem permissão."

Responda somente em JSON válido.`,
    promptEn: `You are a technical support analyst.

Task:
Classify the ticket below into one category and one priority.

Allowed categories:
- billing
- access
- bug
- feature_request
- unclear

Criteria:
- Use only the ticket content.
- If the category is unclear, use "unclear".
- Priority ranges from 1 to 4, where 4 is critical.
- Justify with one short evidence-based sentence.

Ticket:
"I cannot access the dashboard since yesterday. I already changed the password and the error still says user without permission."

Respond only with valid JSON.`,
    schema: `{
  "categoria": "access",
  "prioridade": 3,
  "evidencia": "erro de permissão mesmo após troca de senha"
}`,
    schemaEn: `{
  "category": "access",
  "priority": 3,
  "evidence": "permission error even after password change"
}`,
    risk: 'Cuidado: sem categorias permitidas, o modelo pode inventar rótulos como login_problem ou auth_issue.',
    riskEn: 'Caution: without allowed categories, the model may invent labels such as login_problem or auth_issue.'
  },
  {
    id: 'extract',
    label: 'Extrair dados',
    labelEn: 'Extract data',
    kind: 'EXTRAÇÃO',
    kindEn: 'EXTRACTION',
    title: 'Extrair campos de um e-mail',
    titleEn: 'Extract fields from an email',
    prompt: `Você é um extrator de dados.

Extraia os campos do e-mail abaixo.

Regras:
- Preserve datas no formato ISO quando possível.
- Se um campo não aparecer, use null.
- Não deduza valores ausentes.
- Responda apenas com o objeto JSON.

Campos:
- cliente
- equipamento_id
- data_teste
- status_reportado
- acao_solicitada

E-mail:
"Cliente Atlas informou que o equipamento EQ-014 apresentou status degradado no teste de 2026-06-18. Eles pedem abertura de análise técnica."`,
    promptEn: `You are a data extractor.

Extract the fields from the email below.

Rules:
- Preserve dates in ISO format when possible.
- If a field does not appear, use null.
- Do not infer missing values.
- Respond only with the JSON object.

Fields:
- client
- equipment_id
- test_date
- reported_status
- requested_action

Email:
"Client Atlas reported that equipment EQ-014 showed degraded status in the 2026-06-18 test. They request opening a technical analysis."`,
    schema: `{
  "cliente": "Atlas",
  "equipment_id": "EQ-014",
  "data_teste": "2026-06-18",
  "status_reportado": "degradado",
  "acao_solicitada": "abertura de análise técnica"
}`,
    schemaEn: `{
  "client": "Atlas",
  "equipment_id": "EQ-014",
  "test_date": "2026-06-18",
  "reported_status": "degraded",
  "requested_action": "open technical analysis"
}`,
    risk: 'Cuidado: extração não é interpretação. Se o texto não contém um campo, o valor precisa ser null.',
    riskEn: 'Caution: extraction is not interpretation. If the text does not contain a field, the value must be null.'
  },
  {
    id: 'review',
    label: 'Revisar resposta',
    labelEn: 'Review answer',
    kind: 'AVALIAÇÃO',
    kindEn: 'EVALUATION',
    title: 'Avaliar qualidade de uma resposta',
    titleEn: 'Evaluate answer quality',
    prompt: `Você é um revisor de respostas geradas por IA.

Avalie se a resposta responde à pergunta usando apenas o contexto.

Critérios:
- grounded: a resposta está sustentada pelo contexto?
- complete: a resposta cobre a pergunta principal?
- risk: existe extrapolação, omissão ou conflito?
- action: approve, revise ou reject.

Pergunta:
"Qual é o status do equipamento EQ-014?"

Contexto:
"O teste T-882 do equipamento EQ-014 retornou health_status=2 com confiança 0.91."

Resposta candidata:
"O equipamento EQ-014 está saudável e pode voltar à operação normal."

Responda somente em JSON válido.`,
    promptEn: `You are a reviewer of AI-generated answers.

Evaluate whether the answer responds to the question using only the context.

Criteria:
- grounded: is the answer supported by the context?
- complete: does the answer cover the main question?
- risk: is there extrapolation, omission, or conflict?
- action: approve, revise, or reject.

Question:
"What is the status of equipment EQ-014?"

Context:
"Test T-882 for equipment EQ-014 returned health_status=2 with confidence 0.91."

Candidate answer:
"Equipment EQ-014 is healthy and can return to normal operation."

Respond only with valid JSON.`,
    schema: `{
  "grounded": false,
  "complete": false,
  "risk": "a resposta troca status 2 por saudável sem evidência",
  "action": "reject"
}`,
    schemaEn: `{
  "grounded": false,
  "complete": false,
  "risk": "the answer changes status 2 into healthy without evidence",
  "action": "reject"
}`,
    risk: 'Cuidado: avaliação precisa comparar pergunta, contexto e resposta. Não avalie só fluência.',
    riskEn: 'Caution: evaluation must compare question, context, and answer. Do not evaluate fluency alone.'
  }
];

const buttonsShell = document.querySelector('[data-prompt-scenarios]');
const kind = document.querySelector('[data-prompt-kind]');
const title = document.querySelector('[data-prompt-title]');
const promptText = document.querySelector('[data-prompt-text]');
const schema = document.querySelector('[data-prompt-schema]');
const risk = document.querySelector('[data-prompt-risk]');

let activeScenario = promptScenarios[0];
const isEnglish = () => window.codeZoneI18n?.language === 'en';

const renderPromptScenario = (scenario) => {
  activeScenario = scenario;
  const english = isEnglish();
  kind.textContent = english ? scenario.kindEn : scenario.kind;
  title.textContent = english ? scenario.titleEn : scenario.title;
  promptText.textContent = english ? scenario.promptEn : scenario.prompt;
  schema.textContent = english ? scenario.schemaEn : scenario.schema;
  risk.textContent = english ? scenario.riskEn : scenario.risk;

  buttonsShell.querySelectorAll('button').forEach((button) => {
    button.classList.toggle('active', button.dataset.scenario === scenario.id);
    const match = promptScenarios.find((item) => item.id === button.dataset.scenario);
    if (match) button.textContent = english ? match.labelEn : match.label;
  });
};

promptScenarios.forEach((scenario) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.dataset.scenario = scenario.id;
  button.textContent = scenario.label;
  button.addEventListener('click', () => renderPromptScenario(scenario));
  buttonsShell.appendChild(button);
});

renderPromptScenario(promptScenarios[0]);
window.addEventListener('codezone:languagechange', () => renderPromptScenario(activeScenario));

const completeButton = document.querySelector('[data-complete-lesson]');
completeButton?.addEventListener('click', () => {
  const key = 'code-zone-progress:genai';
  let progress = [];
  try {
    progress = JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    progress = [];
  }
  if (!progress.includes('01')) progress.push('01');
  try {
    localStorage.setItem(key, JSON.stringify(progress));
  } catch {
    // Completion still changes the visible state for this session.
  }
  completeButton.classList.add('is-complete');
  completeButton.textContent = 'Bloco concluído';
});
