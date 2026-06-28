"""Generate a standalone Plotly dashboard for the dashboard lesson."""

from __future__ import annotations

from pathlib import Path

import pandas as pd
import plotly.graph_objects as go
from plotly.subplots import make_subplots


ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "data" / "learning_activity.csv"
OUTPUT_DIR = ROOT / "outputs"

PALETTE = {
    "Python": "#2d36d7",
    "Dados": "#00a884",
    "Machine Learning": "#f2b705",
    "GenAI": "#e85d75",
}


def load_data() -> pd.DataFrame:
    data = pd.read_csv(DATA_PATH)
    required_columns = {
        "week",
        "learner_id",
        "track",
        "study_hours",
        "practice_tasks",
        "completion_rate",
        "challenge_score",
        "support_requests",
        "satisfaction",
    }
    missing = required_columns.difference(data.columns)
    if missing:
        raise ValueError(f"Missing columns: {sorted(missing)}")
    return data


def build_summary(data: pd.DataFrame) -> pd.DataFrame:
    summary = (
        data.groupby("track", as_index=False)
        .agg(
            learners=("learner_id", "nunique"),
            mean_study_hours=("study_hours", "mean"),
            mean_completion_rate=("completion_rate", "mean"),
            mean_challenge_score=("challenge_score", "mean"),
            mean_satisfaction=("satisfaction", "mean"),
            total_support_requests=("support_requests", "sum"),
        )
        .sort_values("mean_completion_rate", ascending=False)
    )
    return summary.round(3)


def build_weekly(data: pd.DataFrame) -> pd.DataFrame:
    return (
        data.groupby(["week", "track"], as_index=False)
        .agg(
            mean_score=("challenge_score", "mean"),
            mean_completion=("completion_rate", "mean"),
            mean_hours=("study_hours", "mean"),
            support_requests=("support_requests", "sum"),
        )
    )


def build_dashboard(data: pd.DataFrame, summary: pd.DataFrame, weekly: pd.DataFrame) -> go.Figure:
    figure = make_subplots(
        rows=3,
        cols=4,
        specs=[
            [{"type": "indicator"}, {"type": "indicator"}, {"type": "indicator"}, {"type": "indicator"}],
            [{"type": "bar", "colspan": 2}, None, {"type": "scatter", "colspan": 2}, None],
            [{"type": "scatter", "colspan": 2}, None, {"type": "heatmap", "colspan": 2}, None],
        ],
        subplot_titles=(
            "",
            "",
            "",
            "",
            "Conclusao media por trilha",
            "Evolucao semanal da pontuacao",
            "Horas de estudo x desempenho",
            "Correlacao entre metricas",
        ),
        vertical_spacing=0.12,
        horizontal_spacing=0.07,
    )

    figure.add_trace(
        go.Indicator(mode="number", value=int(data["learner_id"].nunique()), title={"text": "participantes"}),
        row=1,
        col=1,
    )
    figure.add_trace(
        go.Indicator(
            mode="number",
            value=float(data["completion_rate"].mean() * 100),
            number={"suffix": "%", "valueformat": ".1f"},
            title={"text": "conclusao media"},
        ),
        row=1,
        col=2,
    )
    figure.add_trace(
        go.Indicator(
            mode="number",
            value=float(data["challenge_score"].mean()),
            number={"valueformat": ".1f"},
            title={"text": "pontuacao media"},
        ),
        row=1,
        col=3,
    )
    figure.add_trace(
        go.Indicator(
            mode="number",
            value=int(data["support_requests"].sum()),
            title={"text": "pedidos de suporte"},
        ),
        row=1,
        col=4,
    )

    ordered = summary.sort_values("mean_completion_rate", ascending=True)
    figure.add_trace(
        go.Bar(
            x=ordered["mean_completion_rate"] * 100,
            y=ordered["track"],
            orientation="h",
            marker_color=[PALETTE[track] for track in ordered["track"]],
            text=[f"{value:.1f}%" for value in ordered["mean_completion_rate"] * 100],
            textposition="outside",
            hovertemplate="<b>%{y}</b><br>Conclusao: %{x:.1f}%<extra></extra>",
            name="Conclusao",
            showlegend=False,
        ),
        row=2,
        col=1,
    )

    for track, group in weekly.groupby("track"):
        figure.add_trace(
            go.Scatter(
                x=group["week"],
                y=group["mean_score"],
                mode="lines+markers",
                line={"color": PALETTE[track], "width": 2.4},
                marker={"size": 7},
                name=track,
                legendgroup=track,
                hovertemplate=f"<b>{track}</b><br>Semana: %{{x}}<br>Pontuacao: %{{y:.1f}}<extra></extra>",
            ),
            row=2,
            col=3,
        )

    for track, group in data.groupby("track"):
        figure.add_trace(
            go.Scatter(
                x=group["study_hours"],
                y=group["challenge_score"],
                mode="markers",
                marker={
                    "color": PALETTE[track],
                    "size": group["completion_rate"] * 18,
                    "opacity": 0.72,
                    "line": {"color": "white", "width": 0.8},
                },
                name=f"{track} · pontos",
                legendgroup=track,
                showlegend=False,
                customdata=group[["week", "practice_tasks", "completion_rate", "satisfaction"]],
                hovertemplate=(
                    f"<b>{track}</b><br>"
                    "Horas: %{x:.2f}<br>"
                    "Pontuacao: %{y:.1f}<br>"
                    "Semana: %{customdata[0]}<br>"
                    "Tarefas: %{customdata[1]}<br>"
                    "Conclusao: %{customdata[2]:.1%}<br>"
                    "Satisfacao: %{customdata[3]:.2f}<extra></extra>"
                ),
            ),
            row=3,
            col=1,
        )

    numeric = data[
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
    figure.add_trace(
        go.Heatmap(
            z=corr.values,
            x=corr.columns,
            y=corr.columns,
            zmin=-1,
            zmax=1,
            colorscale="RdBu",
            reversescale=True,
            text=corr.round(2).astype(str).values,
            texttemplate="%{text}",
            hovertemplate="%{y} x %{x}<br>correlacao: %{z:.2f}<extra></extra>",
            colorbar={"title": "r"},
            showscale=True,
        ),
        row=3,
        col=3,
    )

    figure.update_layout(
        title={
            "text": "Learning Analytics Dashboard · Plotly",
            "x": 0.02,
            "xanchor": "left",
            "font": {"size": 26},
        },
        height=1040,
        margin={"l": 64, "r": 34, "t": 105, "b": 60},
        template="plotly_white",
        legend={"orientation": "h", "yanchor": "bottom", "y": 1.02, "xanchor": "right", "x": 1},
        font={"family": "Inter, Arial, sans-serif", "color": "#0d0f1a"},
        paper_bgcolor="#f5f7fa",
        plot_bgcolor="#ffffff",
    )
    figure.update_xaxes(showgrid=True, gridcolor="#e4e8ef")
    figure.update_yaxes(showgrid=True, gridcolor="#e4e8ef")
    figure.update_xaxes(title_text="Conclusao media (%)", range=[0, 105], row=2, col=1)
    figure.update_xaxes(title_text="Semana", dtick=1, row=2, col=3)
    figure.update_yaxes(title_text="Pontuacao media", row=2, col=3)
    figure.update_xaxes(title_text="Horas de estudo", row=3, col=1)
    figure.update_yaxes(title_text="Pontuacao do desafio", row=3, col=1)

    buttons = [
        {
            "label": "Todas as trilhas",
            "method": "update",
            "args": [{"visible": [True] * len(figure.data)}],
        }
    ]
    for track in PALETTE:
        visible = []
        for trace in figure.data:
            trace_name = trace.name or ""
            if trace.type in {"indicator", "bar", "heatmap"}:
                visible.append(True)
            else:
                visible.append(trace.legendgroup == track or trace_name.startswith(track))
        buttons.append({"label": track, "method": "update", "args": [{"visible": visible}]})

    figure.update_layout(
        updatemenus=[
            {
                "type": "dropdown",
                "direction": "down",
                "x": 0.02,
                "y": 1.085,
                "buttons": buttons,
                "showactive": True,
            }
        ],
        annotations=[
            *figure.layout.annotations,
            {
                "text": "Use a legenda e o filtro para isolar trilhas. O dashboard combina leitura executiva e exploracao.",
                "xref": "paper",
                "yref": "paper",
                "x": 0.02,
                "y": 1.045,
                "showarrow": False,
                "font": {"size": 12, "color": "#5f6878"},
            },
        ],
    )

    return figure


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    data = load_data()
    summary = build_summary(data)
    weekly = build_weekly(data)
    figure = build_dashboard(data, summary, weekly)

    summary.to_csv(OUTPUT_DIR / "dashboard_summary.csv", index=False)
    weekly.round(3).to_csv(OUTPUT_DIR / "weekly_summary.csv", index=False)
    figure.write_html(
        OUTPUT_DIR / "learning_analytics_dashboard.html",
        include_plotlyjs="cdn",
        full_html=True,
        config={"displaylogo": False, "responsive": True},
    )

    print(f"Dashboard: {OUTPUT_DIR / 'learning_analytics_dashboard.html'}")
    print(f"Summary: {OUTPUT_DIR / 'dashboard_summary.csv'}")


if __name__ == "__main__":
    main()
