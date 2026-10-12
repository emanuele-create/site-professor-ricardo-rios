# Data Model

Todos os dados ficam em `src/data/*.json` (UTF-8). Textos são texto puro; o build escapa HTML.
Datas no formato ISO `AAAA-MM-DD`.

## Site (`site.json`)

| Campo | Tipo | Regra |
|-------|------|-------|
| nome | string | obrigatório |
| url | string (URL https) | sem barra final |
| descricao | string | ≤ 160 caracteres |
| email | string (e-mail) | contato oficial |
| formEndpoint | string (URL) \| "" | vazio = formulário desativado com aviso |
| redes | Rede[] | Instagram, LinkedIn, YouTube, TikTok |
| podcastUrl, canalUrl, amazonUrl | string (URL) | links "ver mais" |

**Rede**: `nome`, `url`.

## Curso (`cursos.json`)

| Campo | Tipo | Regra |
|-------|------|-------|
| id | string | único, kebab-case |
| nome | string | obrigatório |
| editoria | string | rótulo (eyebrow) |
| resumo | string | ≤ 220 caracteres, próprio do curso |
| publico | string | obrigatório |
| status | "abertas" \| "encerradas" \| "em-breve" | define selo e texto do botão |
| linkCompra | URL | exclusivo do curso |
| pagina | string \| null | caminho interno da página de vendas, se existir |
| destaque | boolean | um único curso em destaque |

Página de vendas do curso em destaque também usa: `subtitulo`, `descricao`, `instrutor`,
`beneficios[] {titulo, texto}`, `modulos[]` (Módulo), `faq[] {pergunta, resposta}`, `garantia`.

**Módulo**: `numero` (int), `nome`, `cargaHoraria` (texto, ex. "3h"), `liberacao`, `resumo`.

## Livro (`livros.json`)

`titulo`, `subtitulo?`, `edicao?`, `coautores[]`, `resumo?`, `link` (URL), `destaque` (bool),
`imagem?` (caminho; sem ele, capa tipográfica).

## Episódio (`episodios.json`)

`titulo`, `data` (ISO), `link` (URL). Exibidos os 4 mais recentes por data.

## Vídeo (`videos.json`)

`titulo`, `youtubeId` (11 caracteres `[A-Za-z0-9_-]`), `data?`.

## Artigo (`artigos.json`)

| Campo | Tipo | Regra |
|-------|------|-------|
| slug | string | único, kebab-case; vira `/blog/<slug>/` |
| titulo | string | obrigatório |
| data | ISO date | ordenação decrescente |
| categoria | slug de Categoria | deve existir |
| autor | string | padrão "Ricardo Rios" |
| resumo | string | ≤ 200 caracteres |
| imagem? | caminho | opcional; sem ele, bloco tipográfico |
| conteudo | Bloco[] | ver abaixo |
| destaque | boolean | |

**Bloco**: `{ "tipo": "p" | "h2" | "lista", "texto"?: string, "itens"?: string[] }`.
Trechos entre `**` viram `<strong>` (único realce permitido pelo design system).

**Categoria** (em `artigos.json > categorias`): `slug`, `nome`, `descricao`.
Valores: `reforma-tributaria`, `contabilidade`, `tecnologia-ia`.

## Mensagem de contato (não persistida)

`nome` (2–100), `email` (válido), `assunto` ∈ {palestra, empresa, curso, outro},
`mensagem` (10–3000), `privacidade` (marcado), `_gotcha` (deve estar vazio).

## Consentimento (navegador do visitante)

`localStorage["rr-consentimento"]` ∈ {"aceito", "recusado"}; ausente = perguntar.
`localStorage["rr-tema"]` ∈ {"claro", "escuro"}; ausente = seguir o sistema.
