# Code Zone

Site estático da Code Zone, pronto para publicação no GitHub Pages.

## Executar localmente

Abra `index.html` no navegador ou use um servidor estático:

```bash
npx serve .
```

## Publicar no GitHub Pages

O workflow `.github/workflows/deploy-pages.yml` publica o site automaticamente.

Na primeira publicação:

1. No GitHub, abra **Settings > Pages**.
2. Em **Build and deployment > Source**, selecione **GitHub Actions**.
3. Envie o workflow e o site para a branch `main`.
4. Acompanhe a execução em **Actions > Deploy to GitHub Pages**.

Depois disso, cada push na `main` inicia um novo deploy. Também é possível
executá-lo manualmente em **Actions > Deploy to GitHub Pages > Run workflow**.

URL prevista: <https://codezonelearning.github.io/Home/>

O site usa somente HTML, CSS e JavaScript, sem etapa de build.
