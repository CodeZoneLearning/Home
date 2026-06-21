# Modelos de Machine Learning

Este módulo compara famílias de modelos a partir de suas hipóteses, capacidade, requisitos de pré-processamento e comportamento de generalização.

## Executar

```bash
python -m venv .venv
# Windows PowerShell
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python examples/compare_models.py
```

O script gera `outputs/model_results.json` com:

1. Logistic Regression, KNN, Decision Tree, Random Forest e RBF SVM no mesmo conjunto não linear.
2. Accuracy de treino e validação, F1 e gap de generalização.
3. Árvores com profundidades diferentes para observar underfitting e overfitting.

Os dados são sintéticos e os resultados não definem um vencedor universal.

---

# Machine Learning Models

This module compares model families through their assumptions, capacity, preprocessing requirements, and generalization behavior.

The executable example evaluates five model families on the same nonlinear dataset and compares decision-tree depths to make underfitting and overfitting visible.
