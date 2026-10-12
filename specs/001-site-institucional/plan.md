# Implementation Plan: Nova versão do site do Professor Ricardo Rios

**Branch**: `001-site-institucional` | **Date**: 2026-10-12 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-site-institucional/spec.md`

## Summary

Reconstruir o site professorricardorios.com.br como site estático em HTML, CSS e JavaScript
puros, com o conteúdo atual revisado (sem placeholders), identidade visual do design system
"Ricardo Rios" (editorial: papel, marinho, Montserrat/Playfair/Inter, cantos retos, fios finos),
página de vendas do curso de Reforma Tributária, prévia do blog com 6 artigos de exemplo
alimentados por dados (prontos para um CMS futuro), formulário de contato com anti-spam,
aviso de cookies (LGPD), redirecionamentos dos endereços antigos e cabeçalhos de segurança.

Abordagem: um gerador estático mínimo em Node.js **sem dependências** (`scripts/build.mjs`)
monta as páginas a partir de parciais HTML (cabeçalho, rodapé — fonte única) e de arquivos JSON
de conteúdo, gerando `dist/` pronto para hospedagem em CDN. O JavaScript no navegador apenas
aprimora (menu móvel, tema, cookies, vídeos, envio do formulário, CTA fixo); todo o conteúdo e
os links funcionam sem JavaScript.

## Technical Context

**Language/Version**: HTML5, CSS3 (custom properties, Grid, `clamp()`), JavaScript ES2020
(ES Modules) no navegador; Node.js ≥ 20 apenas para build e testes.

**Primary Dependencies**: nenhuma em produção. Desenvolvimento: `html-validate`, `playwright`,
`@axe-core/playwright`, `@fontsource/{montserrat,playfair-display,inter}` (fontes auto-hospedadas).

**Storage**: arquivos JSON em `src/data/` (cursos, livros, episódios, vídeos, artigos, site).
Mensagens de contato não são armazenadas (encaminhadas por serviço de formulários).

**Testing**: `npm test` → build + `html-validate` (todas as páginas) + verificador de links
internos e redirecionamentos (`scripts/check-links.mjs`) + Playwright/axe (WCAG 2.2 AA, sem
rolagem horizontal em 320/360/768/1024/1440/1920px, fluxos de teclado, formulário).

**Target Platform**: navegadores evergreen (2 últimas versões de Chrome, Edge, Firefox, Safari),
hospedagem estática com CDN — Cloudflare Pages (suporta `_headers` e `_redirects`; Netlify
também, sem alterações).

**Project Type**: site estático (web, somente front-end).

**Performance Goals**: LCP ≤ 2,5s, INP ≤ 200ms, CLS ≤ 0,1 (p75 móvel); Lighthouse ≥ 90.

**Constraints**: ≤ 1 MB por página no primeiro carregamento, ≤ 100 KB de JS; sem script
inline (CSP `script-src 'self'`); sem recursos de terceiros antes de ação do visitante
(fontes locais; vídeo do YouTube só após clique, via `youtube-nocookie.com`).

**Scale/Scope**: 15 páginas geradas (início, curso, blog, 3 categorias, 6 artigos,
privacidade, 404, obrigado) + sitemap/robots; tráfego atendido por CDN.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Como o plano atende | Status |
|-----------|---------------------|--------|
| I. Usabilidade e Acessibilidade | HTML semântico, `lang="pt-BR"`, link "Pular para o conteúdo", foco visível (`foco` 2px), FAQ com `<details>`, formulário com `label` e erros com `aria-describedby`/`aria-live`, `prefers-reduced-motion`, contraste dos tokens verificado (tinta/papel 14:1, aço/papel 5,3:1); teste axe automatizado | ✅ |
| II. Design Responsivo | CSS mobile-first, grade 12 col. com `clamp()`, alvos ≥ 44px, teste automatizado sem rolagem horizontal de 320 a 1920px, `width`/`height` em imagens | ✅ |
| III. Segurança | HTTPS + HSTS e CSP restritiva em `_headers`; sem JS inline nem `innerHTML` com dados externos; honeypot + validação no cliente e no serviço; WAF/DDoS da CDN; política LGPD com data; nenhum segredo no repositório (endpoint do formulário é público por natureza) | ✅ |
| IV. Escalabilidade e Desempenho | páginas estáticas em CDN; ativos com hash de conteúdo + cache imutável; fontes WOFF2 subset latino com `font-display: swap`; vídeos sob demanda; conteúdo em JSON | ✅ |
| V. Manutenibilidade | parciais únicas para cabeçalho/rodapé; CSS em camadas (tokens, base, layout, componentes, páginas) com BEM; JS em módulos de responsabilidade única; README com estrutura, execução e publicação; validação automática | ✅ |
| Restrições técnicas | sem framework; build Node sem dependências justificado em Complexity Tracking; aprimoramento progressivo; SEO (title/description/OG/canonical/JSON-LD/sitemap/robots) | ✅ |

**Re-check pós-design (Fase 1)**: ✅ nenhum conflito introduzido pelos contratos e pelo modelo
de dados.

## Project Structure

### Documentation (this feature)

```text
specs/001-site-institucional/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── content-schema.md      # formato dos JSON de conteúdo (contrato com o CMS futuro)
│   ├── contact-form.md        # contrato do envio do formulário
│   └── urls-and-redirects.md  # mapa de URLs públicas e redirecionamentos
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── pages/                      # páginas com metadados no topo (comentário JSON)
│   ├── index.html
│   ├── aprenda-reforma-tributaria-na-pratica.html
│   ├── politica-de-privacidade.html
│   ├── contato-obrigado.html
│   └── 404.html
├── templates/                  # modelos preenchidos com dados
│   ├── blog.html
│   └── artigo.html
├── partials/                   # fonte única de trechos repetidos
│   ├── head.html
│   ├── header.html
│   ├── footer.html
│   └── cookie-banner.html
├── data/                       # conteúdo (contrato com CMS futuro)
│   ├── site.json
│   ├── cursos.json
│   ├── livros.json
│   ├── episodios.json
│   ├── videos.json
│   └── artigos.json
├── assets/
│   ├── css/  (tokens.css, base.css, layout.css, components.css, pages.css)
│   ├── js/   (theme-init.js, main.js, modules/*.js)
│   ├── img/  (logo, favicon, imagens dos artigos)
│   └── fonts/ (gerado a partir de @fontsource no build)
└── static/                     # copiado como está: _headers, _redirects, robots.txt
scripts/
├── build.mjs                   # gera dist/
├── lib/render.mjs              # includes, componentes, escape
├── check-links.mjs             # links internos + redirecionamentos
└── serve.mjs                   # servidor local de dist/
tests/
└── e2e/ (a11y.spec.mjs, responsivo.spec.mjs, fluxos.spec.mjs)
dist/                           # saída (não versionada)
```

**Structure Decision**: projeto único de site estático. Fonte em `src/`, geração em `scripts/`,
testes em `tests/`, saída em `dist/`. Sem back-end próprio: o formulário usa um serviço externo
(ver research.md).

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Etapa de build em Node (constituição pede justificativa para ferramentas de build) | Cabeçalho/rodapé em fonte única, páginas de artigos e categorias geradas a partir de JSON, hash de cache dos ativos | Copiar cabeçalho em cada HTML viola o Princípio V; montar via JS no navegador quebra o funcionamento sem JS e prejudica SEO |
