const statuses = [
  {
    id: 'ok',
    label: 'Equipamento encontrado',
    code: '200 OK',
    text: 'A requisição foi aceita e a API devolveu o recurso solicitado.'
  },
  {
    id: 'created',
    label: 'Teste registrado',
    code: '201 Created',
    text: 'Um novo recurso foi criado. A resposta deve indicar o identificador ou local do novo recurso.'
  },
  {
    id: 'invalid',
    label: 'Campo inválido',
    code: '400 Bad Request',
    text: 'O cliente enviou dados que não cumprem o schema ou regra de validação.'
  },
  {
    id: 'missing',
    label: 'Equipamento inexistente',
    code: '404 Not Found',
    text: 'A URL é válida, mas o recurso pedido não existe ou não está disponível para esse consumidor.'
  }
];

const buttons = document.querySelector('[data-status-buttons]');
const code = document.querySelector('[data-status-code]');
const text = document.querySelector('[data-status-text]');

const renderStatus = (status) => {
  code.textContent = status.code;
  text.textContent = status.text;
  buttons.querySelectorAll('button').forEach((button) => {
    button.classList.toggle('active', button.dataset.status === status.id);
  });
};

statuses.forEach((status) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.dataset.status = status.id;
  button.textContent = status.label;
  button.addEventListener('click', () => renderStatus(status));
  buttons.appendChild(button);
});

renderStatus(statuses[0]);

const completeButton = document.querySelector('[data-complete-lesson]');
completeButton?.addEventListener('click', () => {
  const key = 'code-zone-progress:python';
  let progress = [];
  try {
    progress = JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    progress = [];
  }
  if (!progress.includes('05')) progress.push('05');
  try {
    localStorage.setItem(key, JSON.stringify(progress));
  } catch {
    // Completion still changes the visible state for this session.
  }
  completeButton.classList.add('is-complete');
  completeButton.textContent = 'Bloco concluído';
});
