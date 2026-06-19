# Manipulação de dados tabulares com Pandas

Este módulo investiga a consistência de classificações repetidas de saúde de equipamentos. Cada linha do CSV representa um teste; um mesmo `equipment_id` aparece seis vezes.

## Pergunta de análise

Os testes de um mesmo equipamento apontam de forma estável para a mesma classe de saúde ou produzem classificações contraditórias?

As classes são:

| Classe | Interpretação |
| --- | --- |
| `1` | Healthy |
| `2` | Attention |
| `3` | Degraded |
| `4` | Critical |

## Estrutura

```text
manipulacao-dados-tabulares/
|-- data/
|   `-- equipment_health_tests.csv
|-- outputs/
|   |-- confidence_inference.csv
|   |-- descriptive_statistics.csv
|   |-- equipment_consistency_summary.csv
|   |-- health_status_counts.csv
|   `-- unique_values_report.csv
|-- scripts/
|   |-- analyze_equipment_tests.py
|   `-- generate_dataset.py
|-- index.html
|-- script.js
|-- styles.css
`-- requirements.txt
```

`data/` é a camada bruta e não deve ser alterada durante a análise. `outputs/` contém resultados reproduzíveis e pode ser regenerada a qualquer momento.

## Executar

No diretório deste módulo:

```bash
python -m venv .venv
# Windows PowerShell
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python scripts/analyze_equipment_tests.py
```

Para recriar a base fictícia antes da análise:

```bash
python scripts/generate_dataset.py
```

## Regras de consistência

- `CONSISTENT`: todos os testes apontam para a mesma classe.
- `MOSTLY_CONSISTENT`: há divergência, mas pelo menos 75% dos testes apontam para a classe dominante.
- `INCONSISTENT`: menos de 75% dos testes concordam com a classe dominante.

Em caso de empate, a função de moda escolhe a menor classe apenas para manter o resultado determinístico. Um empate continua classificado como inconsistente.

## Inferência e limites

O relatório `confidence_inference.csv` estima a média do `confidence_score` por grupo de consistência e usa `média ± 1,96 × erro padrão` como intervalo de 95%. Isso é uma aproximação normal didática, não uma validação clínica ou industrial.

Os dados são inteiramente fictícios. O `confidence_score` mede a confiança simulada do classificador, não a probabilidade de o equipamento estar realmente naquela condição. Para validar um modelo real seria necessário comparar as previsões com uma referência confiável de manutenção ou inspeção.
