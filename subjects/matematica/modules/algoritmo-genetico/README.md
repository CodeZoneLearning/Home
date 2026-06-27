# Algoritmo genético

Módulo de Matemática Aplicada sobre busca evolutiva em espaços discretos.

## Ideia matemática

Uma solução é representada por um cromossomo. No exemplo de mochila binária:

```text
x pertence a {0,1}^n
```

O objetivo é maximizar valor respeitando orçamento:

```text
max soma v_i x_i
sujeito a soma c_i x_i <= B
```

Uma forma prática de lidar com violações é usar fitness com penalidade:

```text
F(x) = soma v_i x_i - lambda * max(0, soma c_i x_i - B)^2
```

## Operadores

- **Seleção**: escolhe pais com maior fitness, por exemplo torneio.
- **Cruzamento**: combina partes de dois pais.
- **Mutação**: altera genes com probabilidade `p_m`.
- **Elitismo**: preserva alguns melhores candidatos.

## Exemplo

Execute:

```bash
python examples/algoritmo_genetico.py
```

O script resolve uma mochila pequena usando seleção por torneio, cruzamento de um ponto e mutação binária.
