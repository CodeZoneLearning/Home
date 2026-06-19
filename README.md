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

## Estrutura dos subjects

Cada subject funciona como uma página independente:

```text
subjects/
|-- shared/                  # componentes visuais e comportamentos comuns
|-- python/
|   |-- index.html
|   |-- styles.css
|   `-- script.js
|-- data-analytics/
|   |-- index.html
|   |-- styles.css
|   |-- script.js
|   `-- modules/
|       `-- manipulacao-dados-tabulares/  # aula, CSV, Python e outputs
|-- machine-learning/
`-- ...
```

As páginas apresentam roteiro, progresso local e projetos clonáveis. Para
adicionar um novo subject, copie uma pasta existente, altere o conteúdo do
`index.html`, defina a cor em `styles.css` e use um identificador único em
`script.js`.

### Idiomas

O conteúdo-fonte do site é escrito em português brasileiro. O arquivo
`i18n.js` centraliza as traduções para inglês, adiciona o seletor `PT / EN` ao
cabeçalho e mantém a preferência no `localStorage`.

Ao adicionar ou alterar um texto visível, inclua a frase completa no objeto
`english` de `i18n.js`. Conteúdo criado por JavaScript também é observado e
traduzido automaticamente. Elementos `code` e `pre` são preservados para que
exemplos de código não sejam modificados.

Os repositórios de projetos continuam independentes. A página do subject deve
apontar para o repositório correto e exibir seu comando `git clone`, sem copiar
o código do projeto para este repositório de apresentação.

### Adicionar referências de Research

Papers, matérias e livros ficam centralizados em
`subjects/shared/research-data.js`. Para adicionar uma referência, inclua um
objeto no array do subject correspondente:

```js
{
  type: 'paper', // paper, material ou book
  title: 'Título da referência',
  url: 'https://exemplo.com/referencia',
  description: 'Por que esta referência é relevante.',
  meta: 'Autores ou publicação',
  year: '2026',
  tags: ['tema', 'subtema']
}
```

Os cards, contadores e filtros são atualizados automaticamente. Não é
necessário alterar o HTML ou o CSS das páginas.

A biblioteca completa fica em `research/` e permite combinar busca, formato,
subject e tags. As páginas dos subjects apontam para essa biblioteca com o
filtro de subject já aplicado.
