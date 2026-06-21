# Vídeos no Code Zone

Os vídeos devem ser hospedados no YouTube. O GitHub Pages entrega a página, o material escrito e os exemplos; o YouTube cuida de streaming, qualidade adaptativa, legendas e distribuição.

## Fluxo recomendado

1. Crie o canal Code Zone no YouTube.
2. Publique cada aula como `Público` ou `Não listado` durante a revisão.
3. Adicione título, descrição, capítulos e legendas em PT-BR e EN.
4. Copie o ID do vídeo. Em `https://www.youtube.com/watch?v=abc123XYZ00`, o ID é `abc123XYZ00`.
5. Preencha `data-youtube-id` no componente da aula.

```html
<article
  class="video-embed"
  data-youtube-video
  data-youtube-id="abc123XYZ00"
  data-video-title="Como escolher uma família de modelos"
  data-video-title-en="How to choose a model family"
>
  ...
</article>
```

O componente usa `youtube-nocookie.com` e só cria o iframe após o clique. Isso evita carregar o player e seus recursos em todas as visitas.

## Estrutura de cada vídeo

- Problema que a aula resolve.
- Conceito principal com um exemplo visual.
- Demonstração curta do código ou laboratório.
- Erros de interpretação mais comuns.
- Próximo exercício e links para a página e o repositório.

Use o material escrito como fonte principal. O vídeo deve explicar e demonstrar, não ser a única forma de acessar o conteúdo.
