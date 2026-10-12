# Contrato: URLs públicas e redirecionamentos

## URLs da nova versão

| URL | Conteúdo |
|-----|----------|
| `/` | Página inicial (âncoras `#cursos`, `#sobre`, `#livros`, `#podcasts`, `#videos`, `#blog`, `#contato`) |
| `/aprenda-reforma-tributaria-na-pratica/` | Página de vendas do curso (mesma URL do site atual) |
| `/blog/` | Prévia do blog |
| `/blog/categoria/{reforma-tributaria,contabilidade,tecnologia-ia}/` | Artigos por categoria |
| `/blog/{slug}/` | Artigo |
| `/politica-de-privacidade/` | Política de privacidade (mesma URL do site atual) |
| `/contato/obrigado/` | Confirmação de envio (reserva para redirecionamento do serviço) |
| `/404.html` | Página não encontrada |
| `/sitemap.xml`, `/robots.txt` | SEO |

## Redirecionamentos 301 (`src/static/_redirects`)

| De | Para |
|----|------|
| `/inicio/blog-contabil-financeiro/` | `/blog/` |
| `/cursos-palestras-ia-reforma/blog-contabil-financeiro/` | `/blog/` |
| `/inicio/` | `/` |
| `/category/*` | `/blog/` |
| 17 slugs de artigos antigos conhecidos (ex.: `/fase-de-testes-do-split-payment-o-que-seu-negocio-precisa-saber/`) | `/blog/` |

O verificador `scripts/check-links.mjs` garante que todo destino de redirecionamento e todo
link interno existe em `dist/`.
