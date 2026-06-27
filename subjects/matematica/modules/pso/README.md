# PSO

Módulo de Matemática Aplicada sobre Particle Swarm Optimization.

## Ideia matemática

PSO minimiza uma função em espaço contínuo:

```text
min f(x), com x em R^d
```

Cada partícula guarda:

- `x_i`: posição atual;
- `v_i`: velocidade;
- `p_i`: melhor posição pessoal;
- `g`: melhor posição global do enxame.

## Equações

```text
v_i(t+1) = omega v_i(t) + c1 r1 (p_i - x_i) + c2 r2 (g - x_i)
x_i(t+1) = x_i(t) + v_i(t+1)
```

- `omega`: inércia.
- `c1`: peso cognitivo.
- `c2`: peso social.
- `r1`, `r2`: números aleatórios em `[0,1]`.

## Exemplo

Execute:

```bash
python examples/pso.py
```

O script minimiza `f(x,y) = (x - 3)^2 + (y + 2)^2`, cujo ótimo conhecido é `(3,-2)`.
