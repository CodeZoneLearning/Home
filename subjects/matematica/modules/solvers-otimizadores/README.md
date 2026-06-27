# Solvers e otimizadores

Módulo de Matemática Aplicada sobre algoritmos de busca e otimização.

## Métodos abordados

- **Dijkstra**: menor caminho em grafos com custos não negativos.
- **A\***: menor caminho usando `f(n) = g(n) + h(n)`, onde `h` é uma heurística.
- **Algoritmo genético**: busca aproximada por população, seleção, cruzamento e mutação.
- **Solver genérico**: contrato comum com estado, vizinhos, custo e critério de parada.

## Objetivos

- Entender quando um problema pode ser tratado como grafo.
- Comparar Dijkstra e A* pelo custo acumulado e número de expansões.
- Entender o papel de uma heurística admissível em A*.
- Usar algoritmo genético quando a busca direta, exata ou por gradiente não for prática.

## Exemplo

Execute:

```bash
python examples/solvers_otimizadores.py
```

O arquivo usa apenas biblioteca padrão e imprime:

- menor caminho por Dijkstra;
- menor caminho por A*;
- melhor candidato encontrado pelo algoritmo genético.
