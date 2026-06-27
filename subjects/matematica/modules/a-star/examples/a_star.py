"""A* para menor caminho com heuristica euclidiana."""

from heapq import heappop, heappush
from math import hypot


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


def reconstruct(previous, start, goal):
    path = [goal]
    node = goal
    while node != start:
        node = previous[node]
        path.append(node)
    return list(reversed(path))


def euclidean(node, goal):
    x, y = POSITIONS[node]
    gx, gy = POSITIONS[goal]
    return hypot(gx - x, gy - y)


def a_star(graph, start, goal, heuristic, alpha=1.0):
    queue = [(0, start)]
    costs = {start: 0}
    previous = {}
    expanded = set()

    while queue:
        _, node = heappop(queue)
        if node in expanded:
            continue
        expanded.add(node)
        if node == goal:
            break

        for neighbor, edge_cost in graph[node]:
            candidate = costs[node] + edge_cost
            if candidate < costs.get(neighbor, float("inf")):
                costs[neighbor] = candidate
                previous[neighbor] = node
                priority = candidate + alpha * heuristic(neighbor, goal)
                heappush(queue, (priority, neighbor))

    return reconstruct(previous, start, goal), costs[goal], len(expanded)


if __name__ == "__main__":
    for alpha in [0.0, 1.0, 1.5]:
        path, cost, expansions = a_star(GRAPH, "A", "G", euclidean, alpha=alpha)
        label = "Dijkstra" if alpha == 0 else f"A* alpha={alpha}"
        print(label)
        print("  caminho:", " -> ".join(path))
        print("  custo:", cost)
        print("  expansoes:", expansions)
