// Research catalog for every subject.
// Types accepted by the interface: paper, material, book.
window.codeZoneResearch = {
  python: [
    {
      type: 'material',
      title: 'PEP 8 - Style Guide for Python Code',
      url: 'https://peps.python.org/pep-0008/',
      description: 'Guia oficial para escrever Python legível e consistente.',
      meta: 'Python Enhancement Proposal',
      year: 'Atualizado',
      tags: ['style', 'quality']
    },
    {
      type: 'material',
      title: 'The Python Tutorial',
      url: 'https://docs.python.org/3/tutorial/',
      description: 'Percurso oficial pela linguagem, estruturas e biblioteca padrão.',
      meta: 'Python Documentation',
      year: 'Python 3',
      tags: ['fundamentals', 'official']
    },
    {
      type: 'book',
      title: 'Fluent Python, 2nd Edition',
      url: 'https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/',
      description: 'Aprofundamento prático no modelo de dados e nos recursos idiomáticos da linguagem.',
      meta: 'Luciano Ramalho · O’Reilly',
      year: '2022',
      tags: ['advanced', 'language']
    }
  ],
  matematica: [
    {
      type: 'paper',
      title: 'The Matrix Calculus You Need for Deep Learning',
      url: 'https://arxiv.org/abs/1802.01528',
      description: 'Derivadas matriciais apresentadas com foco direto em modelos de deep learning.',
      meta: 'Terence Parr · Jeremy Howard',
      year: '2018',
      tags: ['calculus', 'matrices']
    },
    {
      type: 'material',
      title: 'Seeing Theory',
      url: 'https://seeing-theory.brown.edu/',
      description: 'Introdução visual e interativa a probabilidade e estatística.',
      meta: 'Brown University',
      year: 'Interativo',
      tags: ['probability', 'visual']
    },
    {
      type: 'book',
      title: 'Mathematics for Machine Learning',
      url: 'https://mml-book.github.io/',
      description: 'Livro aberto sobre álgebra linear, cálculo e probabilidade aplicados a ML.',
      meta: 'Deisenroth · Faisal · Ong',
      year: '2020',
      tags: ['linear algebra', 'ml']
    }
  ],
  'data-science': [
    {
      type: 'paper',
      title: 'Tidy Data',
      url: 'https://www.jstatsoft.org/article/view/v059i10',
      description: 'Princípios para estruturar dados e tornar análises mais simples e reproduzíveis.',
      meta: 'Hadley Wickham · Journal of Statistical Software',
      year: '2014',
      tags: ['data design', 'reproducibility']
    },
    {
      type: 'material',
      title: 'pandas User Guide',
      url: 'https://pandas.pydata.org/docs/user_guide/index.html',
      description: 'Referência oficial para manipulação, transformação e análise tabular.',
      meta: 'pandas Documentation',
      year: 'Atualizado',
      tags: ['pandas', 'official']
    },
    {
      type: 'book',
      title: 'Fundamentals of Data Visualization',
      url: 'https://clauswilke.com/dataviz/',
      description: 'Livro aberto sobre escolhas visuais, percepção e comunicação honesta de dados.',
      meta: 'Claus O. Wilke',
      year: '2019',
      tags: ['visualization', 'communication']
    }
  ],
  'engenharia-dados': [
    {
      type: 'paper',
      title: 'The Dataflow Model',
      url: 'https://www.vldb.org/pvldb/vol8/p1792-Akidau.pdf',
      description: 'Modelo prático para processamento de dados batch e streaming em larga escala.',
      meta: 'Akidau et al. · Google',
      year: '2015',
      tags: ['streaming', 'dataflow']
    },
    {
      type: 'material',
      title: 'Model Contracts',
      url: 'https://docs.getdbt.com/docs/mesh/govern/model-contracts',
      description: 'Material oficial sobre contratos de schema e garantias para consumidores.',
      meta: 'dbt Documentation',
      year: 'Atualizado',
      tags: ['contracts', 'quality']
    },
    {
      type: 'book',
      title: 'Designing Data-Intensive Applications',
      url: 'https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/',
      description: 'Fundamentos de armazenamento, processamento, consistência e sistemas distribuídos.',
      meta: 'Martin Kleppmann · O’Reilly',
      year: '2017',
      tags: ['architecture', 'distributed systems']
    }
  ],
  'machine-learning': [
    {
      type: 'paper',
      title: 'Hidden Technical Debt in Machine Learning Systems',
      url: 'https://proceedings.neurips.cc/paper_files/paper/2015/hash/86df7dcfd896fcaf2674f757a2463eba-Abstract.html',
      description: 'Riscos sistêmicos que aparecem quando modelos deixam o notebook e entram em produção.',
      meta: 'Sculley et al. · NeurIPS',
      year: '2015',
      tags: ['mlops', 'technical debt']
    },
    {
      type: 'paper',
      title: 'Model Cards for Model Reporting',
      url: 'https://arxiv.org/abs/1810.03993',
      description: 'Proposta para documentar desempenho, contexto, limitações e uso responsável de modelos.',
      meta: 'Mitchell et al.',
      year: '2018',
      tags: ['documentation', 'responsible ai']
    },
    {
      type: 'book',
      title: 'An Introduction to Statistical Learning',
      url: 'https://www.statlearning.com/',
      description: 'Livro aberto com base estatística e aplicações práticas de machine learning.',
      meta: 'James · Witten · Hastie · Tibshirani · Taylor',
      year: '2023',
      tags: ['statistics', 'foundations']
    }
  ],
  genai: [
    {
      type: 'paper',
      title: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks',
      url: 'https://arxiv.org/abs/2005.11401',
      description: 'Paper que consolidou a combinação de recuperação externa e geração neural.',
      meta: 'Lewis et al.',
      year: '2020',
      tags: ['rag', 'retrieval']
    },
    {
      type: 'paper',
      title: 'ReAct: Synergizing Reasoning and Acting in Language Models',
      url: 'https://arxiv.org/abs/2210.03629',
      description: 'Integra raciocínio textual e ações para resolver tarefas com ferramentas.',
      meta: 'Yao et al.',
      year: '2022',
      tags: ['agents', 'tool use']
    },
    {
      type: 'book',
      title: 'Hands-On Large Language Models',
      url: 'https://www.oreilly.com/library/view/hands-on-large-language/9781098150952/',
      description: 'Abordagem visual e prática para embeddings, transformers e aplicações com LLMs.',
      meta: 'Jay Alammar · Maarten Grootendorst · O’Reilly',
      year: '2024',
      tags: ['llm', 'applications']
    }
  ],
  graphrag: [
    {
      type: 'paper',
      title: 'From Local to Global: A Graph RAG Approach',
      url: 'https://arxiv.org/abs/2404.16130',
      description: 'GraphRAG para sumarização orientada a perguntas sobre grandes coleções de texto.',
      meta: 'Edge et al. · Microsoft Research',
      year: '2024',
      tags: ['graphrag', 'summarization']
    },
    {
      type: 'material',
      title: 'Microsoft GraphRAG Documentation',
      url: 'https://microsoft.github.io/graphrag/',
      description: 'Documentação oficial de indexação, configuração, consulta e arquitetura do GraphRAG.',
      meta: 'Microsoft Research',
      year: 'Atualizado',
      tags: ['implementation', 'official']
    },
    {
      type: 'book',
      title: 'Knowledge Graphs',
      url: 'https://arxiv.org/abs/2003.02320',
      description: 'Visão abrangente de representação, aquisição, qualidade e aplicações de knowledge graphs.',
      meta: 'Hogan et al.',
      year: '2021',
      tags: ['knowledge graphs', 'foundations']
    }
  ],
  apis: [
    {
      type: 'paper',
      title: 'Architectural Styles and the Design of Network-based Software Architectures',
      url: 'https://ics.uci.edu/~fielding/pubs/dissertation/top.htm',
      description: 'A dissertação que apresenta REST dentro de um contexto arquitetural mais amplo.',
      meta: 'Roy Thomas Fielding',
      year: '2000',
      tags: ['rest', 'architecture']
    },
    {
      type: 'material',
      title: 'RFC 9110 - HTTP Semantics',
      url: 'https://www.rfc-editor.org/rfc/rfc9110',
      description: 'Especificação de referência para métodos, status, representações e semântica HTTP.',
      meta: 'IETF · RFC Editor',
      year: '2022',
      tags: ['http', 'standard']
    },
    {
      type: 'book',
      title: 'API Design Patterns',
      url: 'https://www.manning.com/books/api-design-patterns',
      description: 'Padrões para recursos, operações, versionamento, paginação e evolução de APIs.',
      meta: 'JJ Geewax · Manning',
      year: '2021',
      tags: ['api design', 'patterns']
    }
  ]
};
