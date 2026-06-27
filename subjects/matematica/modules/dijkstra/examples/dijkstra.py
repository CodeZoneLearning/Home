"""Dijkstra para menor caminho com pesos nao negativos."""

from heapq import heappop, heappush


GRAPH = {
    "A": [("B", 2), ("C", 5)],
    "B": [("A", 2), ("D", 2), ("E", 6)],
    "C": [("A", 5), ("D", 1), ("F", 8)],
    "D": [("B", 2), ("C", 1), ("E", 2), ("F", 3)],
    "E": [("B", 6), ("D", 2), ("G", 3)],
    "F": [("C", 8), ("D", 3), ("G", 1)],
    "G": [("E", 3), ("F", 1)],
}


def reconstruct(previous, start, goal):
    path = [goal]
    node = goal
    while node != start:
        node = previous[node]
        path.append(node)
    return list(reversed(path))


def dijkstra(graph, start, goal):
    queue = [(0, start)]
    distances = {start: 0}
    previous = {}
    finalized = set()

    while queue:
        cost, node = heappop(queue)
        if node in finalized:
            continue
        finalized.add(node)

        if node == goal:
            break

        for neighbor, edge_cost in graph[node]:
            candidate = cost + edge_cost
            if candidate < distances.get(neighbor, float("inf")):
                distances[neighbor] = candidate
                previous[neighbor] = node
                heappush(queue, (candidate, neighbor))

    return reconstruct(previous, start, goal), distances[goal], distances, len(finalized)


if __name__ == "__main__":
    path, cost, distances, finalized_count = dijkstra(GRAPH, "A", "G")

    print("Caminho:", " -> ".join(path))
    print("Custo total:", cost)
    print("Nos finalizados:", finalized_count)
    print("Distancias finais:")
    for node, distance in sorted(distances.items()):
        print(f"  d[{node}] = {distance}")
