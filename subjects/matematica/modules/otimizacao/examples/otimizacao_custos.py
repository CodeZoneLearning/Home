"""Laboratorio de otimizacao de uma funcao de custo.

Execute:
    python otimizacao_custos.py
"""


def custo(q, fixo=900.0, custo_unitario=17.5, alvo=140.0, penalidade=0.08):
    """Custo operacional com penalidade por afastamento da demanda alvo."""
    return fixo + custo_unitario * q + penalidade * (q - alvo) ** 2


def gradiente_custo(q, custo_unitario=17.5, alvo=140.0, penalidade=0.08):
    """Derivada da funcao custo em relacao a q."""
    return custo_unitario + 2 * penalidade * (q - alvo)


def busca_em_grade(funcao, inicio, fim, passo):
    melhor_x = inicio
    melhor_custo = funcao(inicio)
    x = inicio
    while x <= fim:
        valor = funcao(x)
        if valor < melhor_custo:
            melhor_x = x
            melhor_custo = valor
        x += passo
    return melhor_x, melhor_custo


def busca_ternaria(funcao, inicio, fim, iteracoes=80):
    esquerda = inicio
    direita = fim
    for _ in range(iteracoes):
        meio_1 = esquerda + (direita - esquerda) / 3
        meio_2 = direita - (direita - esquerda) / 3
        if funcao(meio_1) < funcao(meio_2):
            direita = meio_2
        else:
            esquerda = meio_1
    x = (esquerda + direita) / 2
    return x, funcao(x)


def descida_gradiente(inicial, taxa=0.08, passos=60):
    q = inicial
    for _ in range(passos):
        q -= taxa * gradiente_custo(q)
    return q, custo(q)


if __name__ == "__main__":
    metodos = {
        "grade passo 1": busca_em_grade(custo, 0, 300, 1),
        "ternaria": busca_ternaria(custo, 0, 300),
        "gradiente": descida_gradiente(inicial=20, taxa=0.08, passos=60),
    }

    for nome, (q, valor) in metodos.items():
        print(f"{nome:>13}: q={q:8.3f} | custo={valor:10.2f}")

    print("\nCuidado: se a penalidade for pequena, produzir perto do alvo pode nao ser a decisao de menor custo.")
