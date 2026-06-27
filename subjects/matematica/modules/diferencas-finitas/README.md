# Diferenças finitas

Módulo de Matemática Aplicada sobre discretização de derivadas e montagem de sistemas lineares.

## Objetivos

- Entender diferenças finitas como aproximações locais em uma malha.
- Resolver o caso 1D com uma incógnita usando `A x = b`, portanto `x = b / A`.
- Expandir a ideia para vários pontos internos, onde `A` vira matriz.
- Mostrar o stencil 2D de cinco pontos: centro, esquerda, direita, baixo e cima.
- Separar o processo em malha, montagem de `A` e `b`, e solução do sistema.

## Exemplo

Execute:

```bash
python examples/diferencas_finitas.py
```

O arquivo usa apenas biblioteca padrão e inclui:

- caso escalar 1D;
- barra 1D com três pontos internos;
- ponto central 2D;
- placa 2D pequena com quatro incógnitas.
