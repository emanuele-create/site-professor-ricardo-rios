// Verifica links internos, âncoras e destinos de _redirects em dist/.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const DIST = fileURLToPath(new URL("../dist/", import.meta.url));
const paginas = readdirSync(DIST, { recursive: true }).filter((f) => f.endsWith(".html"));
const html = Object.fromEntries(paginas.map((p) => [p, readFileSync(join(DIST, p), "utf8")]));

const caminhoParaArquivo = (caminho) => {
  if (caminho.endsWith("/")) return join(caminho, "index.html").slice(1);
  return caminho.slice(1);
};
const idsDe = (arquivo) => new Set([...html[arquivo].matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));

const problemas = [];
let total = 0;

for (const [arquivo, conteudo] of Object.entries(html)) {
  for (const [, href] of conteudo.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    if (/^(https?:|mailto:|tel:|data:)/.test(href)) {
      if (href === "about:blank") problemas.push(`${arquivo}: link vazio`);
      continue;
    }
    total++;
    const [caminho, ancora] = href.split("#");
    const alvo = caminho ? caminhoParaArquivo(caminho) : arquivo;
    if (caminho && !existsSync(join(DIST, alvo))) {
      problemas.push(`${arquivo}: destino inexistente ${href}`);
      continue;
    }
    if (ancora && alvo.endsWith(".html") && !idsDe(alvo).has(ancora)) {
      problemas.push(`${arquivo}: âncora inexistente ${href}`);
    }
  }
  if (/>\s*Título\s*</.test(conteudo)) problemas.push(`${arquivo}: placeholder "Título" encontrado`);
}

const redirects = readFileSync(join(DIST, "_redirects"), "utf8").split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("#"));
for (const linha of redirects) {
  const [, para] = linha.split(/\s+/);
  total++;
  if (!existsSync(join(DIST, caminhoParaArquivo(para)))) problemas.push(`_redirects: destino inexistente ${para}`);
}

if (problemas.length) {
  console.error(`${problemas.length} problema(s):\n- ${problemas.join("\n- ")}`);
  process.exit(1);
}
console.log(`Links OK: ${total} links internos e redirecionamentos verificados em ${paginas.length} páginas.`);
