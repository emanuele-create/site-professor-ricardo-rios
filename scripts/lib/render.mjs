// Utilitários de renderização: escape, templates e componentes HTML.
// Todo texto vindo dos JSON passa por esc() — nunca é inserido cru.

import { readFileSync } from "node:fs";
import { join } from "node:path";

const MESES = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

export function esc(valor) {
  return String(valor ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/** Texto com realce: **trecho** vira <strong>trecho</strong> (após escape). */
export function inline(texto) {
  return esc(texto).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

export function dataExtenso(iso) {
  const [a, m, d] = iso.split("-").map(Number);
  return `${d} de ${MESES[m - 1]} de ${a}`;
}

export function dataCurta(iso) {
  const [a, m, d] = iso.split("-");
  return `${d}/${m}/${a}`;
}

/* --------------------------------------------------------------------------
   Templates: {{> parcial}}, {{{bruto}}}, {{escapado}} (caminhos com ponto)
   -------------------------------------------------------------------------- */

function obter(ctx, caminho) {
  return caminho.split(".").reduce((o, k) => (o == null ? undefined : o[k]), ctx);
}

export function renderizar(modelo, ctx, dirParciais, profundidade = 0) {
  if (profundidade > 10) throw new Error("Inclusão de parciais recursiva demais");
  let saida = modelo.replace(/\{\{>\s*([\w-]+)\s*\}\}/g, (_, nome) => {
    const parcial = readFileSync(join(dirParciais, `${nome}.html`), "utf8");
    return renderizar(parcial, ctx, dirParciais, profundidade + 1);
  });
  saida = saida.replace(/\{\{\{\s*([\w.-]+)\s*\}\}\}/g, (_, chave) => {
    const v = obter(ctx, chave);
    if (v === undefined) throw new Error(`Variável bruta ausente: ${chave}`);
    return String(v);
  });
  saida = saida.replace(/\{\{\s*([\w.-]+)\s*\}\}/g, (_, chave) => {
    const v = obter(ctx, chave);
    if (v === undefined) throw new Error(`Variável ausente: ${chave}`);
    return esc(v);
  });
  return saida;
}

/* --------------------------------------------------------------------------
   Ícones (SVG inline, traço fino 1.5px)
   -------------------------------------------------------------------------- */

const svg = (conteudo, extra = "") =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"${extra}>${conteudo}</svg>`;

export const icones = {
  externo: svg('<path d="M14 4h6v6"/><path d="M20 4 10 14"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>', ' class="externo-icone"'),
  play: svg('<path d="M8 5.5v13l11-6.5z" fill="currentColor"/>', ' width="20" height="20"'),
  documento: svg('<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5"/><path d="M8.5 13h7M8.5 16.5h7"/>'),
  pasta: svg('<path d="M3 7a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M3 11h18"/>'),
  engrenagem: svg('<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>'),
};

export const monograma = (classe = "marca__monograma") =>
  `<svg class="${classe}" viewBox="0 0 40 40" aria-hidden="true" focusable="false"><rect x="0.75" y="0.75" width="38.5" height="38.5" fill="none" stroke="currentColor" stroke-width="1.5"/><text x="6" y="28" font-family="Montserrat, Arial, sans-serif" font-size="20" font-weight="800" fill="currentColor">R</text><text x="19.5" y="28" font-family="Montserrat, Arial, sans-serif" font-size="20" font-weight="300" class="monograma__aco">R</text></svg>`;

/* --------------------------------------------------------------------------
   Componentes
   -------------------------------------------------------------------------- */

const AVISO_NOVA_ABA = '<span class="visualmente-oculto"> (abre em nova aba)</span>';

export function linkExterno(href, rotulo, classe = "") {
  const c = classe ? ` class="${classe}"` : "";
  return `<a${c} href="${esc(href)}" target="_blank" rel="noopener noreferrer">${rotulo}${AVISO_NOVA_ABA} ${icones.externo}</a>`;
}

/** Link interno (/...) normal ou externo (https://) com aviso de nova aba. */
export function link(href, rotulo, classe = "") {
  if (/^https?:\/\//.test(href)) return linkExterno(href, rotulo, classe);
  const c = classe ? ` class="${classe}"` : "";
  return `<a${c} href="${esc(href)}">${rotulo}</a>`;
}

const STATUS = {
  abertas: "Matrículas abertas",
  encerradas: "Matrículas encerradas",
  "em-breve": "Em breve",
};

export function rotuloStatus(status) {
  return STATUS[status] ?? "";
}

export function rotuloCompra(curso) {
  if (curso.rotuloLink) return curso.rotuloLink;
  if (curso.status === "abertas") return "Garantir minha vaga";
  if (curso.status === "em-breve") return "Avise-me";
  return "Ver detalhes";
}

export function cursosHTML(cursos) {
  const destaque = cursos.find((c) => c.destaque);
  const outros = cursos.filter((c) => !c.destaque);
  let html = "";
  if (destaque) {
    const topicos = (destaque.topicos ?? []).map((t) => `<li>${esc(t)}</li>`).join("");
    html += `
<article class="curso-destaque" aria-labelledby="curso-${esc(destaque.id)}">
  <div class="painel com-grade-escura">
    <p class="painel__pergunta">Curso em destaque</p>
    <div>
      <p class="selo">${esc(rotuloStatus(destaque.status))}</p>
    </div>
    <hr class="fio-no">
    <p class="corpo-pequeno">${esc(destaque.publico)}</p>
  </div>
  <div class="curso-destaque__corpo">
    <p class="eyebrow">${esc(destaque.editoria)}</p>
    <h3 class="titulo-2" id="curso-${esc(destaque.id)}">${esc(destaque.nome)}</h3>
    <p>${esc(destaque.resumo)}</p>
    <ul class="curso-destaque__topicos" role="list">${topicos}</ul>
    <div class="botoes botoes--empilhar">
      ${destaque.pagina ? `<a class="botao" href="${esc(destaque.pagina)}">Conheça o curso <span class="seta" aria-hidden="true">→</span></a>` : ""}
      ${linkExterno(destaque.linkCompra, esc(rotuloCompra(destaque)), "botao botao--secundario")}
    </div>
  </div>
</article>`;
  }
  if (outros.length) {
    html += `<ul class="grade-2" role="list">${outros
      .map(
        (c) => `
<li class="cartao">
  <p class="eyebrow eyebrow--curto">${esc(c.editoria)}</p>
  <h3 class="cartao__titulo">${esc(c.nome)}</h3>
  <p>${esc(c.resumo)}</p>
  <p class="cartao__publico"><strong>Para quem:</strong> ${esc(c.publico)}</p>
  <div class="cartao__rodape">${link(
    c.pagina ?? c.linkCompra,
    `${esc(c.pagina ? "Conheça o curso" : rotuloCompra(c))}${/^https?:/.test(c.pagina ?? c.linkCompra) ? "" : ' <span class="seta" aria-hidden="true">→</span>'}`,
    "botao botao--secundario"
  )}</div>
</li>`
      )
      .join("")}</ul>`;
  }
  return html;
}

function capaHTML(livro, destaque = false) {
  if (livro.imagem) {
    return `<img class="capa-imagem" src="${esc(livro.imagem)}" alt="Capa do livro ${esc(livro.titulo)}" width="400" height="600" loading="lazy" decoding="async">`;
  }
  const autores = ["Ricardo Rios", ...(livro.coautores ?? [])].join(" · ");
  return `<div class="bloco-tipografico capa${destaque ? " capa--destaque" : ""}" aria-hidden="true">
    <span class="capa__titulo">${esc(livro.titulo)}</span>
    ${livro.edicao ? `<span class="descritor capa__edicao">${esc(livro.edicao)}</span>` : ""}
    <span class="capa__autores">${esc(autores)}</span>
  </div>`;
}

function autoria(livro) {
  if (!livro.coautores?.length) return "Ricardo Rios";
  return `Com ${livro.coautores.join(" e ")}`;
}

export function livrosHTML(livros) {
  const destaque = livros.find((l) => l.destaque);
  const outros = livros.filter((l) => !l.destaque);
  let html = "";
  if (destaque) {
    html += `
<article class="livro-destaque" aria-labelledby="livro-destaque-titulo">
  ${capaHTML(destaque, true)}
  <div class="livro-destaque__texto">
    <p class="eyebrow">Livro em destaque</p>
    <h3 class="titulo-2" id="livro-destaque-titulo">${esc(destaque.titulo)}</h3>
    ${destaque.subtitulo ? `<p class="lead">${esc(destaque.subtitulo)}</p>` : ""}
    ${destaque.resumo ? `<p>${esc(destaque.resumo)}</p>` : ""}
    <div class="botoes">${linkExterno(destaque.link, "Ver na Amazon", "botao")}</div>
  </div>
</article>`;
  }
  html += `<ul class="livros" role="list">${outros
    .map(
      (l) => `
<li class="livro">
  ${capaHTML(l)}
  <h3 class="livro__titulo">${linkExterno(l.link, esc(l.titulo))}</h3>
  ${l.subtitulo ? `<p class="corpo-pequeno">${esc(l.subtitulo)}</p>` : ""}
  <p class="meta">${esc(autoria(l))}${l.edicao ? ` · ${esc(l.edicao)}` : ""}</p>
</li>`
    )
    .join("")}</ul>`;
  return html;
}

export function episodiosHTML(episodios, limite = 4) {
  const lista = [...episodios].sort((a, b) => b.data.localeCompare(a.data)).slice(0, limite);
  return `<ol class="lista-fios">${lista
    .map(
      (e) => `
<li class="episodio">
  <p class="meta"><time datetime="${esc(e.data)}">${esc(dataCurta(e.data))}</time></p>
  <h3 class="episodio__titulo">${esc(e.titulo)}</h3>
  ${linkExterno(e.link, "Ouvir episódio", "episodio__link")}
</li>`
    )
    .join("")}</ol>`;
}

export function videosHTML(videos) {
  return `<ul class="grade-2" role="list">${videos
    .map((v) => {
      const url = `https://www.youtube.com/watch?v=${v.youtubeId}`;
      return `
<li class="video">
  <div class="video__quadro" data-video="${esc(v.youtubeId)}" data-titulo="${esc(v.titulo)}">
    <a class="video__fachada" href="${esc(url)}" target="_blank" rel="noopener noreferrer">
      <span class="eyebrow eyebrow--curto">Canal CONFI</span>
      <span class="titulo-3">${esc(v.titulo)}</span>
      <span class="video__play"><span class="video__play-circulo">${icones.play}</span> Reproduzir vídeo<span class="visualmente-oculto">: ${esc(v.titulo)} (abre no YouTube)</span></span>
    </a>
  </div>
  <p class="video__nota">Ao reproduzir, o vídeo é carregado do YouTube.</p>
</li>`;
    })
    .join("")}</ul>`;
}

export function artigoCartaoHTML(artigo, categorias, nivelTitulo = 3) {
  const cat = categorias.find((c) => c.slug === artigo.categoria);
  const midia = artigo.imagem
    ? `<img class="artigo-cartao__imagem" src="${esc(artigo.imagem)}" alt="" width="640" height="360" loading="lazy" decoding="async">`
    : `<div class="bloco-tipografico" aria-hidden="true"><span class="eyebrow eyebrow--curto">${esc(cat.nome)}</span>${monograma("bloco-tipografico__marca")}</div>`;
  return `
<li class="cartao cartao--clicavel artigo-cartao">
  ${midia}
  <div class="artigo-cartao__corpo">
    <div class="artigo-cartao__meta">
      <span class="artigo-cartao__categoria">${esc(cat.nome)}</span>
      <time datetime="${esc(artigo.data)}">${esc(dataCurta(artigo.data))}</time>
    </div>
    <h${nivelTitulo} class="cartao__titulo"><a href="/blog/${esc(artigo.slug)}/">${esc(artigo.titulo)}</a></h${nivelTitulo}>
    <p class="corpo-pequeno">${esc(artigo.resumo)}</p>
  </div>
</li>`;
}

export function artigosListaHTML(artigos, categorias, nivelTitulo = 3) {
  if (!artigos.length) {
    return `<p class="vazio">Ainda não há artigos nesta categoria. <a href="/blog/">Ver todos os artigos</a>.</p>`;
  }
  return `<ul class="grade-3" role="list">${artigos.map((a) => artigoCartaoHTML(a, categorias, nivelTitulo)).join("")}</ul>`;
}

export function conteudoArtigoHTML(blocos) {
  return blocos
    .map((b) => {
      if (b.tipo === "p") return `<p>${inline(b.texto)}</p>`;
      if (b.tipo === "h2") return `<h2>${inline(b.texto)}</h2>`;
      if (b.tipo === "lista") return `<ul>${b.itens.map((i) => `<li>${inline(i)}</li>`).join("")}</ul>`;
      throw new Error(`Tipo de bloco desconhecido: ${b.tipo}`);
    })
    .join("\n");
}

export function filtroCategoriasHTML(categorias, atual) {
  const itens = [{ slug: "", nome: "Todos" }, ...categorias].map((c) => {
    const href = c.slug ? `/blog/categoria/${c.slug}/` : "/blog/";
    const corrente = (c.slug || "") === (atual || "") ? ' aria-current="page"' : "";
    return `<li><a href="${href}"${corrente}>${esc(c.nome)}</a></li>`;
  });
  return `<nav aria-label="Categorias do blog"><ul class="filtro" role="list">${itens.join("")}</ul></nav>`;
}

export function fluxoHTML(etapas) {
  const iconesFluxo = [icones.documento, icones.pasta, icones.engrenagem];
  return `<ol class="fluxo">${etapas
    .map(
      (e, i) => `${i ? '<li class="fluxo__seta" aria-hidden="true">→</li>' : ""}
<li class="fluxo__etapa fluxo__etapa--${(i % 3) + 1}">
  <span class="fluxo__circulo">${iconesFluxo[i % 3]}</span>
  <span class="rotulo">Etapa ${i + 1}</span>
  <h3 class="titulo-3">${esc(e.titulo)}</h3>
  <p class="corpo-pequeno">${esc(e.texto)}</p>
</li>`
    )
    .join("")}</ol>`;
}

export function beneficiosHTML(beneficios) {
  return `<ul class="grade-3" role="list">${beneficios
    .map(
      (b, i) => `
<li class="cartao">
  <span class="beneficio__numero">${String(i + 1).padStart(2, "0")}</span>
  <h3 class="cartao__titulo">${esc(b.titulo)}</h3>
  <p>${esc(b.texto)}</p>
</li>`
    )
    .join("")}</ul>`;
}

export function modulosHTML(modulos) {
  return `<ol class="lista-fios">${modulos
    .map(
      (m) => `
<li class="modulo">
  <span class="modulo__numero" aria-hidden="true">${String(m.numero).padStart(2, "0")}</span>
  <div class="modulo__corpo">
    <h3 class="titulo-3"><span class="visualmente-oculto">Módulo ${m.numero}: </span>${esc(m.nome)}</h3>
    <p>${esc(m.resumo)}</p>
  </div>
  <dl class="modulo__meta">
    <dt>Carga horária</dt><dd>${esc(m.cargaHoraria)}</dd>
    <dt>Liberação</dt><dd>${esc(m.liberacao)}</dd>
  </dl>
</li>`
    )
    .join("")}</ol>`;
}

export function faqHTML(faq) {
  return `<div class="faq">${faq
    .map(
      (f) => `
<details class="faq__item">
  <summary class="faq__pergunta">${esc(f.pergunta)}</summary>
  <div class="faq__resposta"><p>${esc(f.resposta)}</p></div>
</details>`
    )
    .join("")}</div>`;
}

export function redesHTML(redes) {
  return redes.map((r) => `<li>${linkExterno(r.url, esc(r.nome))}</li>`).join("");
}

export function jsonLd(obj) {
  return `<script type="application/ld+json">${JSON.stringify(obj).replaceAll("<", "\\u003c")}</script>`;
}
