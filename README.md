# Site do Professor Ricardo Rios

Nova versão de [professorricardorios.com.br](https://professorricardorios.com.br), feita em
**HTML, CSS e JavaScript puros**, gerada como site estático e pronta para hospedagem em CDN.

Desenvolvida com o fluxo [Spec Kit](https://github.com/github/spec-kit):

- Constituição do projeto: [`.specify/memory/constitution.md`](.specify/memory/constitution.md)
- Especificação, plano e tarefas: [`specs/001-site-institucional/`](specs/001-site-institucional/)

## Como rodar

Requer Node.js 20 ou superior.

```bash
npm install        # ferramentas de desenvolvimento (testes e fontes)
npm run test:setup # baixa o navegador dos testes (apenas na primeira vez)
npm run build      # gera o site em dist/
npm start          # abre em http://localhost:8080
npm test           # build + validação HTML + links + testes de acessibilidade e responsividade
```

> O build em si não depende de pacotes: `node scripts/build.mjs` funciona sem `npm install`.

## Estrutura

```text
src/
├── pages/        Páginas (início, curso, política, 404, confirmação de contato)
├── templates/    Modelos do blog (lista e artigo)
├── partials/     Trechos únicos: cabeçalho, rodapé, aviso de cookies, formulário
├── data/         Conteúdo em JSON (cursos, livros, episódios, vídeos, artigos, site)
├── assets/
│   ├── css/      tokens → base → layout → componentes → páginas
│   ├── js/       main.js + módulos (menu, tema, cookies, vídeo, formulário, barra fixa)
│   ├── fonts/    Montserrat, Playfair Display e Inter (auto-hospedadas)
│   └── img/      favicon e imagem de compartilhamento
└── static/       _headers (segurança e cache), _redirects (endereços antigos), robots.txt
scripts/          build, servidor local, verificador de links, gerador da imagem OG
tests/e2e/        Playwright + axe (WCAG 2.2 AA, larguras, fluxos)
```

## Como editar o conteúdo

Todo o conteúdo fica em `src/data/`. Depois de editar, rode `npm run build`.
O build valida os dados e para com uma mensagem clara se algo estiver errado.

| Quero… | Arquivo |
|--------|---------|
| Mudar e-mail, redes sociais ou ativar o formulário | `site.json` |
| Adicionar ou alterar um curso, status de matrículas, módulos, FAQ | `cursos.json` |
| Adicionar um livro (com capa: campo `imagem`) | `livros.json` |
| Atualizar episódios do podcast (mostra os 4 mais recentes) | `episodios.json` |
| Trocar vídeos (ID do YouTube) | `videos.json` |
| Publicar um artigo | `artigos.json` |

O formato dos artigos é o contrato para o CMS futuro:
[`contracts/content-schema.md`](specs/001-site-institucional/contracts/content-schema.md).

## Pendências antes do lançamento

1. **Formulário de contato**: criar um formulário no [Formspree](https://formspree.io), com
   entrega para contato@professorricardorios.com.br, e colocar o endereço
   (`https://formspree.io/f/XXXX`) em `site.json > formEndpoint`. Enquanto estiver vazio, o
   formulário abre o e-mail do visitante com a mensagem pronta.
2. **Imagens**: foto do professor (`site.json > fotoProfessor`), capas dos livros
   (`livros.json > imagem`) e imagens dos artigos. Sem elas, o site mostra blocos tipográficos
   da marca.
3. **Logotipo**: substituir o monograma tipográfico pelo arquivo vetorial (SVG) oficial.
4. **Podcast**: confirmar se os episódios em `episodios.json` são os que devem aparecer.

## Publicação (Cloudflare Pages)

1. Conectar o repositório no Cloudflare Pages.
2. Comando de build: `node scripts/build.mjs` · Diretório de saída: `dist`.
3. Apontar o domínio `professorricardorios.com.br` para o projeto (HTTPS automático).
4. Ativar no painel: *Always Use HTTPS*, regras gerenciadas do WAF e proteção contra bots.
5. Após publicar: rodar o Lighthouse (meta ≥ 90) e o [securityheaders.com](https://securityheaders.com)
   (meta nota A), conforme a constituição.

Os arquivos `_headers` e `_redirects` também funcionam na Netlify sem alterações.

## Segurança

- CSP restritiva: só scripts, estilos e fontes do próprio domínio; sem JavaScript inline.
- HSTS, `nosniff`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`.
- Conteúdo dos JSON sempre escapado no build; nenhum `innerHTML` com dados externos.
- Formulário com honeypot e validação; nenhum segredo no repositório.
