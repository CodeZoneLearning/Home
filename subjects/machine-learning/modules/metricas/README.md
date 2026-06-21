# Métricas de Machine Learning

Este módulo relaciona métricas ao tipo de problema e ao custo dos erros. O objetivo não é decorar fórmulas, mas interpretar o que cada número permite concluir.

## Executar

```bash
python -m venv .venv
# Windows PowerShell
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python examples/analyze_metrics.py
```

O script gera `outputs/metric_results.json` com três estudos:

1. Classificação desbalanceada e efeito do threshold em Precision e Recall.
2. Regressão com e sem outlier, comparando MAE, RMSE, R² e MAPE.
3. Clusterização com diferentes valores de `k`, comparando Silhouette, Davies-Bouldin e Calinski-Harabasz.

Os dados são sintéticos e servem apenas para aprendizado.

---

# Machine Learning Metrics

This module connects metrics to the problem type and the cost of errors. The goal is not to memorize formulas, but to interpret what each number allows you to conclude.

The executable example produces classification, regression, and clustering reports. All data is synthetic and intended for learning only.
