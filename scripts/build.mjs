// Gera o site estático em dist/ a partir de src/.
// Sem dependências: apenas módulos nativos do Node.js (>= 20).

import { createHash } from "node:crypto";
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as R from "./lib/render.mjs";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(RAIZ, "src");
const DIST = join(RAIZ, "dist");
const PARCIAIS = join(SRC, "partials");

const lerJSON = (nome) => JSON.parse(readFileSync(join(SRC, "data", nome), "utf8"));
const hash = (conteudo) => createHash("sha256").update(conteudo).digest("hex").slice(0, 10);

/* --------------------------------------------------------------------------
   1. Dados e validação (contracts/content-schema.md)
   -------------------------------------------------------------------------- */

const site = lerJSON("site.json");
const cursos = lerJSON("cursos.json");
const livros = lerJSON("livros.json");
const episodios = lerJSON("episodios.json");
const videos = lerJSON("videos.json");
const { categorias, artigos: artigosBrutos } = lerJSON("artigos.json");

const erros = [];
const exigir = (cond, msg) => cond || erros.push(msg);
const ehHttps = (u) => /^https:\/\/[^\s]+$/.test(u);
const ehLinkValido = (u) => ehHttps(u) || /^\/[^\s]*$/.test(u);

exigir(ehHttps(site.url) && !site.url.endsWith("/"), "site.url deve ser https e sem barra final");
exigir(/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(site.email), "site.email inválido");
exigir(site.formEndpoint === "" || ehHttps(site.formEndpoint), "site.formEndpoint deve ser vazio ou https");
site.redes.forEach((r) => exigir(ehHttps(r.url), `rede ${r.nome}: URL inválida`));

exigir(cursos.filter((c) => c.destaque).length === 1, "deve haver exatamente um curso em destaque");
cursos.forEach((c) => {
  for (const campo of ["id", "nome", "editoria", "resumo", "publico", "status", "linkCompra"]) {
    exigir(c[campo], `curso ${c.id ?? "?"}: campo ${campo} obrigatório`);
  }
  exigir(ehLinkValido(c.linkCompra), `curso ${c.id}: linkCompra inválido`);
  exigir(["abertas", "encerradas", "em-breve"].includes(c.status), `curso ${c.id}: status inválido`);
});
const links = cursos.map((c) => c.linkCompra);
exigir(new Set(links).size === links.length, "cada curso deve ter um link de compra exclusivo");

livros.forEach((l) => exigir(l.titulo && ehHttps(l.link), `livro ${l.titulo}: título e link https obrigatórios`));
episodios.forEach((e) => exigir(e.titulo && ehHttps(e.link) && /^\d{4}-\d{2}-\d{2}$/.test(e.data), `episódio inválido: ${e.titulo}`));
videos.forEach((v) => exigir(/^[A-Za-z0-9_-]{11}$/.test(v.youtubeId) && v.titulo, `vídeo inválido: ${v.titulo}`));

const slugs = new Set();
artigosBrutos.forEach((a) => {
  for (const campo of ["slug", "titulo", "data", "categoria", "autor", "resumo", "conteudo"]) {
    exigir(a[campo], `artigo ${a.slug ?? "?"}: campo ${campo} obrigatório`);
  }
  exigir(/^[a-z0-9]+(-[a-z0-9]+)*$/.test(a.slug), `artigo ${a.slug}: slug inválido`);
  exigir(!slugs.has(a.slug), `artigo ${a.slug}: slug duplicado`);
  slugs.add(a.slug);
  exigir(categorias.some((c) => c.slug === a.categoria), `artigo ${a.slug}: categoria inexistente`);
  exigir(a.resumo.length <= 200, `artigo ${a.slug}: resumo acima de 200 caracteres`);
});

if (erros.length) {
  console.error("Erros de conteúdo:\n- " + erros.join("\n- "));
  process.exit(1);
}

const artigos = [...artigosBrutos].sort((a, b) => b.data.localeCompare(a.data) || a.titulo.localeCompare(b.titulo));

/* --------------------------------------------------------------------------
   2. Ativos: CSS concatenado com hash, JS em pasta versionada, estáticos
   -------------------------------------------------------------------------- */

rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });

const ORDEM_CSS = ["tokens.css", "base.css", "layout.css", "components.css", "pages.css"];
const css = ORDEM_CSS.map((f) => readFileSync(join(SRC, "assets/css", f), "utf8")).join("\n");
const cssNome = `site.${hash(css)}.css`;
mkdirSync(join(DIST, "assets/css"), { recursive: true });
writeFileSync(join(DIST, "assets/css", cssNome), css);

const dirJS = join(SRC, "assets/js");
const arquivosJS = readdirSync(dirJS, { recursive: true }).filter((f) => f.endsWith(".js")).sort();
const versaoJS = hash(arquivosJS.map((f) => f + readFileSync(join(dirJS, f), "utf8")).join("\n"));
cpSync(dirJS, join(DIST, "assets/js", versaoJS), { recursive: true });

cpSync(join(SRC, "assets/fonts"), join(DIST, "assets/fonts"), { recursive: true });
cpSync(join(SRC, "assets/img"), join(DIST, "assets/img"), { recursive: true });
cpSync(join(SRC, "static"), DIST, { recursive: true });

/* --------------------------------------------------------------------------
   3. Contexto global e componentes
   -------------------------------------------------------------------------- */

const destaque = cursos.find((c) => c.destaque);
const formAtivo = site.formEndpoint !== "";

const global = {
  site,
  ano: String(new Date().getFullYear()),
  css: `/assets/css/${cssNome}`,
  js: `/assets/js/${versaoJS}`,
  monograma: R.monograma(),
  monogramaGrande: R.monograma("sobre__retrato-monograma"),
  redes: R.redesHTML(site.redes),
  cursos: R.cursosHTML(cursos),
  livros: R.livrosHTML(livros),
  episodios: R.episodiosHTML(episodios),
  videos: R.videosHTML(videos),
  artigosRecentes: R.artigosListaHTML(artigos.slice(0, 3), categorias),
  linkAmazon: R.linkExterno(site.amazonUrl, "Todos os livros na Amazon", "botao botao--secundario"),
  linkPodcast: R.linkExterno(site.podcastUrl, "Todos os episódios", "botao botao--secundario"),
  linkCanal: R.linkExterno(site.canalUrl, "Acesse o canal no YouTube", "botao botao--secundario"),
  formAction: formAtivo ? site.formEndpoint : `mailto:${site.email}`,
  formMetodo: "post",
  formEnctype: formAtivo ? "application/x-www-form-urlencoded" : "text/plain",
  formModo: formAtivo ? "servico" : "email",
  curso: {
    ...destaque,
    statusRotulo: R.rotuloStatus(destaque.status),
    rotuloCompra: R.rotuloCompra(destaque),
    linkCompraHTML: R.linkExterno(destaque.linkCompra, R.esc(R.rotuloCompra(destaque)), "botao"),
    linkCompraClaro: R.linkExterno(destaque.linkCompra, R.esc(R.rotuloCompra(destaque)), "botao botao--claro"),
    linkCompraBarra: R.linkExterno(destaque.linkCompra, R.esc(R.rotuloCompra(destaque)), "botao botao--claro"),
    fluxoHTML: R.fluxoHTML(destaque.fluxo),
    beneficiosHTML: R.beneficiosHTML(destaque.beneficios),
    modulosHTML: R.modulosHTML(destaque.modulos),
    faqHTML: R.faqHTML(destaque.faq),
    cargaTotal: somarCarga(destaque.modulos),
    totalModulos: String(destaque.modulos.length),
  },
  politicaData: R.dataExtenso(site.politicaAtualizada),
  politicaDataISO: site.politicaAtualizada,
};

function somarCarga(modulos) {
  const min = modulos.reduce((t, m) => {
    const [, h = 0, mm = 0] = m.cargaHoraria.match(/(\d+)h(\d+)?/) ?? [];
    return t + Number(h) * 60 + Number(mm);
  }, 0);
  const h = Math.floor(min / 60);
  const resto = min % 60;
  return resto ? `${h}h${String(resto).padStart(2, "0")}` : `${h}h`;
}

/* --------------------------------------------------------------------------
   4. Montagem das páginas
   -------------------------------------------------------------------------- */

const layout = readFileSync(join(PARCIAIS, "layout.html"), "utf8");
const geradas = [];

function lerPagina(caminho) {
  const bruto = readFileSync(caminho, "utf8");
  const m = bruto.match(/^<!--meta\s+([\s\S]*?)-->\s*/);
  if (!m) throw new Error(`Página sem metadados: ${caminho}`);
  return { meta: JSON.parse(m[1]), corpo: bruto.slice(m[0].length) };
}

function marcarNavegacaoAtual(html, caminho) {
  return html.replace(/<a class="nav__link" href="([^"]+)" data-nav>/g, (tag, href) => {
    const atual = href === caminho || (href === "/blog/" && caminho.startsWith("/blog/"));
    return `<a class="nav__link" href="${href}"${atual ? ' aria-current="page"' : ""}>`;
  });
}

function gerar(meta, corpoHTML, extraCtx = {}) {
  const caminho = meta.caminho;
  const ctxPagina = {
    ...global,
    ...extraCtx,
    titulo: meta.titulo === site.nome ? site.nome : `${meta.titulo} | ${site.nome}`,
    tituloOg: meta.titulo,
    descricao: meta.descricao,
    canonical: `${site.url}${caminho === "/404.html" ? "/" : caminho}`,
    ogTipo: meta.ogTipo ?? "website",
    classeCorpo: meta.classeCorpo ?? "",
    robots: meta.indexar === false ? "noindex, follow" : "index, follow",
    jsonld: meta.jsonld ? R.jsonLd(meta.jsonld) : "",
  };
  const conteudo = R.renderizar(corpoHTML, ctxPagina, PARCIAIS);
  let html = R.renderizar(layout, { ...ctxPagina, conteudo }, PARCIAIS);
  html = marcarNavegacaoAtual(html, caminho);

  const destino = caminho.endsWith(".html")
    ? join(DIST, caminho)
    : join(DIST, caminho, "index.html");
  mkdirSync(dirname(destino), { recursive: true });
  writeFileSync(destino, html);
  if (meta.indexar !== false) geradas.push({ caminho, data: meta.atualizado });
}

const pessoa = {
  "@type": "Person",
  name: site.nomeCompleto,
  alternateName: "Professor Ricardo Rios",
  url: site.url,
  jobTitle: site.descritor,
  sameAs: site.redes.map((r) => r.url),
};

// Páginas fixas
for (const arquivo of readdirSync(join(SRC, "pages")).filter((f) => f.endsWith(".html"))) {
  const { meta, corpo } = lerPagina(join(SRC, "pages", arquivo));
  if (meta.caminho === "/") {
    meta.jsonld = {
      "@context": "https://schema.org",
      "@graph": [
        { "@type": "WebSite", name: site.nome, url: site.url, inLanguage: "pt-BR" },
        pessoa,
      ],
    };
  }
  if (meta.caminho === destaque.pagina) {
    meta.jsonld = {
      "@context": "https://schema.org",
      "@type": "Course",
      name: destaque.nome,
      description: destaque.resumo,
      inLanguage: "pt-BR",
      provider: pessoa,
      hasCourseInstance: { "@type": "CourseInstance", courseMode: "online", instructor: pessoa },
    };
  }
  gerar(meta, corpo);
}

// Blog: índice e categorias
const modeloBlog = readFileSync(join(SRC, "templates/blog.html"), "utf8");
const modeloArtigo = readFileSync(join(SRC, "templates/artigo.html"), "utf8");

gerar(
  {
    caminho: "/blog/",
    titulo: "Blog",
    descricao: "Artigos sobre Reforma Tributária, contabilidade e inteligência artificial aplicada a negócios.",
  },
  modeloBlog,
  {
    blogTitulo: "Blog",
    blogDescricao: "Reforma Tributária, contabilidade e inteligência artificial aplicada a negócios, explicadas com clareza.",
    blogEyebrow: "Artigos",
    filtro: R.filtroCategoriasHTML(categorias, ""),
    lista: R.artigosListaHTML(artigos, categorias, 2),
  }
);

for (const cat of categorias) {
  const daCategoria = artigos.filter((a) => a.categoria === cat.slug);
  gerar(
    {
      caminho: `/blog/categoria/${cat.slug}/`,
      titulo: `${cat.nome} — Blog`,
      descricao: cat.descricao,
    },
    modeloBlog,
    {
      blogTitulo: cat.nome,
      blogDescricao: cat.descricao,
      blogEyebrow: "Categoria",
      filtro: R.filtroCategoriasHTML(categorias, cat.slug),
      lista: R.artigosListaHTML(daCategoria, categorias, 2),
    }
  );
}

// Artigos
for (const artigo of artigos) {
  const cat = categorias.find((c) => c.slug === artigo.categoria);
  const relacionados = artigos
    .filter((a) => a.slug !== artigo.slug)
    .sort((a, b) => (b.categoria === artigo.categoria) - (a.categoria === artigo.categoria))
    .slice(0, 3);
  gerar(
    {
      caminho: `/blog/${artigo.slug}/`,
      titulo: artigo.titulo,
      descricao: artigo.resumo,
      ogTipo: "article",
      atualizado: artigo.data,
      jsonld: {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: artigo.titulo,
        description: artigo.resumo,
        datePublished: artigo.data,
        inLanguage: "pt-BR",
        articleSection: cat.nome,
        author: pessoa,
        mainEntityOfPage: `${site.url}/blog/${artigo.slug}/`,
      },
    },
    modeloArtigo,
    {
      artigo: {
        ...artigo,
        categoriaNome: cat.nome,
        categoriaLink: `/blog/categoria/${cat.slug}/`,
        dataExtenso: R.dataExtenso(artigo.data),
        conteudoHTML: R.conteudoArtigoHTML(artigo.conteudo),
      },
      relacionados: R.artigosListaHTML(relacionados, categorias, 3),
    }
  );
}

/* --------------------------------------------------------------------------
   5. Sitemap
   -------------------------------------------------------------------------- */

const hoje = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${geradas
  .filter((p) => !p.caminho.endsWith(".html"))
  .map((p) => `  <url><loc>${site.url}${p.caminho}</loc><lastmod>${p.data ?? hoje}</lastmod></url>`)
  .join("\n")}
</urlset>
`;
writeFileSync(join(DIST, "sitemap.xml"), sitemap);

if (!existsSync(join(DIST, "404.html"))) throw new Error("404.html não gerada");
console.log(`Build concluído: ${geradas.length + 1} páginas em dist/ (CSS ${cssNome}, JS ${versaoJS}).`);
