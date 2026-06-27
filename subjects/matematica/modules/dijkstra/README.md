# Dijkstra

Módulo de Matemática Aplicada sobre menor caminho em grafos ponderados com custos não negativos.

## Ideia matemática

Modele o problema como `G = (V, E)` e uma função de peso `w(u,v) >= 0`.
O objetivo é encontrar:

```text
dist(s,t) = min soma w(e), para todo caminho de s até t
```

Dijkstra mantém uma estimativa `d[v]` para cada nó. A cada passo, finaliza o nó com menor `d` na fronteira e relaxa suas arestas:

```text
d[v] <- min(d[v], d[u] + w(u,v))
```

## Quando usar

- Grafo com pesos não negativos.
- Necessidade de caminho ótimo garantido.
- Ausência de heurística confiável para guiar a busca.

## Exemplo

Execute:

```bash
python examples/dijkstra.py
```

O script imprime o caminho mínimo, o custo total, as distâncias finais e a quantidade de nós finalizados.
