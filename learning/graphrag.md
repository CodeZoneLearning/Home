# GraphRAG: arquitetura

Documentos → extração de entidades → resolução de entidades → relações → comunidades → índice híbrido → resposta com fontes.

## Fluxo
1. Identificar entidades da pergunta.
2. Recuperar vizinhanças relevantes.
3. Combinar busca vetorial e travessia do grafo.
4. Montar contexto compacto.
5. Gerar e verificar a resposta.
