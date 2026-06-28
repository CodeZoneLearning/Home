# Data Apps com Streamlit

Este modulo transforma uma analise em uma aplicacao navegavel. O foco e sair do notebook isolado e construir uma interface que permita filtrar dados, acompanhar metricas, explorar graficos e baixar resultados.

## Pergunta de produto

Como criar um app simples para acompanhar atividade de aprendizagem por trilha, semana e desempenho?

O app usa o dataset `learning_activity.csv`, o mesmo contexto didatico do modulo de criacao de graficos.

## O que o aluno aprende

- Diferença entre notebook, dashboard e data app.
- Estrutura minima de um app Streamlit.
- Uso de `st.sidebar`, `st.metric`, `st.tabs`, `st.dataframe` e `st.download_button`.
- Uso de `@st.cache_data` para evitar recomputacao desnecessaria.
- Validacao simples de schema antes de aceitar um CSV.
- Filtros interativos com `multiselect`, `slider` e `checkbox`.
- Graficos Plotly dentro do Streamlit.

## Estrutura

```text
data-apps-streamlit/
|-- app.py
|-- data/
|   `-- learning_activity.csv
|-- index.html
|-- script.js
|-- styles.css
|-- README.md
`-- requirements.txt
```

## Executar

No diretorio deste modulo:

```bash
python -m venv .venv
# Windows PowerShell
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
streamlit run app.py
```

O Streamlit abrira uma URL local parecida com:

```text
http://localhost:8501
```

## Contrato do CSV

O app espera as colunas:

| Coluna | Papel |
| --- | --- |
| `week` | semana da observacao |
| `learner_id` | identificador do participante |
| `track` | trilha de aprendizagem |
| `study_hours` | horas de estudo na semana |
| `practice_tasks` | tarefas praticas concluidas |
| `completion_rate` | taxa de conclusao entre 0 e 1 |
| `challenge_score` | pontuacao do desafio |
| `support_requests` | pedidos de suporte |
| `satisfaction` | avaliacao de satisfacao |

Se o usuario enviar outro CSV sem essas colunas, o app mostra uma mensagem de erro e interrompe a execucao.

## Arquitetura didatica

O codigo separa responsabilidades:

- carregamento de dados;
- validacao de schema;
- filtros de interface;
- metricas;
- graficos;
- tabela e download;
- guia de uso.

Essa separacao facilita manutencao e ajuda o aluno a entender que um data app e mais do que "colocar graficos na tela".

## Limites

Os dados sao sinteticos. O app serve para ensinar padroes de desenvolvimento com Streamlit, nao para avaliar aprendizagem real. Em producao seria necessario tratar autenticacao, privacidade, atualizacao de dados, logs e governanca.
