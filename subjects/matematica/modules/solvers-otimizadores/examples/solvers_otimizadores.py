"""Laboratorio de solvers e otimizadores.

Inclui tres ideias:
- Dijkstra: menor caminho com pesos nao negativos.
- A*: menor caminho guiado por heuristica.
- Algoritmo genetico: busca aproximada por populacao, selecao, cruzamento e mutacao.
"""

from heapq import heappop, heappush
from math import hypot
from random import Random


GRAPH = {
    "A": [("B", 2), ("C", 5)],
    "B": [("A", 2), ("D", 2), ("E", 6)],
    "C": [("A", 5), ("D", 1), ("F", 8)],
    "D": [("B", 2), ("C", 1), ("E", 2), ("F", 3)],
    "E": [("B", 6), ("D", 2), ("G", 3)],
    "F": [("C", 8), ("D", 3), ("G", 1)],
    "G": [("E", 3), ("F", 1)],
}

POSITIONS = {
    "A": (0, 0),
    "B": (1, 0),
    "C": (1, 3),
    "D": (2, 0),
    "E": (3, 2),
    "F": (3, 0),
    "G": (4, 0),
}


def reconstruct_path(previous, start, goal):
    path = [goal]
    node = goal
    while node != start:
        node = previous[node]
        path.append(node)
    return list(reversed(path))


def dijkstra(graph, start, goal):
    queue = [(0, start)]
    costs = {start: 0}
    previous = {}
    visited = set()

    while queue:
        cost, node = heappop(queue)
        if node in visited:
            continue
        visited.add(node)
        if node == goal:
            break

        for neighbor, edge_cost in graph[node]:
            new_cost = cost + edge_cost
            if neighbor not in costs or new_cost < costs[neighbor]:
                costs[neighbor] = new_cost
                previous[neighbor] = node
                heappush(queue, (new_cost, neighbor))

    return reconstruct_path(previous, start, goal), costs[goal], len(visited)


def euclidean_to_goal(node, goal):
    x, y = POSITIONS[node]
    gx, gy = POSITIONS[goal]
    return hypot(gx - x, gy - y)


def astar(graph, start, goal, heuristic):
    queue = [(0, start)]
    costs = {start: 0}
    previous = {}
    visited = set()

    while queue:
        _, node = heappop(queue)
        if node in visited:
            continue
        visited.add(node)
        if node == goal:
            break

        for neighbor, edge_cost in graph[node]:
            new_cost = costs[node] + edge_cost
            if neighbor not in costs or new_cost < costs[neighbor]:
                costs[neighbor] = new_cost
                previous[neighbor] = node
                priority = new_cost + heuristic(neighbor, goal)
                heappush(queue, (priority, neighbor))

    return reconstruct_path(previous, start, goal), costs[goal], len(visited)


def genetic_optimizer(target=73, mutation_rate=0.2, generations=40, seed=42):
    rng = Random(seed)

    def clamp(value):
        return max(0, min(100, round(value)))

    def fitness(value):
        return -abs(value - target)

    population = [rng.randint(0, 100) for _ in range(18)]

    for _ in range(generations):
        population.sort(key=fitness, reverse=True)
        elite = population[:6]
        next_population = elite[:3]

        while len(next_population) < len(population):
            parent_a = rng.choice(elite)
            parent_b = rng.choice(elite)
            child = (parent_a + parent_b) / 2
            if rng.random() < mutation_rate:
                child += rng.randint(-12, 12)
            next_population.append(clamp(child))

        population = next_population

    population.sort(key=fitness, reverse=True)
    best = population[0]
    return best, fitness(best), abs(best - target)


if __name__ == "__main__":
    path, cost, expansions = dijkstra(GRAPH, "A", "G")
    print("Dijkstra:", " -> ".join(path), f"| custo={cost}", f"| expansoes={expansions}")

    path, cost, expansions = astar(GRAPH, "A", "G", euclidean_to_goal)
    print("A*:      ", " -> ".join(path), f"| custo={cost}", f"| expansoes={expansions}")

    best, fitness, error = genetic_optimizer(target=73, mutation_rate=0.2, generations=40)
    print("Genetico:", f"melhor={best}", f"| fitness={fitness}", f"| erro={error}")
