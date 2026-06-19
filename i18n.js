(() => {
  const STORAGE_KEY = 'code-zone-language';
  const SUPPORTED_LANGUAGES = ['pt-BR', 'en'];

  const english = {
    // Shared navigation and interface
    'Início': 'Home',
    'Método': 'Method',
    'Comunidade': 'Community',
    'Projetos': 'Projects',
    'Começar agora': 'Start now',
    'Abrir menu': 'Open menu',
    'Pular para o conteúdo': 'Skip to content',
    'Pular para a biblioteca': 'Skip to library',
    'Abrir trilha': 'Open path',
    'Abrir subject': 'Open subject',
    'Abrir no GitHub ↗': 'Open on GitHub ↗',
    'Continuar trilha ↗': 'Continue path ↗',
    'TODOS OS SUBJECTS ↗': 'ALL SUBJECTS ↗',
    'Seu progresso': 'Your progress',
    'Visão geral': 'Overview',
    'Roteiro': 'Roadmap',
    'Recursos': 'Resources',
    'Nível': 'Level',
    'Duração': 'Duration',
    'Módulos': 'Modules',
    'Copiar': 'Copy',
    'Copiado': 'Copied',
    'Iniciante': 'Beginner',
    'Intermediário': 'Intermediate',
    'Avançado': 'Advanced',
    'INICIANTE': 'BEGINNER',
    'INTERMEDIÁRIO': 'INTERMEDIATE',
    'Base': 'Foundation',
    'PRÓXIMO SUBJECT': 'NEXT SUBJECT',
    '// VISÃO GERAL': '// OVERVIEW',
    '// ROTEIRO': '// ROADMAP',
    '// RECURSOS': '// RESOURCES',
    '// BUILD': '// BUILD',
    'Code Zone - Início': 'Code Zone - Home',
    'Navegação principal': 'Main navigation',
    'São Paulo, BR': 'São Paulo, Brazil',
    'Sistema online': 'System online',
    'Voltar ao início ↗': 'Back to home ↗',

    // Home
    'Code Zone | Conhecimento que vira solução': 'Code Zone | Knowledge into solutions',
    'Code Zone: aprenda programação, dados e inteligência artificial construindo projetos reais.': 'Code Zone: learn programming, data, and artificial intelligence by building real projects.',
    'Aprendizado aplicado em tecnologia': 'Applied technology learning',
    'Conhecimento': 'Knowledge',
    'que vira': 'that becomes',
    'solução.': 'a solution.',
    'Aprenda programação, dados e inteligência artificial construindo projetos que resolvem problemas do mundo real.': 'Learn programming, data, and artificial intelligence by building projects that solve real-world problems.',
    'Explorar subjects': 'Explore subjects',
    'Ver projetos': 'View projects',
    'Áreas de aprendizado': 'Learning areas',
    'Visualização abstrata de blocos de conhecimento': 'Abstract visualization of connected knowledge blocks',
    'Rede conectando programação, dados e inteligência artificial': 'Network connecting programming, data, and artificial intelligence',
    'subjects conectados': 'connected subjects',
    'projetos práticos': 'hands-on projects',
    'aprendizado aplicado': 'applied learning',
    '// NOSSO MÉTODO': '// OUR METHOD',
    'Aprender é': 'Learning means',
    'construir.': 'building.',
    'Menos teoria isolada. Mais contexto, experimentação e entregas que você consegue explicar, testar e evoluir.': 'Less isolated theory. More context, experimentation, and work you can explain, test, and improve.',
    'Fundamentos claros, conectados ao problema que você quer resolver.': 'Clear foundations connected to the problem you want to solve.',
    'conceito': 'concept',
    'Projetos progressivos para transformar conhecimento em repertório.': 'Progressive projects that turn knowledge into practical experience.',
    'prática': 'practice',
    'Demos interativas para testar ideias e enxergar sistemas funcionando.': 'Interactive demos for testing ideas and seeing systems in action.',
    'experimento': 'experiment',
    'Artigos, comparações e referências para aprofundar cada decisão.': 'Articles, comparisons, and references to deepen every decision.',
    'abrir biblioteca ↗': 'open library ↗',
    '// SUBJECTS': '// SUBJECTS',
    'Escolha seu': 'Choose your',
    'próximo bloco.': 'next block.',
    'Cada trilha combina fundamentos, arquivos de estudo e projetos com entregas concretas.': 'Each path combines foundations, learning files, and projects with concrete deliverables.',
    'Da lógica à automação.': 'From logic to automation.',
    'Da tabela à decisão.': 'From tables to decisions.',
    'Modelos que aprendem padrões.': 'Models that learn patterns.',
    'Sistemas que criam e colaboram.': 'Systems that create and collaborate.',
    '// PROJETOS EM DESTAQUE': '// FEATURED PROJECTS',
    'Briefings desenhados para formar decisões técnicas, não apenas preencher um portfólio.': 'Briefs designed to develop technical judgment, not just fill a portfolio.',
    'Ver todos': 'View all',
    'Dashboard de dados urbanos': 'Urban data dashboard',
    'Explore indicadores públicos e transforme números em decisões visuais.': 'Explore public indicators and turn numbers into visual decisions.',
    'API de hábitos inteligentes': 'Smart habits API',
    'Modele dados, crie endpoints e documente uma API pronta para evoluir.': 'Model data, create endpoints, and document an API built to evolve.',
    'Assistente RAG para documentos': 'RAG assistant for documents',
    'Construa uma busca semântica que responde perguntas com fontes e contexto verificável.': 'Build semantic search that answers questions with sources and verifiable context.',
    '// BUILD IN PUBLIC': '// BUILD IN PUBLIC',
    'Aprender junto': 'Learn together',
    'muda o resultado.': 'changes the outcome.',
    'Compartilhe processos, compare soluções e evolua seus projetos com uma comunidade que valoriza clareza e prática.': 'Share processes, compare solutions, and improve your projects with a community that values clarity and practice.',
    'Entrar na Code Zone': 'Join Code Zone',
    '// DA CURIOSIDADE': '// FROM CURIOSITY',
    'Do código': 'From code',
    'ao impacto.': 'to impact.',

    // Subjects catalog
    'Subjects são trilhas vivas de aprendizado. Escolha uma área, estude os fundamentos e avance construindo.': 'Subjects are living learning paths. Choose an area, study the foundations, and progress by building.',
    'Explore os subjects da Code Zone: Python, dados, machine learning, inteligência artificial e sistemas.': 'Explore Code Zone subjects: Python, data, machine learning, artificial intelligence, and systems.',
    'Explore por área': 'Explore by area',
    'Todos': 'All',
    'Filtrar subjects por área': 'Filter subjects by area',
    'Construa uma base sólida de lógica, automação, orientação a objetos e boas práticas.': 'Build a solid foundation in logic, automation, object-oriented programming, and good practices.',
    'Entenda vetores, matrizes, probabilidade e cálculo pelo olhar de quem constrói sistemas.': 'Understand vectors, matrices, probability, and calculus from the perspective of someone who builds systems.',
    'Manipule tabelas, explique padrões e entregue dashboards e data apps reproduzíveis.': 'Manipulate tables, explain patterns, and deliver reproducible dashboards and data apps.',
    'Projete pipelines confiáveis, modele informação e entregue dados prontos para uso.': 'Design reliable pipelines, model information, and deliver data ready for use.',
    'Treine, avalie e explique modelos sem perder de vista o problema e os dados.': 'Train, evaluate, and explain models without losing sight of the problem and the data.',
    'Crie aplicações com LLMs, contexto, ferramentas e avaliações que vão além do prompt.': 'Build applications with LLMs, context, tools, and evaluations that go beyond prompting.',
    'Conecte entidades, relações e recuperação semântica para responder questões complexas.': 'Connect entities, relationships, and semantic retrieval to answer complex questions.',
    'Transforme lógica em serviços claros, observáveis e preparados para crescer.': 'Turn logic into clear, observable services built to scale.',
    'Nenhum subject encontrado nesta categoria.': 'No subjects found in this category.',
    '// NÃO SABE POR ONDE COMEÇAR?': '// NOT SURE WHERE TO START?',
    'Comece pelo problema,': 'Start with the problem,',
    'não pela ferramenta.': 'not the tool.',
    'Use Python para criar sua base. Depois conecte dados, modelos e sistemas conforme o projeto pedir.': 'Use Python to build your foundation. Then connect data, models, and systems as the project requires.',
    'Abrir trilha recomendada': 'Open recommended path',

    // Research
    'Research Library | Code Zone': 'Research Library | Code Zone',
    'Research Library da Code Zone: papers, livros e materiais para aprofundar programação, dados e inteligência artificial.': 'Code Zone Research Library: papers, books, and materials for deeper study in programming, data, and artificial intelligence.',
    'Conhecimento aplicado também exige profundidade. Explore referências que ajudam a entender o porquê antes de escolher o como.': 'Applied knowledge also requires depth. Explore references that help you understand why before choosing how.',
    'Curadoria para aprofundamento': 'Curated for deeper study',
    'referências': 'references',
    'formatos': 'formats',
    'Encontre sua': 'Find your',
    'próxima referência.': 'next reference.',
    'Combine busca, formato, subject e tags. Os resultados são atualizados imediatamente.': 'Combine search, format, subject, and tags. Results update immediately.',
    'Buscar referências': 'Search references',
    'Buscar por título, autor, tema...': 'Search by title, author, or topic...',
    'Filtrar por formato': 'Filter by format',
    'Todos os subjects': 'All subjects',
    'Matérias': 'Articles',
    'Livros': 'Books',
    'Tags': 'Tags',
    'referências encontradas': 'references found',
    'Nenhuma referência encontrada.': 'No references found.',
    'Remova um filtro ou tente outro termo de busca.': 'Remove a filter or try another search term.',
    'Limpar filtros': 'Clear filters',
    'Não acumule links.': 'Do not collect links.',
    '// LEIA': '// READ',
    'Construa repertório.': 'Build a body of knowledge.',
    'Leia com uma pergunta, registre decisões e aplique uma ideia em um projeto. Research só vira aprendizado quando muda a forma como você constrói.': 'Read with a question, record decisions, and apply one idea in a project. Research only becomes learning when it changes how you build.',
    'Aplicar em um subject': 'Apply it in a subject',
    'Abrir referência ↗': 'Open reference ↗',
    'ÍNDICE_COMPLETO': 'FULL_INDEX',
    'Matéria': 'Article',
    'Livro': 'Book',
    'Atualizado': 'Updated',
    'Interativo': 'Interactive',
    'Guia oficial para escrever Python legível e consistente.': 'Official guide for writing readable and consistent Python.',
    'Percurso oficial pela linguagem, estruturas e biblioteca padrão.': 'Official path through the language, data structures, and standard library.',
    'Aprofundamento prático no modelo de dados e nos recursos idiomáticos da linguagem.': 'A practical deep dive into the data model and idiomatic language features.',
    'Derivadas matriciais apresentadas com foco direto em modelos de deep learning.': 'Matrix derivatives presented with a direct focus on deep learning models.',
    'Introdução visual e interativa a probabilidade e estatística.': 'A visual and interactive introduction to probability and statistics.',
    'Livro aberto sobre álgebra linear, cálculo e probabilidade aplicados a ML.': 'Open book on linear algebra, calculus, and probability applied to ML.',
    'Princípios para estruturar dados e tornar análises mais simples e reproduzíveis.': 'Principles for structuring data and making analyses simpler and reproducible.',
    'Referência oficial para manipulação, transformação e análise tabular.': 'Official reference for tabular manipulation, transformation, and analysis.',
    'Livro aberto sobre escolhas visuais, percepção e comunicação honesta de dados.': 'Open book about visual choices, perception, and honest data communication.',
    'Modelo prático para processamento de dados batch e streaming em larga escala.': 'A practical model for large-scale batch and streaming data processing.',
    'Material oficial sobre contratos de schema e garantias para consumidores.': 'Official material on schema contracts and guarantees for consumers.',
    'Fundamentos de armazenamento, processamento, consistência e sistemas distribuídos.': 'Foundations of storage, processing, consistency, and distributed systems.',
    'Riscos sistêmicos que aparecem quando modelos deixam o notebook e entram em produção.': 'Systemic risks that emerge when models leave notebooks and enter production.',
    'Proposta para documentar desempenho, contexto, limitações e uso responsável de modelos.': 'A proposal for documenting performance, context, limitations, and responsible model use.',
    'Livro aberto com base estatística e aplicações práticas de machine learning.': 'Open book with statistical foundations and practical machine learning applications.',
    'Paper que consolidou a combinação de recuperação externa e geração neural.': 'The paper that established the combination of external retrieval and neural generation.',
    'Integra raciocínio textual e ações para resolver tarefas com ferramentas.': 'Combines textual reasoning and actions to solve tasks with tools.',
    'Abordagem visual e prática para embeddings, transformers e aplicações com LLMs.': 'A visual and practical approach to embeddings, transformers, and LLM applications.',
    'GraphRAG para sumarização orientada a perguntas sobre grandes coleções de texto.': 'GraphRAG for question-focused summarization over large text collections.',
    'Documentação oficial de indexação, configuração, consulta e arquitetura do GraphRAG.': 'Official GraphRAG documentation for indexing, configuration, querying, and architecture.',
    'Visão abrangente de representação, aquisição, qualidade e aplicações de knowledge graphs.': 'A broad view of knowledge graph representation, acquisition, quality, and applications.',
    'A dissertação que apresenta REST dentro de um contexto arquitetural mais amplo.': 'The dissertation that presents REST within a broader architectural context.',
    'Especificação de referência para métodos, status, representações e semântica HTTP.': 'Reference specification for HTTP methods, status codes, representations, and semantics.',
    'Padrões para recursos, operações, versionamento, paginação e evolução de APIs.': 'Patterns for resources, operations, versioning, pagination, and API evolution.',

    // Shared subject language
    'Quatro blocos fundamentais.': 'Four fundamental blocks.',
    'Complete os blocos na ordem ou use-os como referência durante seus projetos.': 'Complete the blocks in order or use them as references during your projects.',
    'Marque cada módulo conforme avançar. Seu progresso fica salvo neste navegador.': 'Mark each module as you progress. Your progress is saved in this browser.',
    'Projetos para clonar e estudar.': 'Projects to clone and study.',
    'Use os repositórios como referência: execute, leia a arquitetura e reconstrua partes com suas próprias decisões.': 'Use the repositories as references: run them, study the architecture, and rebuild parts using your own decisions.',
    'Checklist de domínio.': 'Mastery checklist.',
    'Checklist de avaliação.': 'Evaluation checklist.',
    'Checklist de produção.': 'Production checklist.',
    'Perguntas essenciais.': 'Essential questions.',
    'Princípios de operação.': 'Operating principles.',
    'Decisões antes do framework.': 'Decisions before the framework.',
    'Controles essenciais.': 'Essential controls.',

    // Python subject
    'Construa uma base de programação que sustenta automações, análises, APIs e sistemas de inteligência artificial.': 'Build a programming foundation that supports automation, analytics, APIs, and artificial intelligence systems.',
    'Trilha de Python da Code Zone: fundamentos, automação, APIs e projetos reais.': 'Code Zone Python path: foundations, automation, APIs, and real projects.',
    'Aprenda a pensar em código.': 'Learn to think in code.',
    'A trilha prioriza lógica, organização e prática. O objetivo não é decorar sintaxe, mas decompor problemas e produzir programas que outras pessoas conseguem executar e evoluir.': 'This path prioritizes logic, organization, and practice. The goal is not to memorize syntax, but to break down problems and produce programs that others can run and improve.',
    'Modelar problemas': 'Model problems',
    'Transforme regras do mundo real em dados, funções e fluxos claros.': 'Turn real-world rules into data, functions, and clear flows.',
    'Automatizar tarefas': 'Automate tasks',
    'Leia arquivos, trate dados e elimine trabalho manual repetitivo.': 'Read files, process data, and eliminate repetitive manual work.',
    'Entregar software': 'Deliver software',
    'Organize módulos, erros, testes e documentação de execução.': 'Organize modules, errors, tests, and run documentation.',
    'Lógica e tipos': 'Logic and types',
    'Variáveis, operadores, condições, repetições e decomposição.': 'Variables, operators, conditions, loops, and decomposition.',
    'Funções e coleções': 'Functions and collections',
    'Contratos, listas, dicionários, comprehensions e módulos.': 'Contracts, lists, dictionaries, comprehensions, and modules.',
    'Arquivos e automação': 'Files and automation',
    'CSV, JSON, caminhos, exceções e scripts de linha de comando.': 'CSV, JSON, paths, exceptions, and command-line scripts.',
    'Projeto sustentável': 'Sustainable project',
    'Ambientes, dependências, testes, logging e README.': 'Environments, dependencies, tests, logging, and README files.',
    'Resolver sem copiar': 'Solve without copying',
    'Implemente uma solução e só depois compare abordagens.': 'Implement a solution before comparing approaches.',
    'Separar entrada, regra e saída': 'Separate input, rules, and output',
    'Mantenha efeitos externos longe da lógica principal.': 'Keep external effects away from the core logic.',
    'Testar comportamento': 'Test behavior',
    'Escreva testes para casos felizes, bordas e falhas esperadas.': 'Write tests for happy paths, edge cases, and expected failures.',
    'Pipeline completo com análise, forecasting, clusterização e dashboard em FastAPI.': 'Complete pipeline with analytics, forecasting, clustering, and a FastAPI dashboard.',
    'Projeto organizado para estimar vida útil de equipamentos com mentalidade de produção.': 'Organized project for estimating equipment lifetime with a production mindset.',

    // Applied Mathematics subject
    'Matemática': 'Mathematics',
    'Matemática Aplicada | Code Zone': 'Applied Mathematics | Code Zone',
    'Matemática aplicada para dados, machine learning e sistemas.': 'Applied mathematics for data, machine learning, and systems.',
    'Vetores, estatística, probabilidade e otimização explicados pelo que permitem construir.': 'Vectors, statistics, probability, and optimization explained through what they allow you to build.',
    'Matemática como ferramenta.': 'Mathematics as a tool.',
    'Do dado ao modelo.': 'From data to model.',
    'Estatística': 'Statistics',
    'Regressão': 'Regression',
    'Séries': 'Time series',
    'A trilha conecta representações matemáticas a dados, modelos e decisões. Cada conceito nasce de um problema observável.': 'This path connects mathematical representations to data, models, and decisions. Every concept starts with an observable problem.',
    'Representar': 'Represent',
    'Modele dados com vetores, matrizes, funções e distribuições.': 'Model data with vectors, matrices, functions, and distributions.',
    'Medir': 'Measure',
    'Quantifique tendência, variação, incerteza e erro.': 'Quantify trends, variation, uncertainty, and error.',
    'Otimizar': 'Optimize',
    'Entenda como modelos ajustam parâmetros e reduzem perdas.': 'Understand how models adjust parameters and reduce losses.',
    'Vetores e matrizes': 'Vectors and matrices',
    'Operações, transformações, distância e similaridade.': 'Operations, transformations, distance, and similarity.',
    'Estatística descritiva': 'Descriptive statistics',
    'Distribuições, dispersão, correlação e leitura crítica.': 'Distributions, dispersion, correlation, and critical reading.',
    'Probabilidade': 'Probability',
    'Eventos, condicionais, Bayes e simulações.': 'Events, conditional probability, Bayes, and simulations.',
    'Funções e otimização': 'Functions and optimization',
    'Derivadas, gradientes, funções de perda e ajuste.': 'Derivatives, gradients, loss functions, and fitting.',
    'Conceitos em problemas reais.': 'Concepts in real problems.',
    'Observe como estatística, forecasting e otimização aparecem em projetos completos.': 'See how statistics, forecasting, and optimization appear in complete projects.',
    'Compare baselines, médias móveis, ARIMA e modelos de árvore sobre receita mensal.': 'Compare baselines, moving averages, ARIMA, and tree models on monthly revenue.',
    'Analise degradação, sensores, erro de previsão e vida útil remanescente.': 'Analyze degradation, sensors, forecast error, and remaining useful life.',
    'A média esconde segmentos?': 'Does the average hide segments?',
    'Investigue distribuições, grupos e casos extremos.': 'Investigate distributions, groups, and extreme cases.',
    'O que a distância representa?': 'What does distance represent?',
    'Conecte a métrica ao custo da decisão.': 'Connect the metric to the cost of the decision.',
    'Qual erro realmente importa?': 'Which error really matters?',
    'Escolha métricas coerentes com o dado e o problema.': 'Choose metrics consistent with the data and the problem.',

    // Data Analytics subject
    'Converta dados tabulares em diagnósticos claros, gráficos explicativos e produtos interativos para apoiar decisões.': 'Turn tabular data into clear diagnoses, explanatory charts, and interactive products that support decisions.',
    'Trilha prática de Data Analytics com Pandas, visualização, Plotly e Streamlit.': 'Practical Data Analytics path with Pandas, visualization, Plotly, and Streamlit.',
    'Blocos': 'Blocks',
    'Entregas': 'Deliverables',
    'Análise que pode ser verificada.': 'Analytics that can be verified.',
    'Cada bloco parte de uma base de dados e termina em um artefato executável. Você aprende a investigar primeiro, comunicar depois e registrar as decisões no caminho.': 'Each block starts with a dataset and ends with an executable artifact. You learn to investigate first, communicate second, and record decisions along the way.',
    'bloco': 'block',
    'Bloco 01': 'Block 01',
    'Manipulação de': 'Tabular data',
    'dados tabulares.': 'manipulation.',
    'Manipular': 'Manipulate',
    'Limpe, agrupe e valide tabelas com Pandas.': 'Clean, group, and validate tables with Pandas.',
    'Explicar': 'Explain',
    'Escolha gráficos que respondem à pergunta de negócio.': 'Choose charts that answer the business question.',
    'Entregar': 'Deliver',
    'Publique dashboards e data apps navegáveis.': 'Publish navigable dashboards and data apps.',
    'Da tabela ao produto analítico.': 'From tables to an analytics product.',
    'Os materiais ficam dentro de cada bloco. O primeiro já está completo e usa testes fictícios de saúde de equipamentos.': 'Materials live inside each block. The first is complete and uses fictional equipment health tests.',
    'Manipulação de dados tabulares': 'Tabular data manipulation',
    'Disponível': 'Available',
    'CSV realista, Pandas, `describe`, valores únicos, `groupby` e inferência sobre a consistência dos testes.': 'A realistic CSV, Pandas, `describe`, unique values, `groupby`, and inference about test consistency.',
    'Abrir aula completa': 'Open full lesson',
    'Criação de gráficos': 'Creating charts',
    'Planejado': 'Planned',
    'Distribuição, comparação, relação e séries temporais com Matplotlib e Seaborn.': 'Distribution, comparison, relationships, and time series with Matplotlib and Seaborn.',
    'Dashboards com Plotly': 'Dashboards with Plotly',
    'KPIs, filtros e visualizações interativas organizadas para exploração.': 'KPIs, filters, and interactive visualizations organized for exploration.',
    'Data apps com Streamlit': 'Data apps with Streamlit',
    'Aplicação publicada com upload, cache, estado, filtros e narrativa analítica.': 'A published application with uploads, caching, state, filters, and an analytics narrative.',
    'Materiais': 'Materials',
    'Uma pasta que explica como estudar.': 'A folder that explains how to study.',
    'A organização separa fonte, lógica e resultado. Assim você pode trocar o CSV, executar novamente e comparar o que mudou.': 'The structure separates source, logic, and results. This lets you replace the CSV, run again, and compare what changed.',
    'CSV original e dicionário de dados. A análise nunca sobrescreve essa camada.': 'Original CSV and data dictionary. The analysis never overwrites this layer.',
    'Gerador reproduzível e análise Pandas executada pela linha de comando.': 'Reproducible generator and Pandas analysis run from the command line.',
    'Resumos por equipamento, contagens, estatísticas e intervalos de confiança.': 'Equipment summaries, counts, statistics, and confidence intervals.',
    'Contrato da base, instalação, critérios e limites da interpretação.': 'Dataset contract, installation, criteria, and interpretation limits.',
    'Auditoria de testes de equipamentos.': 'Equipment test audit.',
    'Os testes concordam entre si?': 'Do the tests agree?',
    'Analise 108 testes de 18 equipamentos e identifique consenso, maioria estável e resultados contraditórios.': 'Analyze 108 tests from 18 equipment units and identify consensus, stable majorities, and contradictory results.',
    'Baixar CSV': 'Download CSV',
    'Baixar análise `.py`': 'Download `.py` analysis',
    'Entrar no estudo de caso ↗': 'Open the case study ↗',
    'APROFUNDE A ANÁLISE': 'GO DEEPER',
    'Papers, livros e matérias.': 'Papers, books, and articles.',
    'Abrir Research ↗': 'Open Research ↗',

    // Data Engineering subject
    'Engenharia de Dados': 'Data Engineering',
    'Engenharia de Dados | Code Zone': 'Data Engineering | Code Zone',
    'Trilha de Engenharia de Dados da Code Zone.': 'Code Zone Data Engineering path.',
    'Projete pipelines rastreáveis, idempotentes e observáveis para entregar dados confiáveis a pessoas e sistemas.': 'Design traceable, idempotent, and observable pipelines that deliver reliable data to people and systems.',
    'Dados confiáveis são produto.': 'Reliable data is a product.',
    'A trilha trata pipelines como sistemas: contratos explícitos, falhas previstas, execução repetível e sinais claros de saúde.': 'This path treats pipelines as systems: explicit contracts, anticipated failures, repeatable execution, and clear health signals.',
    'Contratar': 'Define contracts',
    'Defina schema, qualidade, ownership e expectativas de consumo.': 'Define schema, quality, ownership, and consumption expectations.',
    'Orquestrar': 'Orchestrate',
    'Separe ingestão, transformação, armazenamento e entrega.': 'Separate ingestion, transformation, storage, and delivery.',
    'Observar': 'Observe',
    'Meça volume, frescor, erro e lineage do dado.': 'Measure data volume, freshness, errors, and lineage.',
    'Modelagem e contratos': 'Modeling and contracts',
    'Schema, chaves, granularidade, evolução e validação.': 'Schema, keys, granularity, evolution, and validation.',
    'Ingestão idempotente': 'Idempotent ingestion',
    'Batch, incremental, checkpoints e prevenção de duplicidade.': 'Batch, incremental processing, checkpoints, and duplicate prevention.',
    'Transformação e storage': 'Transformation and storage',
    'Camadas, particionamento, formatos e padrões de acesso.': 'Layers, partitioning, formats, and access patterns.',
    'Qualidade e observabilidade': 'Quality and observability',
    'Testes, métricas, alertas, lineage e recuperação.': 'Tests, metrics, alerts, lineage, and recovery.',
    'Pipelines em contextos reais.': 'Pipelines in real contexts.',
    'Os projetos mostram ingestão estruturada, metadados, persistência e inspeção operacional.': 'The projects demonstrate structured ingestion, metadata, persistence, and operational inspection.',
    'Revise dados brutos, modele relações e gere artefatos de grafo com caminhos alternativos.': 'Review raw data, model relationships, and generate graph artifacts using alternative paths.',
    'Ingestão de PDF, chunks rastreáveis, embeddings, Qdrant e métricas operacionais.': 'PDF ingestion, traceable chunks, embeddings, Qdrant, and operational metrics.',
    'Pipeline do zero.': 'Pipeline from scratch.',
    'Construa uma versão local primeiro e adicione escala apenas quando houver evidência.': 'Build a local version first and add scale only when evidence supports it.',
    'Executar novamente com segurança': 'Run safely again',
    'A mesma entrada não deve gerar dados duplicados.': 'The same input must not generate duplicate data.',
    'Falhar antes de publicar': 'Fail before publishing',
    'Valide schema e regras antes da camada de consumo.': 'Validate schema and rules before the consumption layer.',
    'Explicar o estado atual': 'Explain the current state',
    'Saiba o que rodou, quando, com qual volume e resultado.': 'Know what ran, when it ran, and with what volume and result.',

    // Machine Learning subject
    'Construa modelos com baselines, avaliações honestas e interpretação ligada ao custo real dos erros.': 'Build models with baselines, honest evaluations, and interpretation tied to the real cost of errors.',
    'Trilha prática de Machine Learning da Code Zone.': 'Practical Code Zone Machine Learning path.',
    'Modelo bom resolve o problema.': 'A good model solves the problem.',
    'A métrica não é o produto. A trilha ensina a construir um workflow reproduzível, comparar contra baselines e interpretar falhas por segmento.': 'The metric is not the product. This path teaches you to build a reproducible workflow, compare against baselines, and interpret failures by segment.',
    'Cada bloco reduz uma fonte comum de falsa confiança em modelos.': 'Each block reduces a common source of false confidence in models.',
    'Do baseline à decisão.': 'From baseline to decision.',
    'Experimentar': 'Experiment',
    'Separe dados, hipóteses, baselines e comparações justas.': 'Separate data, hypotheses, baselines, and fair comparisons.',
    'Avaliar': 'Evaluate',
    'Escolha métricas coerentes e investigue distribuição de erros.': 'Choose appropriate metrics and investigate error distributions.',
    'Interpretar': 'Interpret',
    'Conecte previsões a decisões, riscos e limites operacionais.': 'Connect predictions to decisions, risks, and operational limits.',
    'Problema e baseline': 'Problem and baseline',
    'Target, horizonte, custo do erro e referência mínima.': 'Target, horizon, error cost, and minimum reference.',
    'Features e pipeline': 'Features and pipeline',
    'Transformações reproduzíveis, vazamento e validação.': 'Reproducible transformations, leakage, and validation.',
    'Treino e avaliação': 'Training and evaluation',
    'Cross-validation, métricas, tuning e análise de erro.': 'Cross-validation, metrics, tuning, and error analysis.',
    'Interpretação e operação': 'Interpretation and operations',
    'Explicabilidade, drift, latência, custo e monitoramento.': 'Explainability, drift, latency, cost, and monitoring.',
    'Modelos com contexto operacional.': 'Models with operational context.',
    'Estude problemas de regressão, forecasting e segmentação com entregas completas.': 'Study regression, forecasting, and segmentation problems through complete deliverables.',
    'Estime vida útil remanescente, detecte degradação e interprete sensores industriais.': 'Estimate remaining useful life, detect degradation, and interpret industrial sensors.',
    'Compare séries temporais e modelos de árvore, depois segmente produtos por potencial.': 'Compare time series and tree models, then segment products by potential.',
    'Supera uma regra simples?': 'Does it beat a simple rule?',
    'Compare sempre com a alternativa mais barata e explicável.': 'Always compare against the cheapest explainable alternative.',
    'O futuro vazou para o treino?': 'Did the future leak into training?',
    'Separe dados respeitando o momento da decisão.': 'Split data according to the decision time.',
    'Onde o modelo falha?': 'Where does the model fail?',
    'Avalie grupos críticos, não apenas a média global.': 'Evaluate critical groups, not just the global average.',

    // Generative AI subject
    'Projete aplicações com LLMs, contexto, ferramentas e avaliações que vão além de uma demonstração de prompt.': 'Design applications with LLMs, context, tools, and evaluations that go beyond a prompt demo.',
    'Trilha de Generative AI, RAG e agentes da Code Zone.': 'Code Zone Generative AI, RAG, and agents path.',
    'LLM é componente, não arquitetura.': 'An LLM is a component, not an architecture.',
    'A trilha organiza as decisões em torno de contexto, ferramentas, confiabilidade e avaliação. Use complexidade apenas quando o caso exigir.': 'This path organizes decisions around context, tools, reliability, and evaluation. Use complexity only when the case requires it.',
    'O modelo precisa desse dado?': 'Does the model need this data?',
    'Conecte o modelo a conhecimento externo com fontes rastreáveis.': 'Connect the model to external knowledge with traceable sources.',
    'O fluxo exige autonomia?': 'Does the workflow require autonomy?',
    'Integre APIs e funções com contratos e validação.': 'Integrate APIs and functions with contracts and validation.',
    'Como saber se melhorou?': 'How do you know it improved?',
    'Meça qualidade, segurança, custo e latência separadamente.': 'Measure quality, safety, cost, and latency separately.',
    'Prompts e saídas estruturadas': 'Prompts and structured outputs',
    'Instruções, contexto, schemas e validação de resposta.': 'Instructions, context, schemas, and response validation.',
    'RAG fundamental': 'RAG foundations',
    'Chunking, embeddings, retrieval e resposta com fontes.': 'Chunking, embeddings, retrieval, and sourced answers.',
    'Ferramentas e agentes': 'Tools and agents',
    'Tool calling, estado, limites e fluxos iterativos.': 'Tool calling, state, boundaries, and iterative workflows.',
    'Avaliação e operação': 'Evaluation and operations',
    'Datasets de teste, traces, custo, segurança e regressão.': 'Test datasets, traces, cost, safety, and regression.',
    'Do prompt ao sistema.': 'From prompt to system.',
    'Os repositórios mostram a passagem de um baseline simples para sistemas persistidos e observáveis.': 'The repositories show the transition from a simple baseline to persistent, observable systems.',
    'Compare RAG ingênuo, LlamaIndex, LangChain, tabular, GraphRAG, Neo4j e ontologias.': 'Compare naive RAG, LlamaIndex, LangChain, tabular approaches, GraphRAG, Neo4j, and ontologies.',
    'PDF, Qdrant, metadados ricos, debug de retrieval, métricas e LangSmith.': 'PDF, Qdrant, rich metadata, retrieval debugging, metrics, and LangSmith.',
    'Defina casos e critérios antes de trocar componentes.': 'Define cases and criteria before replacing components.',
    'Recupere o mínimo necessário e preserve a fonte.': 'Retrieve only what is necessary and preserve the source.',
    'Prefira pipelines determinísticos quando forem suficientes.': 'Prefer deterministic pipelines when they are sufficient.',
    'Aumente a maturidade em blocos comparáveis e testáveis.': 'Increase maturity through comparable, testable blocks.',
    'Evolua padrões de RAG.': 'Advance through RAG patterns.',

    // GraphRAG subject
    'Conecte entidades, relações e recuperação semântica para responder perguntas que exigem estrutura, contexto e múltiplos saltos.': 'Connect entities, relationships, and semantic retrieval to answer questions that require structure, context, and multiple hops.',
    'Trilha avançada de GraphRAG, knowledge graphs e recuperação híbrida.': 'Advanced GraphRAG, knowledge graphs, and hybrid retrieval path.',
    'Conhecimento também tem estrutura.': 'Knowledge also has structure.',
    'GraphRAG combina busca, modelagem de domínio e travessia de relações. A trilha mostra quando o grafo é necessário e como mantê-lo governável.': 'GraphRAG combines search, domain modeling, and relationship traversal. This path shows when a graph is necessary and how to keep it governable.',
    'Extrair': 'Extract',
    'Converta texto e tabelas em entidades e relações validadas.': 'Convert text and tables into validated entities and relationships.',
    'Recuperar': 'Retrieve',
    'Combine vetores, Cypher e subgrafos com evidências.': 'Combine vectors, Cypher, and subgraphs with evidence.',
    'Governar': 'Govern',
    'Use ontologias, IDs e contratos para limitar drift estrutural.': 'Use ontologies, IDs, and contracts to limit structural drift.',
    'Modelagem de domínio': 'Domain modeling',
    'Entidades, relações, propriedades, IDs e ontologia.': 'Entities, relationships, properties, IDs, and ontology.',
    'Extração estruturada': 'Structured extraction',
    'LLMs, schemas Pydantic, normalização e resolução de entidades.': 'LLMs, Pydantic schemas, normalization, and entity resolution.',
    'Persistência e consulta': 'Persistence and querying',
    'Neo4j, Cypher, índices, constraints e inspeção.': 'Neo4j, Cypher, indexes, constraints, and inspection.',
    'Recuperação híbrida': 'Hybrid retrieval',
    'Busca vetorial, Text2Cypher, multi-hop e fontes.': 'Vector search, Text2Cypher, multi-hop reasoning, and sources.',
    'Três caminhos de implementação.': 'Three implementation paths.',
    'Compare dados tabulares, extração por LLM e evolução progressiva de padrões.': 'Compare tabular data, LLM extraction, and progressive pattern evolution.',
    'Construa grafos de dados estruturados com LangChain ou Neo4j + Text2Cypher validado.': 'Build graphs from structured data with LangChain or Neo4j plus validated Text2Cypher.',
    'Extraia nodes e relationships com ontologia YAML, Pydantic e saída JSONL.': 'Extract nodes and relationships with a YAML ontology, Pydantic, and JSONL output.',
    'Acompanhe a evolução até GraphRAG com Neo4j e ontologia governável.': 'Follow the evolution toward GraphRAG with Neo4j and a governable ontology.',
    'Ontologia como contrato': 'Ontology as a contract',
    'Limite labels, relações e combinações válidas.': 'Limit labels, relationships, and valid combinations.',
    'Cypher antes de executar': 'Review Cypher before execution',
    'Valide queries geradas e aplique limites de leitura.': 'Validate generated queries and enforce read limits.',
    'Subgrafo como evidência': 'Subgraph as evidence',
    'Exiba os nodes e relações usados na resposta.': 'Display the nodes and relationships used in the answer.',
    'Cada módulo produz um artefato inspecionável que alimenta o próximo.': 'Each module produces an inspectable artifact that feeds the next one.',

    // APIs subject
    'Transforme lógica de negócio em serviços claros, seguros, observáveis e preparados para evoluir.': 'Turn business logic into clear, secure, observable services built to evolve.',
    'Trilha de APIs e sistemas da Code Zone.': 'Code Zone APIs and systems path.',
    'Serviços que entregam produto.': 'Services that deliver products.',
    'Uma API é uma fronteira entre sistemas e equipes. A trilha prioriza contratos previsíveis, falhas explícitas e operação observável.': 'An API is a boundary between systems and teams. This path prioritizes predictable contracts, explicit failures, and observable operations.',
    'Modele recursos, schemas, erros e versionamento.': 'Model resources, schemas, errors, and versioning.',
    'Proteger': 'Protect',
    'Valide entrada, identidade, autorização e limites.': 'Validate input, identity, authorization, and limits.',
    'Operar': 'Operate',
    'Use logs, métricas, tracing e estratégias de recuperação.': 'Use logs, metrics, tracing, and recovery strategies.',
    'HTTP e recursos': 'HTTP and resources',
    'Métodos, status, URLs, representação e idempotência.': 'Methods, status codes, URLs, representation, and idempotency.',
    'Contratos e validação': 'Contracts and validation',
    'OpenAPI, schemas, erros consistentes e testes de contrato.': 'OpenAPI, schemas, consistent errors, and contract tests.',
    'Dados e segurança': 'Data and security',
    'Persistência, transações, autenticação e autorização.': 'Persistence, transactions, authentication, and authorization.',
    'Resiliência e observabilidade': 'Resilience and observability',
    'Timeouts, retries, rate limits, logs, métricas e traces.': 'Timeouts, retries, rate limits, logs, metrics, and traces.',
    'APIs conectadas a produto.': 'APIs connected to products.',
    'Estude APIs conectadas a dashboards e fluxos de inteligência artificial.': 'Study APIs connected to dashboards and artificial intelligence workflows.',
    'FastAPI servindo filtros, indicadores e visualizações sobre dados de vendas.': 'FastAPI serving filters, indicators, and visualizations for sales data.',
    'CLI e interface para extração estruturada com contratos Pydantic e artefatos JSONL.': 'CLI and interface for structured extraction with Pydantic contracts and JSONL artifacts.',
    'Contrato antes do endpoint.': 'Contract before endpoint.',
    'Comece pelo fluxo principal e adicione confiabilidade nas fronteiras.': 'Start with the main flow and add reliability at the boundaries.',
    'OpenAPI atualizado': 'Up-to-date OpenAPI',
    'O contrato publicado deve representar o comportamento real.': 'The published contract must represent actual behavior.',
    'Timeouts e retries conscientes': 'Deliberate timeouts and retries',
    'Evite esperas infinitas e tempestades de repetição.': 'Avoid infinite waits and retry storms.',
    'Correlação ponta a ponta': 'End-to-end correlation',
    'Encontre uma requisição entre serviços e dependências.': 'Trace a request across services and dependencies.',
    'Serviço pronto para evoluir.': 'A service ready to evolve.',

    // Lesson
    'Manipulação de dados tabulares | Code Zone': 'Tabular Data Manipulation | Code Zone',
    'Aula prática de manipulação de dados tabulares com Pandas e testes de saúde de equipamentos.': 'Hands-on tabular data manipulation lesson with Pandas and equipment health tests.',
    'Voltar ao subject': 'Back to subject',
    'Use Pandas para descobrir se classificações repetidas de um mesmo equipamento são confiáveis ou contraditórias.': 'Use Pandas to determine whether repeated classifications of the same equipment are reliable or contradictory.',
    'Baixar Python': 'Download Python',
    'Resumo do conjunto de dados': 'Dataset summary',
    '01 · Contexto': '01 · Context',
    '02 · Exploração': '02 · Exploration',
    '04 · Inferência': '04 · Inference',
    'EXPLORAÇÃO': 'EXPLORATION',
    'INFERÊNCIA': 'INFERENCE',
    '// A PERGUNTA': '// THE QUESTION',
    'O equipamento mudou ou o teste falhou?': 'Did the equipment change, or did the test fail?',
    'Cada equipamento foi testado seis vezes. Se todas as classificações apontam para a mesma classe, existe consenso. Se cada teste produz uma resposta diferente, o processo de medição ou o classificador precisa ser investigado.': 'Each equipment unit was tested six times. If every classification points to the same class, there is consensus. If each test produces a different answer, the measurement process or classifier requires investigation.',
    'Operação normal': 'Normal operation',
    'Monitorar sinais': 'Monitor signals',
    'Planejar intervenção': 'Plan intervention',
    'Ação imediata': 'Immediate action',
    'Importante': 'Important',
    '`confidence_score` é a confiança fictícia do classificador. Ela não prova que a classe está correta; apenas mostra o quanto o modelo afirma confiar na própria previsão.': '`confidence_score` is the classifier’s fictional confidence. It does not prove the class is correct; it only shows how confident the model claims to be in its own prediction.',
    '// CONHEÇA A TABELA': '// UNDERSTAND THE TABLE',
    'Leia antes de transformar.': 'Read before transforming.',
    'Comece pelo esquema, tipos, ausentes, estatísticas descritivas e cardinalidade. Essa auditoria evita que um agrupamento elegante responda à pergunta errada.': 'Start with the schema, types, missing values, descriptive statistics, and cardinality. This audit prevents an elegant grouping from answering the wrong question.',
    'Carregando amostra do CSV...': 'Loading CSV sample...',
    'Distribuição das classes': 'Class distribution',
    '// UMA LINHA POR EQUIPAMENTO': '// ONE ROW PER EQUIPMENT',
    'Meça o grau de concordância.': 'Measure the level of agreement.',
    'A granularidade muda de um teste por linha para um equipamento por linha. A moda representa a classe dominante e a taxa de concordância mede quantos testes sustentam essa classe.': 'Granularity changes from one test per row to one equipment unit per row. The mode represents the dominant class, and the agreement rate measures how many tests support that class.',
    'CLASSE DOMINANTE': 'DOMINANT CLASS',
    'CONCORDÂNCIA': 'AGREEMENT',
    'contagem da moda / testes': 'mode count / tests',
    'Consistência por equipamento': 'Consistency by equipment',
    'Filtrar resultados': 'Filter results',
    'Consistentes': 'Consistent',
    'Maioria': 'Majority',
    'Inconsistentes': 'Inconsistent',
    'Equipamento': 'Equipment',
    'Testes': 'Tests',
    'Classes únicas': 'Unique classes',
    'Classe dominante': 'Dominant class',
    'Concordância': 'Agreement',
    'Resultado': 'Result',
    'Calculando resultados...': 'Calculating results...',
    '// INCERTEZA EXPLÍCITA': '// EXPLICIT UNCERTAINTY',
    'Compare médias com intervalos.': 'Compare means with intervals.',
    'Agrupar a confiança por resultado permite investigar um padrão: testes contraditórios também apresentam menor confiança? O intervalo de 95% mostra a precisão da média estimada em cada grupo.': 'Grouping confidence by result lets us investigate a pattern: do contradictory tests also have lower confidence? The 95% interval shows the precision of the estimated mean for each group.',
    'Carregando relatório estatístico...': 'Loading statistical report...',
    'IC 95% = média ± 1,96 × erro padrão': '95% CI = mean ± 1.96 × standard error',
    'Aproximação normal didática. Uma validação industrial precisaria de amostra representativa, referência real de falha e análise temporal.': 'Instructional normal approximation. Industrial validation would require a representative sample, real failure ground truth, and time-based analysis.',
    'LEITURA DO CASO': 'CASE INTERPRETATION',
    'Divergência e baixa confiança aparecem juntas nesta base.': 'Divergence and low confidence appear together in this dataset.',
    'Os equipamentos consistentes têm confiança média próxima de 0,92. Nos inconsistentes, ela cai para aproximadamente 0,64. Isso é um sinal para investigação, não prova de causalidade.': 'Consistent equipment has mean confidence close to 0.92. For inconsistent equipment, it drops to approximately 0.64. This is a signal for investigation, not proof of causality.',
    'Você chegou a uma conclusão reproduzível.': 'You reached a reproducible conclusion.',
    'O CSV permanece bruto, o script registra as regras e cinco relatórios guardam os resultados.': 'The CSV remains raw, the script records the rules, and five reports preserve the results.',
    'Marcar bloco como concluído': 'Mark block as complete',
    'Marcar bloco como concluído ': 'Mark block as complete ',
    'Bloco concluído ': 'Block completed ',
    'Voltar para Data Analytics ↗': 'Back to Data Analytics ↗',
    'ABRIR GUIA TÉCNICO ↗': 'OPEN TECHNICAL GUIDE ↗',
    'confiança média': 'mean confidence',
    'Consistente': 'Consistent',
    'Maioria estável': 'Stable majority',
    'Inconsistente': 'Inconsistent',
    'CONSISTENTE': 'CONSISTENT',
    'MAIORIA ESTÁVEL': 'STABLE MAJORITY',
    'INCONSISTENTE': 'INCONSISTENT',
    'Bloco concluído': 'Block completed',
    'Selecione o código': 'Select the code',
    'Seu próximo': 'Your next',
    'começa aqui.': 'starts here.',
    'RECOMEÇAR A BASE': 'RESTART THE FOUNDATION',
    'PARA A CAPACIDADE.': 'TO CAPABILITY.'
  };

  const originalText = new WeakMap();
  const originalAttributes = new WeakMap();
  const skippedTags = new Set(['SCRIPT', 'STYLE', 'CODE', 'PRE', 'NOSCRIPT']);
  let observer;
  let activeLanguage = 'pt-BR';

  const translatePattern = (value) => {
    const patterns = [
      [/^(\d+) semanas$/, '$1 weeks'],
      [/^(\d+) projetos$/, '$1 projects'],
      [/^(\d+) entregas$/, '$1 deliverables'],
      [/^(\d+) módulos$/, '$1 modules'],
      [/^(\d+) blocos$/, '$1 blocks'],
      [/^(\d+)\/([0-9]+) módulos$/, '$1/$2 modules'],
      [/^(\d+)\/([0-9]+) blocos$/, '$1/$2 blocks'],
      [/^(\d+)% concluído$/, '$1% complete'],
      [/^IC 95% · (.+)$/, '95% CI · $1'],
      [/^Marcar (.+) como concluído$/, 'Mark $1 as complete'],
      [/^Abrir (.+) ↗$/, 'Open $1 ↗']
    ];

    for (const [pattern, replacement] of patterns) {
      if (pattern.test(value)) return value.replace(pattern, replacement);
    }
    return value;
  };

  const translate = (value, language = activeLanguage) => {
    if (language !== 'en' || !value) return value;
    return english[value] || translatePattern(value);
  };

  const shouldSkip = (node) => {
    const parent = node.parentElement;
    return !parent || skippedTags.has(parent.tagName) || parent.closest('[data-i18n-ignore]');
  };

  const translateTextNode = (node, language) => {
    if (shouldSkip(node)) return;
    if (!originalText.has(node)) originalText.set(node, node.nodeValue);
    const source = originalText.get(node);
    const trimmed = source.trim();
    if (!trimmed) return;
    const leading = source.match(/^\s*/)?.[0] || '';
    const trailing = source.match(/\s*$/)?.[0] || '';
    node.nodeValue = `${leading}${translate(trimmed, language)}${trailing}`;
  };

  const translateAttributes = (element, language, refreshOriginal = false) => {
    const attributes = ['aria-label', 'placeholder', 'title'];
    if (!originalAttributes.has(element)) originalAttributes.set(element, {});
    const originals = originalAttributes.get(element);

    attributes.forEach((attribute) => {
      if (!element.hasAttribute(attribute)) return;
      if (!(attribute in originals) || refreshOriginal) originals[attribute] = element.getAttribute(attribute);
      element.setAttribute(attribute, translate(originals[attribute], language));
    });
  };

  const translateTree = (root, language) => {
    if (root.nodeType === Node.TEXT_NODE) {
      translateTextNode(root, language);
      return;
    }
    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) return;

    if (root.nodeType === Node.ELEMENT_NODE) translateAttributes(root, language);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node) {
      if (node.nodeType === Node.TEXT_NODE) translateTextNode(node, language);
      else translateAttributes(node, language);
      node = walker.nextNode();
    }
  };

  const updateSwitcher = () => {
    document.querySelectorAll('[data-language]').forEach((button) => {
      const selected = button.dataset.language === activeLanguage;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    const switcher = document.querySelector('.language-switcher');
    if (switcher) switcher.setAttribute('aria-label', activeLanguage === 'en' ? 'Choose language' : 'Escolher idioma');
  };

  const applyLanguage = (language, persist = true) => {
    activeLanguage = SUPPORTED_LANGUAGES.includes(language) ? language : 'pt-BR';
    observer?.disconnect();
    document.documentElement.lang = activeLanguage;
    document.title = translate(document.documentElement.dataset.originalTitle || document.title, activeLanguage);
    document.documentElement.dataset.originalTitle ||= document.title;

    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.dataset.originalContent ||= description.content;
      description.content = translate(description.dataset.originalContent, activeLanguage);
    }

    translateTree(document.body, activeLanguage);
    updateSwitcher();
    if (persist) {
      try { localStorage.setItem(STORAGE_KEY, activeLanguage); } catch { /* Language still works for this page. */ }
      const url = new URL(window.location.href);
      url.searchParams.set('lang', activeLanguage);
      window.history?.replaceState?.({}, '', url);
    }
    observeChanges();
    window.dispatchEvent(new CustomEvent('codezone:languagechange', { detail: { language: activeLanguage } }));
  };

  const observeChanges = () => {
    observer = new MutationObserver((mutations) => {
      observer.disconnect();
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => translateTree(node, activeLanguage));
        } else if (mutation.type === 'attributes') {
          translateAttributes(mutation.target, activeLanguage, true);
        }
      });
      observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['aria-label', 'placeholder', 'title'] });
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['aria-label', 'placeholder', 'title'] });
  };

  const createSwitcher = () => {
    const navShell = document.querySelector('.nav-shell');
    if (!navShell || navShell.querySelector('.language-switcher')) return;

    const switcher = document.createElement('div');
    switcher.className = 'language-switcher';
    switcher.setAttribute('role', 'group');
    ['pt-BR', 'en'].forEach((language) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.language = language;
      button.textContent = language === 'pt-BR' ? 'PT' : 'EN';
      button.addEventListener('click', () => applyLanguage(language));
      switcher.appendChild(button);
    });

    const cta = navShell.querySelector('.header-cta');
    navShell.insertBefore(switcher, cta || null);
  };

  const readInitialLanguage = () => {
    const queryLanguage = new URLSearchParams(window.location.search).get('lang');
    if (SUPPORTED_LANGUAGES.includes(queryLanguage)) return queryLanguage;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (SUPPORTED_LANGUAGES.includes(stored)) return stored;
    } catch {
      // Fall through to browser preference.
    }
    return navigator.language?.toLowerCase().startsWith('en') ? 'en' : 'pt-BR';
  };

  window.codeZoneI18n = {
    get language() { return activeLanguage; },
    setLanguage: applyLanguage,
    t: translate
  };

  document.documentElement.dataset.originalTitle = document.title;
  createSwitcher();
  applyLanguage(readInitialLanguage(), false);
})();
