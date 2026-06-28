"""Streamlit data app for the Code Zone learning activity dataset."""

from __future__ import annotations

from io import BytesIO
from pathlib import Path

import pandas as pd
import plotly.express as px
import streamlit as st


ROOT = Path(__file__).resolve().parent
DEFAULT_DATA_PATH = ROOT / "data" / "learning_activity.csv"

REQUIRED_COLUMNS = {
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

PALETTE = {
    "Python": "#2d36d7",
    "Dados": "#00a884",
    "Machine Learning": "#f2b705",
    "GenAI": "#e85d75",
}


st.set_page_config(
    page_title="Code Zone | Learning Analytics",
    layout="wide",
)


@st.cache_data(show_spinner=False)
def load_default_data(path: str) -> pd.DataFrame:
    return pd.read_csv(path)


@st.cache_data(show_spinner=False)
def load_uploaded_data(file_bytes: bytes) -> pd.DataFrame:
    return pd.read_csv(BytesIO(file_bytes))


@st.cache_data(show_spinner=False)
def summarize_by_track(data: pd.DataFrame) -> pd.DataFrame:
    return (
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


@st.cache_data(show_spinner=False)
def summarize_weekly(data: pd.DataFrame) -> pd.DataFrame:
    return (
        data.groupby(["week", "track"], as_index=False)
        .agg(
            mean_score=("challenge_score", "mean"),
            mean_completion=("completion_rate", "mean"),
            mean_hours=("study_hours", "mean"),
        )
    )


def validate_schema(data: pd.DataFrame) -> None:
    missing = sorted(REQUIRED_COLUMNS.difference(data.columns))
    if missing:
        missing_text = ", ".join(missing)
        raise ValueError(f"O CSV precisa conter as colunas: {missing_text}")


def format_percent(value: float) -> str:
    return f"{value:.1%}" if pd.notna(value) else "0.0%"


def apply_sidebar_filters(data: pd.DataFrame) -> pd.DataFrame:
    st.sidebar.header("Filtros")

    tracks = sorted(data["track"].unique())
    selected_tracks = st.sidebar.multiselect("Trilhas", tracks, default=tracks)

    min_week = int(data["week"].min())
    max_week = int(data["week"].max())
    selected_weeks = st.sidebar.slider("Semanas", min_week, max_week, (min_week, max_week))

    min_score = st.sidebar.slider("Pontuação mínima", 0, 100, 0)
    show_only_high_completion = st.sidebar.checkbox("Somente conclusão acima de 80%")

    filtered = data[
        data["track"].isin(selected_tracks)
        & data["week"].between(selected_weeks[0], selected_weeks[1])
        & (data["challenge_score"] >= min_score)
    ].copy()

    if show_only_high_completion:
        filtered = filtered[filtered["completion_rate"] >= 0.8]

    return filtered


def render_metric_cards(data: pd.DataFrame) -> None:
    total_learners = data["learner_id"].nunique()
    mean_completion = data["completion_rate"].mean()
    mean_score = data["challenge_score"].mean()
    support_requests = int(data["support_requests"].sum())

    col1, col2, col3, col4 = st.columns(4)
    col1.metric("Participantes", f"{total_learners}")
    col2.metric("Conclusão média", format_percent(mean_completion))
    col3.metric("Pontuação média", f"{mean_score:.1f}")
    col4.metric("Pedidos de suporte", f"{support_requests}")


def render_overview(data: pd.DataFrame) -> None:
    summary = summarize_by_track(data)
    weekly = summarize_weekly(data)

    left, right = st.columns((0.95, 1.05))

    with left:
        st.subheader("Conclusão média por trilha")
        bar = px.bar(
            summary,
            x="mean_completion_rate",
            y="track",
            orientation="h",
            color="track",
            color_discrete_map=PALETTE,
            text=summary["mean_completion_rate"].map(lambda value: f"{value:.1%}"),
            labels={"mean_completion_rate": "Conclusão média", "track": "Trilha"},
        )
        bar.update_layout(showlegend=False, xaxis_tickformat=".0%")
        st.plotly_chart(bar, use_container_width=True)

    with right:
        st.subheader("Evolução da pontuação")
        line = px.line(
            weekly,
            x="week",
            y="mean_score",
            color="track",
            markers=True,
            color_discrete_map=PALETTE,
            labels={"week": "Semana", "mean_score": "Pontuação média", "track": "Trilha"},
        )
        st.plotly_chart(line, use_container_width=True)


def render_exploration(data: pd.DataFrame) -> None:
    left, right = st.columns((1.1, 0.9))

    with left:
        st.subheader("Horas de estudo e desempenho")
        scatter = px.scatter(
            data,
            x="study_hours",
            y="challenge_score",
            color="track",
            size="completion_rate",
            hover_data=["week", "practice_tasks", "support_requests", "satisfaction"],
            color_discrete_map=PALETTE,
            labels={
                "study_hours": "Horas de estudo",
                "challenge_score": "Pontuação",
                "completion_rate": "Conclusão",
                "track": "Trilha",
            },
        )
        st.plotly_chart(scatter, use_container_width=True)

    with right:
        st.subheader("Distribuição de satisfação")
        box = px.box(
            data,
            x="track",
            y="satisfaction",
            color="track",
            points="all",
            color_discrete_map=PALETTE,
            labels={"track": "Trilha", "satisfaction": "Satisfação"},
        )
        box.update_layout(showlegend=False)
        st.plotly_chart(box, use_container_width=True)


def render_data_table(data: pd.DataFrame) -> None:
    st.subheader("Dados filtrados")
    st.dataframe(data, use_container_width=True, hide_index=True)

    csv = data.to_csv(index=False).encode("utf-8")
    st.download_button(
        "Baixar dados filtrados",
        data=csv,
        file_name="learning_activity_filtered.csv",
        mime="text/csv",
    )


def render_guide() -> None:
    st.subheader("Como este app foi estruturado")
    st.markdown(
        """
        Este app separa responsabilidades:

        - `load_default_data()` e `load_uploaded_data()` cuidam da entrada de dados.
        - `validate_schema()` protege o app contra CSVs incompatíveis.
        - `@st.cache_data` evita recarregar e reagrupar os mesmos dados a cada interação.
        - Os filtros ficam na barra lateral para manter a análise limpa.
        - Cada aba responde uma tarefa: visão geral, exploração, dados e guia.

        Para publicar, mantenha `requirements.txt`, `app.py` e `data/` no repositório.
        Depois use Streamlit Community Cloud ou outro serviço compatível.
        """
    )


def main() -> None:
    st.title("Learning Analytics App")
    st.caption("Code Zone · Data Analytics · Streamlit")

    uploaded_file = st.sidebar.file_uploader("Enviar outro CSV", type=["csv"])

    try:
        if uploaded_file is None:
            data = load_default_data(str(DEFAULT_DATA_PATH))
        else:
            data = load_uploaded_data(uploaded_file.getvalue())

        validate_schema(data)
    except Exception as error:  # noqa: BLE001 - user-facing app boundary
        st.error(str(error))
        st.stop()

    filtered = apply_sidebar_filters(data)

    if filtered.empty:
        st.warning("Nenhum registro encontrado para os filtros atuais.")
        st.stop()

    render_metric_cards(filtered)

    overview_tab, exploration_tab, data_tab, guide_tab = st.tabs(
        ["Visão geral", "Exploração", "Dados", "Guia"]
    )

    with overview_tab:
        render_overview(filtered)

    with exploration_tab:
        render_exploration(filtered)

    with data_tab:
        render_data_table(filtered)

    with guide_tab:
        render_guide()


if __name__ == "__main__":
    main()
