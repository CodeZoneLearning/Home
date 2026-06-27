"""Algoritmo genetico para uma mochila binaria pequena."""

from random import Random


ITEMS = [
    ("Sensor extra", 6, 13),
    ("Pipeline", 9, 22),
    ("Monitoramento", 7, 18),
    ("Treinamento", 11, 25),
    ("Backup", 5, 9),
    ("Dashboard", 8, 19),
    ("Teste A/B", 10, 21),
    ("Automacao", 12, 28),
]


def evaluate(chromosome, budget):
    cost = sum(gene * item[1] for gene, item in zip(chromosome, ITEMS))
    value = sum(gene * item[2] for gene, item in zip(chromosome, ITEMS))
    overflow = max(0, cost - budget)
    fitness = value - 4 * overflow**2
    return {"cost": cost, "value": value, "overflow": overflow, "fitness": fitness}


def genetic_knapsack(budget=28, mutation_rate=0.12, generations=60, seed=42):
    rng = Random(seed)
    length = len(ITEMS)
    population_size = 34
    population = [
        [1 if rng.random() < 0.5 else 0 for _ in range(length)]
        for _ in range(population_size)
    ]

    def tournament():
        competitors = rng.sample(population, 3)
        return max(competitors, key=lambda chromosome: evaluate(chromosome, budget)["fitness"])

    def crossover(parent_a, parent_b):
        cut = rng.randint(1, length - 1)
        return parent_a[:cut] + parent_b[cut:]

    def mutate(chromosome):
        return [
            1 - gene if rng.random() < mutation_rate else gene
            for gene in chromosome
        ]

    for _ in range(generations):
        population.sort(key=lambda chromosome: evaluate(chromosome, budget)["fitness"], reverse=True)
        next_population = population[:3]

        while len(next_population) < population_size:
            child = crossover(tournament(), tournament())
            next_population.append(mutate(child))

        population = next_population

    feasible = [
        chromosome for chromosome in population
        if evaluate(chromosome, budget)["overflow"] == 0
    ]
    candidates = feasible or population
    best = max(candidates, key=lambda chromosome: evaluate(chromosome, budget)["fitness"])
    return best, evaluate(best, budget)


if __name__ == "__main__":
    chromosome, score = genetic_knapsack()
    selected = [name for gene, (name, _, _) in zip(chromosome, ITEMS) if gene]

    print("Cromossomo:", chromosome)
    print("Itens:", ", ".join(selected))
    print("Custo:", score["cost"])
    print("Valor:", score["value"])
    print("Fitness:", score["fitness"])
