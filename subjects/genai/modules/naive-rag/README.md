# Naive RAG

Esta aula é conceitual. O objetivo é entender o fluxo de Retrieval-Augmented Generation antes de escolher framework.

## Resultado esperado

Ao terminar, a pessoa deve conseguir explicar:

- por que RAG existe;
- qual a diferença entre memória paramétrica do modelo e contexto recuperado;
- como documentos viram chunks, embeddings e resultados de busca;
- por que uma resposta com fonte ainda precisa ser validada;
- quais decisões mudam o comportamento do baseline.

## Próximo passo prático

Implementar um baseline pequeno com poucas fontes, salvar perguntas de teste e avaliar separadamente:

- se o retriever encontra os trechos certos;
- se o prompt usa apenas o contexto;
- se a resposta cita evidências corretamente;
- se o sistema recusa perguntas sem suporte.
