# A*

Módulo de Matemática Aplicada sobre busca heurística para menor caminho.

## Ideia matemática

A* usa a prioridade:

```text
f(n) = g(n) + h(n)
```

- `g(n)`: custo real acumulado desde a origem.
- `h(n)`: estimativa do custo restante até o objetivo.
- `f(n)`: prioridade usada na fila.

Se `h(n)=0`, A* vira Dijkstra. Se `h` é admissível, ou seja, `0 <= h(n) <= h*(n)`, A* preserva a garantia de caminho ótimo.

## Consistência

Uma heurística consistente respeita:

```text
h(u) <= w(u,v) + h(v)
```

Essa condição funciona como desigualdade triangular e evita reabrir nós em muitas implementações.

## Exemplo

Execute:

```bash
python examples/a_star.py
```

O script compara Dijkstra (`h=0`) com A* usando uma heurística euclidiana.
