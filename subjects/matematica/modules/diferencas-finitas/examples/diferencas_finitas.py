"""Laboratorio de diferencas finitas.

A ideia central e montar um sistema linear:

    A x = b

Quando existe uma unica incognita, A e escalar e a solucao e x = b / A.
Quando existem varias incognitas, A e matriz e resolvemos o sistema linear.
"""


def resolver_escalar(A, b):
    if A == 0:
        raise ValueError("A nao pode ser zero.")
    return b / A


def ponto_1d_escalar(esquerda, direita, fonte, h=1.0):
    """Resolve um ponto interno para -u'' = fonte."""
    A = 2 / h**2
    b = fonte + (esquerda + direita) / h**2
    return A, b, resolver_escalar(A, b)


def resolver_tridiagonal(inferior, diagonal, superior, b):
    """Algoritmo de Thomas para sistemas tridiagonais."""
    n = len(diagonal)
    c = superior[:]
    d = diagonal[:]
    r = b[:]

    for i in range(1, n):
        fator = inferior[i - 1] / d[i - 1]
        d[i] -= fator * c[i - 1]
        r[i] -= fator * r[i - 1]

    x = [0.0] * n
    x[-1] = r[-1] / d[-1]
    for i in range(n - 2, -1, -1):
        x[i] = (r[i] - c[i] * x[i + 1]) / d[i]
    return x


def diferencas_1d(n, esquerda, direita, fonte=0.0, comprimento=1.0):
    """Monta e resolve uma barra 1D com n pontos internos."""
    h = comprimento / (n + 1)
    diagonal = [2 / h**2 for _ in range(n)]
    superior = [-1 / h**2 for _ in range(n - 1)]
    inferior = [-1 / h**2 for _ in range(n - 1)]
    b = [fonte for _ in range(n)]
    b[0] += esquerda / h**2
    b[-1] += direita / h**2
    return resolver_tridiagonal(inferior, diagonal, superior, b)


def ponto_central_2d(oeste, leste, sul, norte, fonte, h=1.0):
    """Resolve um unico ponto interno para -Delta u = fonte."""
    A = 4 / h**2
    b = fonte + (oeste + leste + sul + norte) / h**2
    return A, b, resolver_escalar(A, b)


def resolver_gauss(A, b):
    """Eliminacao gaussiana simples para matrizes pequenas."""
    n = len(b)
    M = [linha[:] + [valor] for linha, valor in zip(A, b)]

    for coluna in range(n):
        pivo = max(range(coluna, n), key=lambda linha: abs(M[linha][coluna]))
        if abs(M[pivo][coluna]) < 1e-12:
            raise ValueError("Sistema singular ou quase singular.")
        M[coluna], M[pivo] = M[pivo], M[coluna]

        for linha in range(coluna + 1, n):
            fator = M[linha][coluna] / M[coluna][coluna]
            for k in range(coluna, n + 1):
                M[linha][k] -= fator * M[coluna][k]

    x = [0.0] * n
    for linha in range(n - 1, -1, -1):
        soma = sum(M[linha][coluna] * x[coluna] for coluna in range(linha + 1, n))
        x[linha] = (M[linha][n] - soma) / M[linha][linha]
    return x


def diferencas_2d(nx, ny, bordas, fonte=0.0, h=1.0):
    """Monta uma malha 2D pequena com contornos constantes."""
    total = nx * ny
    A = [[0.0 for _ in range(total)] for _ in range(total)]
    b = [fonte for _ in range(total)]

    def idx(i, j):
        return j * nx + i

    for j in range(ny):
        for i in range(nx):
            linha = idx(i, j)
            A[linha][linha] = 4 / h**2

            vizinhos = [
                (i - 1, j, "oeste"),
                (i + 1, j, "leste"),
                (i, j - 1, "sul"),
                (i, j + 1, "norte"),
            ]
            for vi, vj, lado in vizinhos:
                if 0 <= vi < nx and 0 <= vj < ny:
                    A[linha][idx(vi, vj)] = -1 / h**2
                else:
                    b[linha] += bordas[lado] / h**2

    return resolver_gauss(A, b)


if __name__ == "__main__":
    A, b, x = ponto_1d_escalar(esquerda=20, direita=80, fonte=10)
    print(f"1D escalar: A={A:.2f}, b={b:.2f}, x={x:.2f}")

    barra = diferencas_1d(n=3, esquerda=20, direita=80, fonte=10, comprimento=4)
    print("1D com 3 pontos:", [round(valor, 2) for valor in barra])

    A2, b2, centro = ponto_central_2d(oeste=20, leste=80, sul=30, norte=70, fonte=0)
    print(f"2D centro:   A={A2:.2f}, b={b2:.2f}, x={centro:.2f}")

    placa = diferencas_2d(
        nx=2,
        ny=2,
        bordas={"oeste": 20, "leste": 80, "sul": 30, "norte": 70},
        fonte=0,
    )
    print("2D 2x2:", [round(valor, 2) for valor in placa])
