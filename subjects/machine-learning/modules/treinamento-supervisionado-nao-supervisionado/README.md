# Treinamento supervisionado e não supervisionado

Este módulo compara os dois paradigmas a partir da informação entregue ao algoritmo.

- **Supervisionado:** recebe `X` (features) e `y` (target conhecido).
- **Não supervisionado:** recebe somente `X` e procura estrutura, grupos ou representações.

## Executar os exemplos

```bash
python -m venv .venv
# Windows PowerShell
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python examples/training_paradigms.py
```

O script executa três problemas reproduzíveis:

1. Classificação supervisionada de três classes fictícias de saúde.
2. Regressão supervisionada de um valor contínuo.
3. Clusterização não supervisionada de perfis sintéticos.

Os dados são sintéticos e servem apenas para aprendizado. Uma métrica alta neste exemplo não representa desempenho esperado em produção.

---

# Supervised and unsupervised training

This module compares both paradigms based on the information given to the algorithm.

- **Supervised:** receives `X` (features) and a known `y` (target).
- **Unsupervised:** receives only `X` and searches for structure, groups, or representations.

The executable script includes supervised classification, supervised regression, and unsupervised clustering. All data is synthetic and intended for learning only.
