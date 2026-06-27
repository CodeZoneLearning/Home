"""Particle Swarm Optimization em uma funcao 2D simples."""

from random import Random
from math import hypot


def objective(position):
    x, y = position
    return (x - 3) ** 2 + (y + 2) ** 2


def clamp(value, minimum, maximum):
    return max(minimum, min(maximum, value))


def pso(
    particle_count=24,
    iterations=45,
    omega=0.65,
    c1=1.4,
    c2=1.6,
    seed=42,
):
    rng = Random(seed)
    particles = []

    for _ in range(particle_count):
        position = [rng.uniform(-8, 8), rng.uniform(-8, 8)]
        velocity = [rng.uniform(-1, 1), rng.uniform(-1, 1)]
        particles.append({
            "position": position,
            "velocity": velocity,
            "best": position[:],
            "best_cost": objective(position),
        })

    global_best = min(particles, key=lambda particle: particle["best_cost"])
    global_position = global_best["best"][:]
    global_cost = global_best["best_cost"]

    for _ in range(iterations):
        for particle in particles:
            for dim in range(2):
                r1 = rng.random()
                r2 = rng.random()
                cognitive = c1 * r1 * (particle["best"][dim] - particle["position"][dim])
                social = c2 * r2 * (global_position[dim] - particle["position"][dim])
                particle["velocity"][dim] = clamp(
                    omega * particle["velocity"][dim] + cognitive + social,
                    -3,
                    3,
                )
                particle["position"][dim] = clamp(
                    particle["position"][dim] + particle["velocity"][dim],
                    -8,
                    8,
                )

            cost = objective(particle["position"])
            if cost < particle["best_cost"]:
                particle["best"] = particle["position"][:]
                particle["best_cost"] = cost

            if cost < global_cost:
                global_position = particle["position"][:]
                global_cost = cost

    return global_position, global_cost


if __name__ == "__main__":
    position, cost = pso()
    distance = hypot(position[0] - 3, position[1] + 2)

    print("Melhor posicao:", tuple(round(value, 4) for value in position))
    print("Custo:", round(cost, 8))
    print("Distancia ate o otimo conhecido:", round(distance, 8))
