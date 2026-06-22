# MLflow e rastreamento de experimentos

O laboratório treina um classificador de falha, registra contexto e resultados no MLflow e cria uma versão no Model Registry.

```bash
python -m pip install -r examples/requirements.txt
cd examples
python train_with_mlflow.py --max-depth 6
mlflow ui --backend-store-uri sqlite:///mlflow.db
```

A interface estará disponível em `http://127.0.0.1:5000` por padrão.
