// Servidor local de dist/ (somente desenvolvimento). Aplica _redirects e 404.
import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const DIST = fileURLToPath(new URL("../dist/", import.meta.url));
const PORTA = Number(process.env.PORT ?? 8080);
const TIPOS = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".avif": "image/avif",
  ".woff2": "font/woff2", ".xml": "application/xml", ".txt": "text/plain; charset=utf-8", ".json": "application/json",
};

const redirecionamentos = existsSync(join(DIST, "_redirects"))
  ? readFileSync(join(DIST, "_redirects"), "utf8").split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("#")).map((l) => l.split(/\s+/))
  : [];

createServer((req, res) => {
  const caminho = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  for (const [de, para, codigo] of redirecionamentos) {
    const casa = de.endsWith("*") ? caminho.startsWith(de.slice(0, -1)) : caminho === de;
    if (casa) {
      res.writeHead(Number(codigo ?? 301), { Location: para });
      return res.end();
    }
  }
  let arquivo = normalize(join(DIST, caminho));
  if (!arquivo.startsWith(DIST)) return res.writeHead(403).end();
  if (existsSync(arquivo) && statSync(arquivo).isDirectory()) arquivo = join(arquivo, "index.html");
  if (!existsSync(arquivo)) {
    res.writeHead(404, { "Content-Type": TIPOS[".html"] });
    return res.end(readFileSync(join(DIST, "404.html")));
  }
  res.writeHead(200, { "Content-Type": TIPOS[extname(arquivo)] ?? "application/octet-stream" });
  res.end(readFileSync(arquivo));
}).listen(PORTA, () => console.log(`Servindo dist/ em http://localhost:${PORTA}`));
