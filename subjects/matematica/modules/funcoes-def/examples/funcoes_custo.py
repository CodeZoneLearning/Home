"""Laboratorio de funcoes matematicas com def.

Execute:
    python funcoes_custo.py
"""


def custo_total(quantidade, custo_unitario, custo_fixo=0):
    if quantidade < 0 or custo_unitario < 0 or custo_fixo < 0:
        raise ValueError("custos e quantidade nao podem ser negativos")
    return custo_fixo + quantidade * custo_unitario


def receita(quantidade, preco_venda):
    if quantidade < 0 or preco_venda < 0:
        raise ValueError("quantidade e preco nao podem ser negativos")
    return quantidade * preco_venda


def lucro(quantidade, preco_venda, custo_unitario, custo_fixo=0):
    return receita(quantidade, preco_venda) - custo_total(quantidade, custo_unitario, custo_fixo)


def erro_quadratico(observado, previsto):
    return (observado - previsto) ** 2


def mse(observados, previstos):
    if len(observados) != len(previstos):
        raise ValueError("listas devem ter o mesmo tamanho")
    if not observados:
        raise ValueError("listas nao podem estar vazias")
    erros = [erro_quadratico(y, y_hat) for y, y_hat in zip(observados, previstos)]
    return sum(erros) / len(erros)


def resumo_cenario(quantidade):
    return {
        "quantidade": quantidade,
        "custo": custo_total(quantidade, custo_unitario=18.5, custo_fixo=850),
        "receita": receita(quantidade, preco_venda=31.0),
        "lucro": lucro(quantidade, preco_venda=31.0, custo_unitario=18.5, custo_fixo=850),
    }


if __name__ == "__main__":
    for quantidade in [60, 120, 180]:
        cenario = resumo_cenario(quantidade)
        print(
            f"q={cenario['quantidade']:>3} | "
            f"custo={cenario['custo']:>8.2f} | "
            f"receita={cenario['receita']:>8.2f} | "
            f"lucro={cenario['lucro']:>8.2f}"
        )

    observado = [100, 120, 140, 160]
    previsto = [96, 125, 133, 171]
    print(f"MSE das previsoes: {mse(observado, previsto):.2f}")
