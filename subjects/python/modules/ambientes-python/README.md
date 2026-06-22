# Ambientes Python

Esta aula compara o fluxo padrão com `venv` e `pip` ao gerenciamento de projetos com `uv`.

## Fluxo padrão

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -r examples/requirements.txt
```

## Fluxo com uv

Dentro de `examples/`:

```bash
uv sync
uv run equipment-health
```

O arquivo `uv.lock` deve ser gerado pelo `uv` e normalmente versionado em projetos de aplicação.
