# Feature Specification: Nova versão do site do Professor Ricardo Rios

**Feature Branch**: `001-site-institucional`

**Created**: 2026-10-12

**Status**: Draft

**Input**: User description: "Nova versão do site do professor Ricardo Rios (https://professorricardorios.com.br/), em HTML, CSS e JS, usando o conteúdo atual como base."

## Contexto: conteúdo atual (base da nova versão)

Inventário levantado em 2026-10-12 a partir do site publicado:

- **Menu**: Início, Sobre, Cursos (submenu Reforma Tributária), Livros, Podcasts, Blog; botão
  "Inscreva-se no curso".
- **Início — destaque principal**: "Aprenda IA e Reforma Tributária / com quem é referência no
  assunto"; botões "Quero meu curso agora" (Hotmart) e "Conheça os livros e o canal".
- **Cursos**: destaque "Curso Reforma Tributária" (leva à página do curso); lista "Cursos que
  transformam sua prática profissional": "Desvendando a Reforma Tributária - Passo a Passo",
  "Holding Familiar na Prática" e um card sem conteúdo real ("Título"). Indicadores
  "Inteligência Artificial 100%" e "Reforma Tributária 100%" sem contexto.
- **Sobre ("Aprenda com Ricardo Rios" / "Minha história")**: Pós-Doutor em Ciências Contábeis,
  Controladoria e Finanças; Doutor em Educação; Mestre em Ciências Contábeis (PUC-SP); 25+ anos
  em contabilidade tributária; quase duas décadas no ensino superior; Diretor Acadêmico e
  Coordenador de Ciências Contábeis na UNISÃOROQUE; empresário contábil, colunista do Portal
  Contábeis e palestrante; criador dos cursos Contabilidade 4.0 e IFRS na Prática; Troféu Cultura
  Econômica 2012 ("Normas e Práticas Contábeis: Uma Introdução"); Medalha Francisco D'Auria
  CRC-SP (2024).
- **Livros ("Leitura que aproxima" / "Teoria e prática contábil")**: destaque "Holding Familiar";
  "Contabilidade Avançada" (3ª ed.), "Manual do Contador" e "Contabilidade para Executivos"
  (coautorias com José Carlos Marion e Adalberto Cardoso); link para a página de autor na Amazon.
- **Podcasts**: "Contabilizando com Ricardo Rios" (parceria Portal Contábeis); hoje com 4
  episódios vazios; link "mais episódios".
- **Vídeos ("Canal CONFI")**: "Aprenda gratuitamente com vídeos e artigos."; 2 vídeos do YouTube
  e link para o canal.
- **Página "Desvendando a Reforma Tributária Passo a Passo"**: selo "Matrículas abertas";
  apresentação (IBS, CBS, IS, transição, EC 132/2023, LC 214/2025, IVA Dual, Split Payment);
  instrutor; 5 benefícios; 4 módulos com carga horária; 6 perguntas frequentes; botão
  "Garantir minha vaga" (Hotmart).
- **Blog "Blog Contábil & Financeiro"**: artigos nas categorias Tecnologia & IA, Reforma
  Tributária e Contabilidade, com data, categoria e resumo; blocos "Últimos artigos" e
  "Veja os destaques do momento"; sem busca nem paginação; listagem fora de ordem cronológica.
- **Política de privacidade**: 8 seções (coleta, uso, compartilhamento, armazenamento e
  segurança, cookies, direitos do titular, alterações, contato); contato
  contato@professorricardorios.com.br; sem data visível.
- **Rodapé**: links rápidos, Instagram, LinkedIn, YouTube, TikTok, "© 2025 Professor Ricardo
  Rios - Todos os direitos reservados."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Conhecer o professor e chegar à compra de um curso (Priority: P1)

Um contador, advogado, empresário ou estudante chega à página inicial (por busca, rede social
ou indicação), entende em segundos quem é o professor e o que ele ensina (IA e Reforma
Tributária), vê os cursos disponíveis e segue para a página de compra do curso escolhido.

**Why this priority**: a venda de cursos é o principal objetivo de negócio do site; sem este
fluxo o site não cumpre sua função.

**Independent Test**: publicar apenas a página inicial com destaque principal, seção de cursos e
rodapé; um visitante consegue, do primeiro acesso, chegar à página de compra correta de cada
curso.

**Acceptance Scenarios**:

1. **Given** um visitante na página inicial em um celular, **When** a página carrega, **Then**
   ele vê o título principal, a proposta de valor e um botão de ação para cursos sem precisar
   rolar a tela.
2. **Given** a seção de cursos, **When** o visitante escolhe um curso, **Then** ele é levado à
   página daquele curso específico (página própria do site ou página de compra), nunca a um
   link genérico ou de outro curso.
3. **Given** qualquer página, **When** o visitante clica em "Inscreva-se no curso" no
   cabeçalho, **Then** ele chega à seção de cursos.
4. **Given** a seção de cursos, **When** ela é exibida, **Then** não há cards de exemplo,
   títulos genéricos ("Título"), textos repetidos de outro curso ou indicadores sem contexto.

---

### User Story 2 - Avaliar e se inscrever no curso de Reforma Tributária (Priority: P2)

Um profissional interessado na Reforma Tributária abre a página do curso "Desvendando a Reforma
Tributária Passo a Passo", entende o conteúdo, a estrutura em módulos, para quem é, tira dúvidas
nas perguntas frequentes e clica para garantir a vaga.

**Why this priority**: é o curso carro-chefe e a única página de vendas própria do site.

**Independent Test**: publicar somente a página do curso; um visitante encontra todas as
informações de decisão e chega à página de inscrição.

**Acceptance Scenarios**:

1. **Given** a página do curso, **When** o visitante a percorre, **Then** encontra: selo de
   status das matrículas, apresentação, instrutor, benefícios, os 4 módulos com carga horária,
   perguntas frequentes e garantia.
2. **Given** as perguntas frequentes, **When** o visitante seleciona uma pergunta, **Then** a
   resposta é exibida e pode ser recolhida, por mouse, toque ou teclado.
3. **Given** a página do curso, **When** o visitante clica em qualquer botão de inscrição,
   **Then** é levado à página de compra do curso, e o botão de inscrição permanece acessível ao
   longo da página.

---

### User Story 3 - Conferir a credibilidade do professor e seus livros (Priority: P3)

Um visitante quer saber quem é o professor antes de comprar ou contratar uma palestra: lê a
trajetória (formação, cargos, prêmios) e vê os livros publicados, podendo seguir para a loja.

**Why this priority**: a autoridade do professor sustenta a decisão de compra e gera convites
para palestras.

**Independent Test**: publicar as seções Sobre e Livros; o visitante encontra formação, cargos,
prêmios e acessa cada livro na loja.

**Acceptance Scenarios**:

1. **Given** a seção Sobre, **When** exibida, **Then** apresenta foto, resumo, formação
   acadêmica, atuação profissional e prêmios, organizados para leitura rápida.
2. **Given** a seção Livros, **When** o visitante escolhe um livro, **Then** vê capa, título,
   coautores e um link que abre a loja em nova aba com aviso de que sairá do site.

---

### User Story 4 - Ver a prévia do blog (Priority: P4)

Um profissional interessado em atualização sobre Reforma Tributária, contabilidade ou IA
encontra uma prévia do blog com alguns artigos de exemplo, filtra por categoria e lê um artigo.
Nesta versão o blog é uma vitrine reduzida; a gestão completa de artigos virá com um CMS
futuro, sem necessidade de refazer as páginas.

**Why this priority**: mostra que o professor produz conteúdo e prepara o terreno para o blog
completo, mas não é o caminho principal de conversão nesta versão.

**Independent Test**: publicar a página do blog com os artigos de exemplo; o visitante lista,
filtra por categoria, abre e lê um artigo, e volta à lista.

**Acceptance Scenarios**:

1. **Given** a página do blog, **When** carregada, **Then** exibe os artigos de exemplo em ordem
   cronológica decrescente, cada um com título, data, categoria, resumo e imagem.
2. **Given** a página do blog, **When** o visitante escolhe uma categoria, **Then** apenas os
   artigos dessa categoria são exibidos e a categoria escolhida fica indicada.
3. **Given** um artigo de exemplo, **When** aberto, **Then** exibe título, data, categoria,
   autor, texto, artigos relacionados e uma chamada para os cursos.
4. **Given** a página inicial, **When** o visitante a percorre, **Then** encontra um bloco com os
   3 artigos mais recentes e um link para o blog.
5. **Given** um link antigo do blog ou de artigo, **When** acessado, **Then** o visitante chega à
   página do blog da nova versão.

---

### User Story 5 - Ouvir podcasts e assistir vídeos gratuitos (Priority: P5)

Um visitante quer conteúdo gratuito: vê os episódios mais recentes do podcast "Contabilizando" e
os últimos vídeos do canal CONFI, e pode seguir para o podcast ou o canal.

**Why this priority**: conteúdo gratuito gera confiança e audiência, mas não é o caminho
principal de conversão.

**Independent Test**: publicar a seção de podcasts e vídeos; o visitante reproduz um vídeo ou
abre um episódio, e acessa o canal.

**Acceptance Scenarios**:

1. **Given** a seção de podcasts, **When** exibida, **Then** cada episódio tem título e leva ao
   episódio real; nenhum espaço vazio ou player quebrado aparece.
2. **Given** a seção de vídeos, **When** o visitante escolhe um vídeo, **Then** o vídeo só é
   carregado do serviço externo após essa escolha.

---

### User Story 6 - Entrar em contato e entender o uso dos meus dados (Priority: P6)

Um visitante (aluno, empresa ou organizador de evento) quer falar com o professor e saber como
seus dados são tratados.

**Why this priority**: necessário para conformidade com a LGPD e para receber convites de
palestras.

**Independent Test**: o visitante encontra um canal de contato, consulta a política de
privacidade e decide sobre cookies.

**Acceptance Scenarios**:

1. **Given** qualquer página, **When** o visitante procura contato, **Then** encontra no menu ou
   no rodapé o acesso à seção de contato, o e-mail e as redes sociais.
2. **Given** o primeiro acesso, **When** a página carrega, **Then** o visitante é informado
   sobre cookies e pode aceitar ou recusar os não essenciais, e a escolha é respeitada.
3. **Given** a política de privacidade, **When** aberta, **Then** apresenta as 8 seções, o
   responsável, o contato e a data da última atualização.
4. **Given** a seção de contato, **When** o visitante preenche nome, e-mail, assunto e mensagem,
   marca a ciência da política de privacidade e envia, **Then** recebe confirmação de envio na
   tela e a mensagem chega ao e-mail de contato do professor.
5. **Given** o formulário, **When** um campo obrigatório está vazio ou o e-mail é inválido,
   **Then** o erro é indicado junto ao campo, em texto, e o envio não ocorre.

---

### Edge Cases

- A página de compra externa (Hotmart, Amazon, YouTube, podcast) está fora do ar ou bloqueada:
  o restante do site continua funcionando e os links continuam visíveis.
- JavaScript desabilitado ou com falha: menu, conteúdos, links de compra, FAQ e artigos
  continuam acessíveis.
- Visitante chega por um endereço antigo (ex.: `/inicio/blog-contabil-financeiro/`,
  `/cursos-palestras-ia-reforma/blog-contabil-financeiro/`, `/#cursos`): é redirecionado ao
  conteúdo equivalente.
- Endereço inexistente: página "não encontrada" amigável com caminhos para Início, Cursos e Blog.
- Categoria sem artigos: mensagem explicativa em vez de lista vazia.
- Envio do formulário falha (sem conexão ou serviço indisponível): a mensagem digitada é mantida
  e o visitante vê o erro e o e-mail de contato como alternativa.
- Envio repetido ou automatizado (spam): é bloqueado sem prejudicar o visitante real.
- Títulos de artigos ou cursos muito longos: não quebram o layout em telas pequenas.
- Imagem ausente ou que falha ao carregar: o card mantém o layout e exibe texto alternativo.
- Matrículas encerradas: o selo e os botões do curso indicam o status correto em vez de
  "Matrículas abertas".
- Visitante recusa cookies: nenhum cookie não essencial ou serviço de rastreamento é carregado.

## Requirements *(mandatory)*

### Functional Requirements

**Navegação e estrutura**

- **FR-001**: O site MUST oferecer em todas as páginas um cabeçalho com marca, menu (Início,
  Sobre, Cursos — com acesso a Reforma Tributária —, Livros, Podcasts, Blog) e o botão
  "Inscreva-se no curso".
- **FR-002**: Em telas pequenas, o menu MUST ser recolhível e operável por toque e teclado.
- **FR-003**: O site MUST oferecer em todas as páginas um rodapé com links rápidos, redes sociais
  (Instagram, LinkedIn, YouTube, TikTok), e-mail de contato, link para a política de privacidade
  e aviso de direitos com o ano corrente.
- **FR-004**: Links que levam a outros sites MUST abrir em nova aba e indicar isso ao visitante.

**Página inicial**

- **FR-005**: A página inicial MUST conter, nesta ordem: destaque principal, cursos, sobre o
  professor, livros, podcasts, vídeos, prévia do blog, contato e rodapé, com o conteúdo do
  inventário acima revisado.
- **FR-006**: O destaque principal MUST apresentar a proposta "Aprenda IA e Reforma Tributária
  com quem é referência no assunto", uma foto do professor e duas ações: ir para os cursos e
  conhecer livros e canal.
- **FR-007**: A seção de cursos MUST listar cada curso com nome, descrição própria, público e
  link exclusivo para sua página ou página de compra; placeholders e indicadores sem contexto
  MUST ser removidos.
- **FR-008**: A seção Sobre MUST exibir formação, atuação profissional e prêmios do inventário.
- **FR-009**: A seção Livros MUST exibir o livro em destaque e os demais livros com capa,
  título, edição e coautores, e link para a loja.
- **FR-010**: A seção Podcasts MUST exibir apenas episódios reais com título e link, e um link
  para todos os episódios.
- **FR-011**: A seção Vídeos MUST exibir os vídeos mais recentes com título e um link para o
  canal; vídeos externos MUST ser carregados somente após a escolha do visitante.

**Página do curso Reforma Tributária**

- **FR-012**: A página MUST apresentar: status das matrículas, título, subtítulo, descrição,
  instrutor, os 5 benefícios, os 4 módulos (nome, carga horária, liberação, resumo), perguntas
  frequentes, garantia e chamadas para inscrição.
- **FR-013**: As perguntas frequentes MUST abrir e fechar individualmente e funcionar sem
  depender de recursos avançados do navegador.
- **FR-014**: A página MUST manter uma chamada de inscrição sempre acessível durante a rolagem
  em telas pequenas, sem cobrir o conteúdo.

**Blog (prévia)**

- **FR-015**: O blog MUST exibir uma prévia com 6 artigos de exemplo baseados nos temas atuais
  (2 por categoria), em ordem cronológica decrescente, com título, data, categoria, resumo e
  imagem.
- **FR-016**: O blog MUST permitir filtrar por categoria (Reforma Tributária, Contabilidade,
  Tecnologia & IA).
- **FR-017**: Cada artigo de exemplo MUST ter página própria com título, data, categoria, autor,
  imagem, conteúdo, artigos relacionados e chamada para os cursos.
- **FR-018**: O conteúdo dos artigos MUST ficar separado da apresentação, de forma que um CMS
  futuro possa fornecer os artigos sem alterar o layout das páginas.
- **FR-018a**: A página inicial MUST exibir os 3 artigos mais recentes com link para o blog.

**Contato**

- **FR-024**: O site MUST ter uma seção de contato com formulário (nome, e-mail, assunto —
  palestra, empresa, curso ou outro — e mensagem) e ciência obrigatória da política de
  privacidade.
- **FR-025**: O formulário MUST validar os campos antes do envio, informar erros junto a cada
  campo, confirmar o envio com sucesso e bloquear envios automatizados.
- **FR-026**: As mensagens MUST ser entregues ao e-mail de contato do professor; o site não
  armazena as mensagens.

**Privacidade, contato e SEO**

- **FR-019**: O site MUST exibir aviso de cookies no primeiro acesso, permitindo aceitar ou
  recusar cookies não essenciais, e permitir rever a escolha a qualquer momento.
- **FR-020**: A política de privacidade MUST ser publicada com as 8 seções atuais, responsável
  pelo tratamento, e-mail de contato e data da última atualização.
- **FR-021**: Os endereços atuais de páginas e âncoras públicas MUST continuar levando ao
  conteúdo equivalente; endereços do blog e de artigos antigos MUST levar à página do blog.
- **FR-022**: O site MUST ter uma página "não encontrada" com caminhos para Início, Cursos e
  Blog.
- **FR-023**: Cada página MUST ter título e descrição próprios para buscadores e para
  compartilhamento em redes sociais.

### Key Entities *(include if feature involves data)*

- **Curso**: nome, descrição curta, público-alvo, status das matrículas, link de compra,
  página própria (opcional), módulos, benefícios, perguntas frequentes.
- **Módulo**: nome, carga horária, liberação, resumo; pertence a um Curso.
- **Livro**: título, edição, coautores, capa, link para loja, destaque (sim/não).
- **Episódio de podcast**: título, data, link.
- **Vídeo**: título, identificador no serviço de vídeo, miniatura.
- **Artigo**: título, endereço (slug), data, categoria, autor, resumo, imagem, conteúdo,
  destaque (sim/não).
- **Categoria**: nome, endereço; agrupa Artigos.
- **Rede social**: nome, link.
- **Mensagem de contato**: nome, e-mail, assunto, mensagem, ciência da política; não é armazenada
  no site.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em teste com visitantes, 9 em cada 10 chegam à página de compra do curso desejado
  a partir da página inicial em até 3 cliques e menos de 1 minuto.
- **SC-002**: O conteúdo principal de qualquer página aparece em até 2,5 segundos em um celular
  com conexão 4G.
- **SC-003**: 100% dos links internos e de compra levam ao destino correto (zero links
  quebrados, vazios ou genéricos).
- **SC-004**: 100% das páginas podem ser usadas inteiramente pelo teclado e por leitor de tela,
  sem bloqueios.
- **SC-005**: As páginas são exibidas sem rolagem horizontal e com texto legível em celulares,
  tablets e computadores (larguras de 320px a 1920px).
- **SC-006**: 100% dos endereços antigos indexados levam a uma página válida da nova versão
  (nenhum "não encontrado") após o lançamento.
- **SC-009**: Um visitante envia uma mensagem de contato em menos de 2 minutos, e 100% das
  mensagens válidas chegam ao e-mail do professor.
- **SC-007**: Nenhum placeholder ("Título", espaços vazios, textos repetidos) existe no site
  publicado.
- **SC-008**: Os cliques em "inscrever-se"/"comprar" a partir do site aumentam em relação ao
  site atual nos 3 meses seguintes ao lançamento.

## Assumptions

- O conteúdo do site atual é a base; textos serão revisados para corrigir placeholders e
  erros de cópia, sem mudar a mensagem.
- A venda e a entrega dos cursos continuam em plataforma externa (Hotmart); o site não processa
  pagamentos nem possui área do aluno nesta versão.
- O curso "Holding Familiar na Prática" mantém o link de compra atual; o curso "Desvendando a
  Reforma Tributária" usa o link da sua página de vendas. Cursos sem página própria levam
  direto à página de compra.
- O card "Título" e os indicadores "100%" serão removidos; os 4 episódios vazios serão
  substituídos pelos episódios mais recentes do podcast "Contabilizando".
- A identidade visual (cores, tipografia, espaçamentos) segue o design system definido para o
  projeto.
- Fotos do professor, capas de livros e imagens dos artigos serão aproveitadas do site atual ou
  fornecidas pelo professor.
- O e-mail contato@professorricardorios.com.br continua sendo o canal oficial de contato.
- O site é apenas em português do Brasil.
- Blog: nesta versão há apenas uma prévia com artigos de exemplo; os artigos atuais não são
  migrados. A adoção de um CMS é um projeto futuro, fora do escopo desta especificação.
- Formulário de contato: as mensagens serão entregues por um serviço de envio de formulários,
  definido no plano.
