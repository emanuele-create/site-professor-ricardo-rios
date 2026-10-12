<!--
Sync Impact Report
- Version change: (template) → 1.0.0
- Modified principles: placeholders → definidos
  - [PRINCIPLE_1_NAME] → I. Usabilidade e Acessibilidade
  - [PRINCIPLE_2_NAME] → II. Design Responsivo
  - [PRINCIPLE_3_NAME] → III. Segurança
  - [PRINCIPLE_4_NAME] → IV. Escalabilidade e Desempenho
  - [PRINCIPLE_5_NAME] → V. Manutenibilidade
- Added sections: Restrições Técnicas; Fluxo de Desenvolvimento e Portões de Qualidade
- Removed sections: nenhuma
- Templates: nenhum arquivo de template modificado (lidos em tempo de execução)
- Follow-up TODOs: nenhum
-->

# Site Professor Ricardo Rios Constitution

## Core Principles

### I. Usabilidade e Acessibilidade

A interface DEVE ser intuitiva, fácil de navegar e acessível a diferentes perfis de usuários
e dispositivos.

- O site DEVE atender às WCAG 2.2 nível AA.
- Toda página DEVE usar HTML semântico (`header`, `nav`, `main`, `footer`, hierarquia de
  títulos sem saltos, um único `h1`) e declarar `lang="pt-BR"`.
- Toda funcionalidade DEVE ser operável apenas pelo teclado, com foco sempre visível e um link
  "Pular para o conteúdo" no início da página.
- Contraste mínimo DEVE ser 4.5:1 para texto normal e 3:1 para texto grande e componentes
  de interface.
- Imagens informativas DEVEM ter `alt` descritivo; imagens decorativas DEVEM ter `alt=""`.
- Formulários DEVEM ter `label` associado a cada campo e mensagens de erro anunciadas por
  leitores de tela.
- Animações DEVEM respeitar `prefers-reduced-motion`.
- A navegação principal DEVE levar a qualquer conteúdo-chave em no máximo 3 cliques.

**Justificativa**: o público do professor é amplo (alunos, pais, parceiros) e inclui pessoas
com deficiência; acessibilidade também melhora SEO e usabilidade geral.

### II. Design Responsivo

O site DEVE se adaptar perfeitamente a computadores, tablets e smartphones.

- O desenvolvimento DEVE ser mobile-first, com layouts fluidos (Grid/Flexbox) e unidades
  relativas (`rem`, `%`, `clamp()`).
- O layout DEVE funcionar sem rolagem horizontal de 320px a 1920px de largura, sendo validado
  no mínimo em 360px, 768px, 1024px e 1440px.
- Alvos de toque DEVEM ter no mínimo 44×44px.
- Imagens DEVEM ser responsivas (`srcset`/`sizes` ou `<picture>`), com `width`/`height`
  declarados para evitar deslocamento de layout.
- O conteúdo DEVE permanecer legível e funcional com zoom de 200%.

**Justificativa**: a maioria dos acessos a sites pessoais e educacionais vem de celulares.

### III. Segurança

O site DEVE ser protegido contra vulnerabilidades conhecidas em todas as camadas.

- Todo tráfego DEVE ser servido via HTTPS (TLS 1.2+), com redirecionamento de HTTP e cabeçalho
  HSTS.
- O servidor DEVE enviar cabeçalhos de segurança: `Content-Security-Policy` restritiva,
  `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy` e proteção contra
  enquadramento (`frame-ancestors`).
- JavaScript inline e `eval` são PROIBIDOS; scripts de terceiros DEVEM usar Subresource
  Integrity (SRI) e ser justificados.
- Conteúdo dinâmico DEVE ser inserido com `textContent`/APIs seguras do DOM; `innerHTML` com
  dados externos é PROIBIDO.
- Formulários DEVEM ter validação no cliente e no serviço que os recebe, e proteção anti-spam
  (ex.: honeypot ou CAPTCHA acessível).
- Qualquer área restrita DEVE usar um provedor de autenticação consolidado; credenciais,
  chaves secretas e tokens NUNCA podem estar no código do front-end ou no repositório.
- A hospedagem DEVE ficar atrás de firewall de aplicação web (WAF)/CDN com proteção DDoS.
- Dados pessoais coletados DEVEM seguir a LGPD (finalidade, consentimento e política de
  privacidade publicada).

**Justificativa**: um site público é alvo constante de ataques automatizados; a reputação do
professor depende da integridade do site.

### IV. Escalabilidade e Desempenho

O site DEVE suportar aumento de acessos e de volume de conteúdo sem perda de desempenho.

- Páginas DEVEM ser estáticas e servidas por CDN com cache adequado (ativos versionados com
  cache longo e imutável).
- Core Web Vitals DEVEM atingir, no 75º percentil móvel: LCP ≤ 2,5s, INP ≤ 200ms, CLS ≤ 0,1.
- Orçamento por página: até 1 MB transferido no carregamento inicial e até 100 KB de
  JavaScript (comprimido).
- Imagens DEVEM ser otimizadas (WebP/AVIF) e carregadas com `loading="lazy"` abaixo da dobra;
  fontes DEVEM usar `font-display: swap` e subconjuntos.
- Conteúdo repetível (cursos, artigos, depoimentos, agenda) DEVE ser separado da apresentação
  (ex.: arquivos JSON ou geração estática) para crescer sem reescrever páginas.

**Justificativa**: desempenho afeta diretamente a retenção de visitantes e o ranqueamento em
buscadores; arquitetura estática escala com custo baixo.

### V. Manutenibilidade

O código DEVE ser limpo, modular e bem estruturado, facilitando correções e atualizações.

- Separação estrita: estrutura em HTML, apresentação em CSS, comportamento em JS.
- CSS DEVE usar os tokens do design system via custom properties e uma convenção de nomes
  consistente (BEM); valores mágicos repetidos são PROIBIDOS.
- JavaScript DEVE ser organizado em ES Modules com responsabilidade única por módulo e sem
  variáveis globais.
- Componentes repetidos (cabeçalho, rodapé, cards) DEVEM ter uma única fonte de verdade.
- O código DEVE passar por formatação e lint automáticos (Prettier, Stylelint, ESLint) e
  validação W3C de HTML.
- Nomes de arquivos, classes e funções DEVEM ser descritivos; comentários explicam o "porquê".
- O README DEVE documentar estrutura de pastas, como rodar localmente e como publicar.

**Justificativa**: o site será atualizado continuamente por pessoas diferentes ao longo do
tempo; padrões claros reduzem custo e erros.

## Restrições Técnicas

- Stack: HTML5, CSS3 e JavaScript (ES2020+) puros, sem frameworks de front-end. Ferramentas
  de build leves só podem ser adotadas com justificativa registrada no plano.
- O site DEVE funcionar com conteúdo essencial legível mesmo com JavaScript desabilitado
  (aprimoramento progressivo).
- Compatibilidade: as duas últimas versões de Chrome, Edge, Firefox e Safari (desktop e móvel).
- Identidade visual: cores, tipografia e espaçamentos DEVEM vir do design system definido para
  o projeto.
- Idioma: português do Brasil.
- SEO: cada página DEVE ter `title` e `meta description` únicos, Open Graph, URL canônica,
  dados estruturados (JSON-LD) quando aplicável, `sitemap.xml` e `robots.txt`.

## Fluxo de Desenvolvimento e Portões de Qualidade

- Toda funcionalidade segue o fluxo Spec Kit: especificação → plano → tarefas → implementação.
- Antes de publicar, cada página DEVE passar por:
  - Lighthouse (móvel) ≥ 90 em Desempenho, Acessibilidade, Boas Práticas e SEO;
  - zero violações críticas ou sérias no axe;
  - validação W3C de HTML e CSS sem erros;
  - teste manual de teclado e de leitor de tela (NVDA ou VoiceOver) nos fluxos principais;
  - verificação visual nas larguras definidas no Princípio II;
  - verificação dos cabeçalhos de segurança (ex.: securityheaders.com nota A ou superior).
- Mudanças DEVEM ser feitas em branches com revisão antes de ir para a branch principal.

## Governance

- Esta constituição prevalece sobre quaisquer outras práticas do projeto.
- Emendas DEVEM ser documentadas neste arquivo, com justificativa, aprovação do responsável pelo
  projeto e plano de migração quando afetarem código existente.
- Versionamento semântico: MAJOR para remoção ou redefinição de princípios; MINOR para novo
  princípio ou seção; PATCH para esclarecimentos de redação.
- Todo plano (`/speckit-plan`) DEVE incluir uma verificação de conformidade com cada princípio;
  exceções DEVEM ser justificadas na seção de complexidade do plano.
- A conformidade DEVE ser revisada a cada entrega e, no mínimo, a cada seis meses.

**Version**: 1.0.0 | **Ratified**: 2026-10-12 | **Last Amended**: 2026-10-12
