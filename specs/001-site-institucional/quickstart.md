# Quickstart: validar o site

## Pré-requisitos

- Node.js 20 ou superior.
- `npm install` (instala apenas ferramentas de desenvolvimento e fontes).

## Rodar localmente

```bash
npm run build     # gera dist/
npm start         # serve dist/ em http://localhost:8080
```

## Validação automatizada

```bash
npm test          # build + html-validate + links/redirecionamentos + Playwright/axe
```

Resultado esperado: todos os passos verdes; nenhuma violação axe séria/crítica; nenhuma rolagem
horizontal em 320, 360, 768, 1024, 1440 e 1920px.

## Cenários manuais (por história)

1. **US1** — Em 360px, abrir `/`: título e botão de cursos visíveis sem rolar; cada card de curso
   leva ao link próprio; "Inscreva-se no curso" leva a `#cursos`.
2. **US2** — `/aprenda-reforma-tributaria-na-pratica/`: 5 benefícios, 4 módulos, 6 perguntas
   abrem/fecham com Enter/Espaço; barra de inscrição fixa no celular.
3. **US3** — `#sobre` e `#livros`: formação, prêmios e livros com link externo (nova aba, aviso).
4. **US4** — `/blog/`: 6 artigos do mais novo ao mais antigo; filtro por categoria; artigo com
   relacionados; `/inicio/blog-contabil-financeiro/` redireciona para `/blog/` (após publicar).
5. **US5** — vídeos só carregam após clicar em "Reproduzir"; episódios com título e link reais.
6. **US6** — aviso de cookies no primeiro acesso; "Preferências de cookies" no rodapé reabre;
   formulário: enviar vazio mostra erros nos campos; envio válido mostra confirmação.
7. **JS desabilitado** — menu, FAQ, links, blog e formulário (POST direto) continuam utilizáveis.

## Após publicar

- Lighthouse móvel ≥ 90 nas 4 categorias (`/`, curso, blog, artigo).
- securityheaders.com nota A ou superior.
- Teste com NVDA (Windows) nos fluxos US1, US2 e US6.
