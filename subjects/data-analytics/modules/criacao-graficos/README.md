# Criacao de graficos para analise de dados

Este modulo mostra como escolher e construir graficos a partir de uma pergunta analitica. O objetivo nao e decorar comandos de bibliotecas, mas entender qual visual responde melhor a cada tipo de pergunta.

## Pergunta de analise

Como comunicar, com graficos, a relacao entre estudo, pratica, conclusao e desempenho em uma turma Code Zone?

O dataset ficticio `learning_activity.csv` contem 192 registros, distribuidos por 4 trilhas ao longo de 8 semanas.

## Bibliotecas exploradas

| Biblioteca | Melhor uso no modulo |
| --- | --- |
| `matplotlib` | controle fino de figura, eixos, rotulos e composicao |
| `seaborn` | graficos estatisticos com menos codigo e melhor padrao visual |
| `plotly` | exploracao interativa com hover, zoom e filtros visuais |
| `pandas.plot` | exploracao rapida quando os dados ja estao em um DataFrame |

## Estrutura

```text
criacao-graficos/
|-- data/
|   `-- learning_activity.csv
|-- outputs/
|   |-- chart_summary.csv
|   |-- matplotlib_completion_by_track.png
|   |-- matplotlib_weekly_score.png
|   |-- plotly_learning_dashboard.html
|   |-- seaborn_correlation_heatmap.png
|   `-- seaborn_hours_vs_score.png
|-- scripts/
|   `-- generate_visualizations.py
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
python scripts/generate_visualizations.py
```

O script recria o CSV e todos os graficos dentro de `outputs/`.

## Regra de escolha do grafico

- Comparacao entre categorias: barras.
- Evolucao no tempo: linha.
- Relacao entre variaveis numericas: dispersao.
- Distribuicao: histograma, densidade ou boxplot.
- Matriz de relacoes: heatmap.
- Exploracao com detalhe por ponto: grafico interativo.

## Limites didaticos

Os dados sao sinteticos e foram criados para ensino. Uma analise real exigiria revisar coleta, vieses de amostra, unidade de medida, definicao das metricas e contexto pedagogico antes de tirar conclusoes.
