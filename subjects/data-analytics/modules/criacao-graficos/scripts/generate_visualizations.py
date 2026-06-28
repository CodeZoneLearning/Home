"""Generate the dataset and chart outputs for the chart creation lesson."""

from __future__ import annotations

import random
from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd
import plotly.express as px
import seaborn as sns


ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "data" / "learning_activity.csv"
OUTPUT_DIR = ROOT / "outputs"

TRACKS = {
    "Python": {"base_hours": 4.3, "score_bias": 5, "completion_bias": 0.06},
    "Dados": {"base_hours": 4.8, "score_bias": 7, "completion_bias": 0.08},
    "Machine Learning": {"base_hours": 5.5, "score_bias": 3, "completion_bias": 0.02},
    "GenAI": {"base_hours": 4.1, "score_bias": 4, "completion_bias": 0.04},
}

PALETTE = {
    "Python": "#2d36d7",
    "Dados": "#00a884",
    "Machine Learning": "#f2b705",
    "GenAI": "#e85d75",
}


def clamp(value: float, lower: float, upper: float) -> float:
    return max(lower, min(upper, value))


def build_dataset() -> pd.DataFrame:
    rng = random.Random(42)
    rows: list[dict[str, object]] = []

    for week in range(1, 9):
        for track, profile in TRACKS.items():
            for learner in range(1, 7):
                study_hours = clamp(
                    rng.normalvariate(profile["base_hours"] + week * 0.18, 0.75),
                    1.2,
                    8.5,
                )
                practice_tasks = int(clamp(round(study_hours * 1.45 + rng.normalvariate(0, 1.3)), 1, 14))
                support_requests = int(clamp(round(rng.normalvariate(3.0 - study_hours * 0.25, 1.0)), 0, 6))
                completion_rate = clamp(
                    0.36
                    + week * 0.045
                    + study_hours * 0.045
                    + practice_tasks * 0.012
                    + profile["completion_bias"]
                    + rng.normalvariate(0, 0.055),
                    0.18,
                    0.99,
                )
                challenge_score = clamp(
                    44
                    + week * 2.1
                    + study_hours * 4.3
                    + practice_tasks * 0.9
                    + profile["score_bias"]
                    - support_requests * 1.8
                    + rng.normalvariate(0, 5.2),
                    30,
                    100,
                )
                satisfaction = clamp(
                    2.6
                    + completion_rate * 1.55
                    + challenge_score / 100
                    - support_requests * 0.09
                    + rng.normalvariate(0, 0.22),
                    1.0,
                    5.0,
                )

                rows.append(
                    {
                        "week": week,
                        "learner_id": f"L{week:02d}-{track[:2].upper()}-{learner:02d}",
                        "track": track,
                        "study_hours": round(study_hours, 2),
                        "practice_tasks": practice_tasks,
                        "completion_rate": round(completion_rate, 3),
                        "challenge_score": round(challenge_score, 1),
                        "support_requests": support_requests,
                        "satisfaction": round(satisfaction, 2),
                    }
                )

    return pd.DataFrame(rows)


def save_summary(df: pd.DataFrame) -> pd.DataFrame:
    summary = (
        df.groupby("track", as_index=False)
        .agg(
            learners=("learner_id", "count"),
            mean_study_hours=("study_hours", "mean"),
            mean_completion_rate=("completion_rate", "mean"),
            mean_challenge_score=("challenge_score", "mean"),
            mean_satisfaction=("satisfaction", "mean"),
            total_support_requests=("support_requests", "sum"),
        )
        .round(3)
    )
    summary.to_csv(OUTPUT_DIR / "chart_summary.csv", index=False)
    return summary


def plot_matplotlib_completion(summary: pd.DataFrame) -> None:
    ordered = summary.sort_values("mean_completion_rate", ascending=True)
    colors = [PALETTE[track] for track in ordered["track"]]

    fig, ax = plt.subplots(figsize=(9, 5.2))
    ax.barh(ordered["track"], ordered["mean_completion_rate"] * 100, color=colors)
    ax.set_title("Taxa media de conclusao por trilha", loc="left", fontsize=15, weight="bold")
    ax.set_xlabel("Conclusao media (%)")
    ax.set_ylabel("")
    ax.set_xlim(0, 100)
    ax.grid(axis="x", color="#dfe3ea", linewidth=0.8)
    ax.set_axisbelow(True)

    for index, value in enumerate(ordered["mean_completion_rate"] * 100):
        ax.text(value + 1.3, index, f"{value:.1f}%", va="center", fontsize=10)

    fig.tight_layout()
    fig.savefig(OUTPUT_DIR / "matplotlib_completion_by_track.png", dpi=180)
    plt.close(fig)


def plot_matplotlib_weekly_score(df: pd.DataFrame) -> None:
    weekly = df.groupby(["week", "track"], as_index=False)["challenge_score"].mean()

    fig, ax = plt.subplots(figsize=(9, 5.2))
    for track, group in weekly.groupby("track"):
        ax.plot(
            group["week"],
            group["challenge_score"],
            marker="o",
            linewidth=2.3,
            color=PALETTE[track],
            label=track,
        )

    ax.set_title("Evolucao da pontuacao media por semana", loc="left", fontsize=15, weight="bold")
    ax.set_xlabel("Semana")
    ax.set_ylabel("Pontuacao media do desafio")
    ax.set_xticks(range(1, 9))
    ax.grid(color="#dfe3ea", linewidth=0.8)
    ax.legend(frameon=False, ncol=2)
    fig.tight_layout()
    fig.savefig(OUTPUT_DIR / "matplotlib_weekly_score.png", dpi=180)
    plt.close(fig)


def plot_seaborn_hours_score(df: pd.DataFrame) -> None:
    fig, ax = plt.subplots(figsize=(9, 5.4))
    sns.scatterplot(
        data=df,
        x="study_hours",
        y="challenge_score",
        hue="track",
        palette=PALETTE,
        size="completion_rate",
        sizes=(30, 180),
        alpha=0.78,
        ax=ax,
    )
    sns.regplot(
        data=df,
        x="study_hours",
        y="challenge_score",
        scatter=False,
        color="#0d0f1a",
        line_kws={"linewidth": 2},
        ax=ax,
    )
    ax.set_title("Horas de estudo e desempenho", loc="left", fontsize=15, weight="bold")
    ax.set_xlabel("Horas de estudo na semana")
    ax.set_ylabel("Pontuacao do desafio")
    ax.grid(color="#e7ebf0", linewidth=0.8)
    ax.legend(frameon=False, bbox_to_anchor=(1.02, 1), loc="upper left")
    fig.tight_layout()
    fig.savefig(OUTPUT_DIR / "seaborn_hours_vs_score.png", dpi=180)
    plt.close(fig)


def plot_seaborn_correlation(df: pd.DataFrame) -> None:
    numeric = df[
        [
            "study_hours",
            "practice_tasks",
            "completion_rate",
            "challenge_score",
            "support_requests",
            "satisfaction",
        ]
    ]
    corr = numeric.corr()

    fig, ax = plt.subplots(figsize=(8.4, 6.2))
    sns.heatmap(
        corr,
        annot=True,
        fmt=".2f",
        cmap="vlag",
        center=0,
        square=True,
        linewidths=0.6,
        cbar_kws={"shrink": 0.76},
        ax=ax,
    )
    ax.set_title("Correlacao entre variaveis numericas", loc="left", fontsize=15, weight="bold")
    fig.tight_layout()
    fig.savefig(OUTPUT_DIR / "seaborn_correlation_heatmap.png", dpi=180)
    plt.close(fig)


def plot_plotly_dashboard(df: pd.DataFrame) -> None:
    figure = px.scatter(
        df,
        x="study_hours",
        y="challenge_score",
        color="track",
        size="completion_rate",
        hover_data=["week", "practice_tasks", "support_requests", "satisfaction"],
        color_discrete_map=PALETTE,
        title="Exploracao interativa: estudo, desempenho e conclusao",
        labels={
            "study_hours": "Horas de estudo",
            "challenge_score": "Pontuacao do desafio",
            "completion_rate": "Taxa de conclusao",
            "track": "Trilha",
        },
    )
    figure.update_layout(template="plotly_white", font_family="Inter, Arial, sans-serif")
    figure.write_html(OUTPUT_DIR / "plotly_learning_dashboard.html", include_plotlyjs="cdn")


def main() -> None:
    DATA_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    sns.set_theme(style="whitegrid", context="notebook")

    df = build_dataset()
    df.to_csv(DATA_PATH, index=False)

    summary = save_summary(df)
    plot_matplotlib_completion(summary)
    plot_matplotlib_weekly_score(df)
    plot_seaborn_hours_score(df)
    plot_seaborn_correlation(df)
    plot_plotly_dashboard(df)

    print(f"Dataset: {DATA_PATH}")
    print(f"Outputs: {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
