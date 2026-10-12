// Gera render.yaml (Blueprint do Render) a partir de src/static/_headers e _redirects,
// mantendo uma única fonte de verdade para cabeçalhos e redirecionamentos.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const raiz = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const linhas = (p) => readFileSync(raiz(p), "utf8").split("\n").filter((l) => l.trim() && !l.startsWith("#"));
const aspas = (v) => `"${v.replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"`;

const cabecalhos = [];
let caminho = null;
for (const l of linhas("src/static/_headers")) {
  if (!l.startsWith(" ")) {
    caminho = l.trim();
    continue;
  }
  if (caminho.startsWith("/*.")) continue; // padrão por extensão não suportado pelo Render
  const i = l.indexOf(":");
  cabecalhos.push([caminho, l.slice(0, i).trim(), l.slice(i + 1).trim()]);
}
const rotas = linhas("src/static/_redirects").map((l) => l.trim().split(/\s+/));

const saida = [
  "# Blueprint do Render — site estático",
  "# Gerado a partir de src/static/_headers e src/static/_redirects.",
  "# Ao alterar esses arquivos, atualize também este (ou rode: node scripts/render-yaml.mjs).",
  "services:",
  "  - type: web",
  "    name: site-professor-ricardo-rios",
  "    runtime: static",
  "    buildCommand: node scripts/build.mjs",
  "    staticPublishPath: ./dist",
  "    headers:",
  ...cabecalhos.flatMap(([p, n, v]) => [`      - path: ${p}`, `        name: ${n}`, `        value: ${aspas(v)}`]),
  "    routes:",
  ...rotas.flatMap(([de, para]) => ["      - type: redirect", `        source: ${de}`, `        destination: ${para}`]),
];
writeFileSync(raiz("render.yaml"), saida.join("\n") + "\n");
console.log(`render.yaml gerado: ${cabecalhos.length} cabeçalhos, ${rotas.length} redirecionamentos.`);
