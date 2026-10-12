---

description: "Task list for feature implementation"
---

# Tasks: Nova versão do site do Professor Ricardo Rios

**Input**: Design documents from `/specs/001-site-institucional/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: a constituição exige portões de qualidade (validação HTML, axe, larguras, links);
por isso há tarefas de teste automatizado.

**Organization**: tarefas agrupadas por história de usuário.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: pode rodar em paralelo (arquivos diferentes, sem dependência)
- **[Story]**: história de usuário (US1…US6)

## Phase 1: Setup (Shared Infrastructure)

- [X] T001 Criar estrutura de pastas `src/`, `scripts/`, `tests/` conforme plan.md
- [X] T002 Criar `package.json` com scripts `build`, `start`, `test` e devDependencies (html-validate, playwright, @axe-core/playwright, @fontsource/*)
- [X] T003 [P] Criar `.gitignore`, `.editorconfig`, `.prettierrc`, `.htmlvalidate.json`
- [X] T004 [P] Criar `README.md` com estrutura, execução local, edição de conteúdo e publicação

---

## Phase 2: Foundational (Blocking Prerequisites)

- [X] T005 Implementar `scripts/lib/render.mjs` (includes `{{> parcial}}`, variáveis, escape, componentes) 
- [X] T006 Implementar `scripts/build.mjs` (validação dos JSON, geração de páginas, cópia de estáticos e fontes, hash de ativos, sitemap)
- [X] T007 [P] Criar `src/assets/css/tokens.css` a partir do design system (temas claro/escuro)
- [X] T008 [P] Criar `src/assets/css/base.css` (reset, tipografia, foco, skip link, reduced motion)
- [X] T009 [P] Criar `src/assets/css/layout.css` (container, grade, seções, cabeçalho, rodapé)
- [X] T010 [P] Criar `src/assets/css/components.css` (botões, eyebrow, cards, painel marinho, fio com nó, formulário, aviso de cookies)
- [X] T011 Criar parciais `src/partials/head.html`, `header.html`, `footer.html`, `cookie-banner.html`
- [X] T012 [P] Criar `src/assets/js/theme-init.js` e `src/assets/js/modules/theme.js` (tema claro/escuro)
- [X] T013 [P] Criar `src/assets/js/modules/menu.js` (menu móvel acessível)
- [X] T014 Criar `src/assets/js/main.js` (inicializa módulos, classe `js`)
- [X] T015 [P] Criar `src/data/site.json` (nome, URL, e-mail, redes, endpoint do formulário)
- [X] T016 [P] Criar logotipo/monograma SVG e favicon em `src/assets/img/`
- [X] T017 Criar `src/static/_headers` (HSTS, CSP, nosniff, Referrer-Policy, Permissions-Policy, cache) e `src/static/robots.txt`
- [X] T018 Criar `src/pages/404.html`

**Checkpoint**: `npm run build` gera página 404 com cabeçalho e rodapé.

---

## Phase 3: User Story 1 - Conhecer o professor e chegar à compra (P1) 🎯 MVP

**Goal**: página inicial com destaque principal e cursos com links corretos.

**Independent Test**: em 360px, título e CTA visíveis; cada curso leva ao seu link.

- [X] T019 [P] [US1] Criar `src/data/cursos.json` (2 cursos com link próprio + card de palestras, sem placeholders)
- [X] T020 [US1] Criar componente de cursos em `scripts/lib/render.mjs`
- [X] T021 [US1] Criar `src/pages/index.html` com destaque principal e seção `#cursos`
- [X] T022 [P] [US1] Estilos da página inicial em `src/assets/css/pages.css`
- [X] T023 [US1] Teste e2e: CTA do cabeçalho leva a `#cursos` e links de cursos corretos em `tests/e2e/fluxos.spec.mjs`

---

## Phase 4: User Story 2 - Curso de Reforma Tributária (P2)

**Goal**: página de vendas completa.

**Independent Test**: benefícios, 4 módulos, FAQ por teclado, CTA fixo no celular.

- [X] T024 [US2] Completar dados do curso em destaque em `src/data/cursos.json` (benefícios, módulos, FAQ, garantia)
- [X] T025 [US2] Criar `src/pages/aprenda-reforma-tributaria-na-pratica.html`
- [X] T026 [P] [US2] Criar `src/assets/js/modules/sticky-cta.js`
- [X] T027 [US2] Teste e2e da FAQ por teclado em `tests/e2e/fluxos.spec.mjs`

---

## Phase 5: User Story 3 - Credibilidade e livros (P3)

- [X] T028 [P] [US3] Criar `src/data/livros.json`
- [X] T029 [US3] Seções `#sobre` e `#livros` em `src/pages/index.html` + componente de livros
- [X] T030 [US3] Links externos com `target="_blank"`, `rel="noopener noreferrer"` e aviso acessível (componente comum)

---

## Phase 6: User Story 4 - Prévia do blog (P4)

- [X] T031 [P] [US4] Criar `src/data/artigos.json` (categorias + 6 artigos de exemplo)
- [X] T032 [P] [US4] Criar `src/templates/blog.html` e `src/templates/artigo.html`
- [X] T033 [US4] Gerar `/blog/`, `/blog/categoria/*/` e `/blog/<slug>/` em `scripts/build.mjs`
- [X] T034 [US4] Bloco "3 artigos mais recentes" em `src/pages/index.html`
- [X] T035 [US4] Criar `src/static/_redirects` (endereços antigos → novos)

---

## Phase 7: User Story 5 - Podcasts e vídeos (P5)

- [X] T036 [P] [US5] Criar `src/data/episodios.json` e `src/data/videos.json`
- [X] T037 [US5] Seções `#podcasts` e `#videos` em `src/pages/index.html`
- [X] T038 [P] [US5] Criar `src/assets/js/modules/video.js` (fachada → iframe youtube-nocookie)

---

## Phase 8: User Story 6 - Contato e privacidade (P6)

- [X] T039 [US6] Seção `#contato` com formulário em `src/pages/index.html`
- [X] T040 [P] [US6] Criar `src/assets/js/modules/contact-form.js` (validação, envio, estados)
- [X] T041 [P] [US6] Criar `src/assets/js/modules/consent.js` (aviso de cookies)
- [X] T042 [P] [US6] Criar `src/pages/politica-de-privacidade.html` (8 seções, data, operador do formulário)
- [X] T043 [P] [US6] Criar `src/pages/contato-obrigado.html`
- [X] T044 [US6] Teste e2e de validação do formulário e do aviso de cookies em `tests/e2e/fluxos.spec.mjs`

---

## Phase 9: Polish & Cross-Cutting Concerns

- [X] T045 [P] SEO: metas, Open Graph, canonical, JSON-LD (Person, Course, BlogPosting, WebSite), sitemap
- [X] T046 [P] Criar `scripts/check-links.mjs` (links internos, âncoras e destinos de redirecionamento)
- [X] T047 [P] Criar `tests/e2e/a11y.spec.mjs` (axe em todas as páginas, claro e escuro)
- [X] T048 [P] Criar `tests/e2e/responsivo.spec.mjs` (sem rolagem horizontal de 320 a 1920px)
- [X] T049 Rodar `npm test` e corrigir falhas
- [X] T050 Revisão visual por capturas de tela (360px e 1440px) e verificação final contra o spec

## Dependencies & Execution Order

- Setup → Foundational → US1 (MVP) → US2…US6 (podem seguir em paralelo após US1, pois US3–US6
  editam seções distintas de `index.html`, feito em sequência) → Polish.
- T005/T006 bloqueiam toda geração de páginas.
- T046–T048 dependem de todas as páginas existirem.

## Parallel Example

```text
Foundational: T007, T008, T009, T010, T012, T013, T015, T016 juntos
US6: T040, T041, T042, T043 juntos
```

## Implementation Strategy

MVP = Fases 1–3 (página inicial com cursos). Depois, cada história é publicável isoladamente.
