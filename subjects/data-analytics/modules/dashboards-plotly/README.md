# Dashboards com Plotly

Este modulo mostra como transformar graficos interativos em um dashboard analitico. A aula usa Plotly para combinar KPIs, barras, linhas, dispersao, heatmap, hover e filtro de trilha em um unico HTML reproduzivel.

## Pergunta de analise

Como acompanhar atividade de aprendizagem por trilha, combinando leitura executiva e exploracao interativa?

O dataset `learning_activity.csv` contem 192 registros de atividade de aprendizagem em quatro trilhas, ao longo de oito semanas.

## O que o aluno aprende

- Diferenciar grafico isolado de dashboard.
- Definir KPIs antes de escolher componentes visuais.
- Usar `plotly.graph_objects` e `make_subplots`.
- Criar indicadores com `go.Indicator`.
- Combinar barras, linhas, dispersao e heatmap.
- Configurar hover, legenda, layout, tema e dropdown.
- Exportar dashboard para HTML standalone.

## Estrutura

```text
dashboards-plotly/
|-- data/
|   `-- learning_activity.csv
|-- outputs/
|   |-- dashboard_summary.csv
|   |-- learning_analytics_dashboard.html
|   `-- weekly_summary.csv
|-- scripts/
|   `-- generate_dashboard.py
|-- index.html
|-- script.js
|-- styles.css
`-- requirements.txt
```

## Executar

No diretorio deste modulo:

```bash
python -m venv .venv
# Windows PowerShell
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python scripts/generate_dashboard.py
```

Depois abra:

```text
outputs/learning_analytics_dashboard.html
```

## Contrato do dashboard

Um dashboard precisa responder:

- Quem vai usar?
- Qual decisao ou acompanhamento ele apoia?
- Quais KPIs precisam aparecer primeiro?
- Quais filtros sao realmente necessarios?
- Quais graficos respondem perguntas complementares?
- Como o usuario interpreta hover, legenda e escala?

## Limites

Os dados sao sinteticos e servem para ensino. O dashboard mostra padroes de composicao visual e entrega com Plotly, nao conclusoes reais sobre aprendizagem.
