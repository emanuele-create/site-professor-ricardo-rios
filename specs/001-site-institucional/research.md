# Research: Nova versão do site do Professor Ricardo Rios

## 1. Geração das páginas

- **Decision**: gerador estático próprio em Node.js, sem dependências (`scripts/build.mjs`),
  com parciais HTML e dados JSON.
- **Rationale**: atende "HTML, CSS e JS" sem framework; cabeçalho/rodapé em fonte única; páginas
  funcionam sem JS; o formato JSON é o mesmo que um CMS headless futuro pode exportar.
- **Alternatives considered**: HTML copiado à mão (duplicação); montagem no navegador via
  `fetch` (sem SEO, quebra sem JS); Eleventy/Astro (dependência e curva extra desnecessárias
  para 15 páginas).

## 2. Hospedagem, HTTPS e firewall

- **Decision**: Cloudflare Pages (plano gratuito) com domínio próprio.
- **Rationale**: CDN global, HTTPS automático, proteção DDoS e regras gerenciadas de WAF,
  suporte nativo a `_headers` e `_redirects` (também compatíveis com Netlify).
- **Alternatives considered**: Netlify (equivalente; WAF avançado só em planos pagos);
  hospedagem compartilhada atual com WordPress (mais superfície de ataque).

## 3. Formulário de contato

- **Decision**: Formspree (endpoint `https://formspree.io/f/<ID>` configurado em
  `src/data/site.json`), envio progressivo: sem JS é um POST comum; com JS, `fetch` com
  `Accept: application/json` e mensagens na própria página. Anti-spam: campo honeypot
  `_gotcha` + filtro do serviço (reCAPTCHA/Turnstile opcional no painel).
- **Rationale**: entrega por e-mail sem back-end próprio; dados não ficam no site; endpoint é
  público por natureza (não é segredo).
- **Alternatives considered**: Netlify Forms (prende à Netlify); função serverless + serviço de
  e-mail (mais código e segredos para manter).
- **Pendência operacional**: o professor precisa criar a conta e informar o ID do formulário.
  Até lá, o formulário mostra a orientação de usar o e-mail.

## 4. Fontes

- **Decision**: auto-hospedar Montserrat (300/600/700/800), Playfair Display (600) e Inter
  (400/700) em WOFF2, subconjunto latino, via pacotes `@fontsource` copiados no build.
- **Rationale**: privacidade (sem chamada ao Google antes do consentimento), CSP mais restrita,
  desempenho.

## 5. Vídeos e cookies

- **Decision**: "fachada" de vídeo (painel com título e botão Reproduzir) que só carrega o
  `iframe` de `youtube-nocookie.com` após clique; sem JS, é um link para o YouTube. Aviso de
  cookies com "Aceitar" e "Recusar", escolha salva no navegador e reabrível no rodapé. Não há
  analytics nesta versão; se for adicionado, só carrega após "Aceitar".
- **Rationale**: LGPD, desempenho (sem ~1 MB de player no carregamento), CSP enxuta.

## 6. Tema e identidade

- **Decision**: tokens do design system "Ricardo Rios" (`tokens.json`) convertidos em custom
  properties; tema Claro padrão e Escuro por `prefers-color-scheme` + botão de alternância.
- **Logotipo**: os arquivos oficiais são PNG rasterizados sobre `papel`; o design system pede o
  vetor antes de usar. Enquanto isso, o cabeçalho usa uma assinatura tipográfica (nome em
  Montserrat + descritor) e um monograma "RR" em SVG simples; substituir pelos arquivos
  oficiais quando disponíveis.
- **Imagens**: fotos do professor e capas dos livros não puderam ser obtidas do site atual.
  Os dados aceitam o campo `imagem`; sem ele, o componente mostra um bloco tipográfico.

## 7. Blog

- **Decision**: prévia com 6 artigos de exemplo (2 por categoria) em `artigos.json`, páginas
  geradas em `/blog/<slug>/` e categorias em `/blog/categoria/<slug>/` (filtro sem JS).
  Endereços antigos do blog e dos artigos redirecionam (301) para `/blog/`.
- **Rationale**: decisão do cliente (CMS futuro). Os campos seguem o contrato
  `contracts/content-schema.md`.

## 8. Qualidade

- **Decision**: `html-validate` (W3C-like), verificador de links próprio, Playwright + axe-core
  para WCAG 2.2 AA e larguras. Lighthouse e securityheaders.com executados após publicação
  (passos manuais em quickstart.md).

## 9. Atualização (2026-10-12): hospedagem no Render

- **Decision**: publicar como Static Site no Render, configurado por `render.yaml` (Blueprint).
- **Rationale**: escolha do cliente. O Render oferece CDN, HTTPS automático com redirecionamento
  de HTTP e proteção DDoS. Como ele não lê `_headers`/`_redirects`, `scripts/render-yaml.mjs`
  converte esses arquivos em `headers` e `routes` do Blueprint (fonte única mantida).
- **Observação**: o Render só aplica redirecionamentos quando não existe arquivo no caminho;
  os endereços antigos não existem em `dist/`, então todos são redirecionados (301).
