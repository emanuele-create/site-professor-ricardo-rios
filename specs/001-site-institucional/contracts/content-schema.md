# Contrato: conteúdo em JSON (base para o CMS futuro)

O build lê exclusivamente os arquivos de `src/data/`. Um CMS futuro só precisa produzir arquivos
nesses formatos (ou uma API que o build consulte e grave nesses formatos) — nenhuma alteração de
layout é necessária. Campos detalhados em [data-model.md](../data-model.md).

## Regras do contrato

1. Arquivos UTF-8, JSON válido, sem HTML nos textos (o build escapa tudo).
2. Únicos realces permitidos no texto de artigos: `**trecho**` → `<strong>`.
3. `slug` de artigo é estável: mudar um slug exige adicionar redirecionamento em
   `src/static/_redirects`.
4. O build falha (código ≠ 0) se: faltar campo obrigatório, `categoria` inexistente, slug
   duplicado, URL não `https://`, `youtubeId` inválido.

## Exemplo mínimo de artigo

```json
{
  "slug": "o-que-e-split-payment",
  "titulo": "Split payment: o que é e quando começa",
  "data": "2026-10-06",
  "categoria": "reforma-tributaria",
  "autor": "Ricardo Rios",
  "resumo": "Resumo em até 200 caracteres.",
  "destaque": true,
  "conteudo": [
    { "tipo": "p", "texto": "Parágrafo com **um destaque**." },
    { "tipo": "h2", "texto": "Subtítulo" },
    { "tipo": "lista", "itens": ["item 1", "item 2"] }
  ]
}
```
