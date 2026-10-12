// Gera src/assets/img/og-padrao.png (1200×630) com a identidade da marca.
// Uso: node scripts/og-image.mjs  (requer Playwright; PW_CHROMIUM opcional)
import { chromium } from "@playwright/test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const fonte = (f) => readFileSync(fileURLToPath(new URL(`../src/assets/fonts/${f}`, import.meta.url))).toString("base64");
const html = `<!DOCTYPE html><html><head><style>
@font-face{font-family:M;font-weight:800;src:url(data:font/woff2;base64,${fonte("montserrat-latin-800-normal.woff2")})}
@font-face{font-family:M;font-weight:300;src:url(data:font/woff2;base64,${fonte("montserrat-latin-300-normal.woff2")})}
@font-face{font-family:M;font-weight:600;src:url(data:font/woff2;base64,${fonte("montserrat-latin-600-normal.woff2")})}
body{margin:0;width:1200px;height:630px;background:#f5f4ef;font-family:M;position:relative;overflow:hidden}
.g{position:absolute;right:0;top:0;width:520px;height:630px;background-image:linear-gradient(#e8e8e3 1px,transparent 1px),linear-gradient(90deg,#e8e8e3 1px,transparent 1px);background-size:32px 32px;-webkit-mask-image:linear-gradient(225deg,#000 30%,transparent 75%)}
.faixa{position:absolute;left:0;right:0;top:0;height:12px;background:#12264b}
.c{position:absolute;left:64px;top:96px;right:64px}
.e{color:#3e6894;font-weight:600;font-size:20px;letter-spacing:.2em;display:flex;align-items:center;gap:18px}
.e:before{content:"";width:88px;height:1px;background:#3e6894}
h1{margin:36px 0 0;color:#02152f;font-weight:800;font-size:84px;line-height:.95;text-transform:uppercase}
h2{margin:12px 0 0;color:#02152f;font-weight:300;font-size:56px;line-height:1.05;text-transform:uppercase}
.a{position:absolute;left:0;right:0;bottom:0;height:88px;background:#12264b;color:#f5f4ef;display:flex;align-items:center;gap:28px;padding:0 64px}
.a b{font-weight:600;letter-spacing:.08em;font-size:24px}.a i{width:1px;height:32px;background:rgba(245,244,239,.4)}.a span{font-size:16px;letter-spacing:.18em}
</style></head><body><div class="faixa"></div><div class="g"></div><div class="c"><div class="e">REFORMA TRIBUTÁRIA · INTELIGÊNCIA ARTIFICIAL</div><h1>Aprenda IA e<br>Reforma Tributária</h1><h2>com quem é referência.</h2></div><div class="a"><b>RICARDO RIOS</b><i></i><span>PROFESSOR, EMPRESÁRIO E CONSULTOR</span></div></body></html>`;

const navegador = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
const pagina = await navegador.newPage({ viewport: { width: 1200, height: 630 } });
await pagina.setContent(html);
await pagina.evaluate(() => document.fonts.ready);
await pagina.screenshot({ path: fileURLToPath(new URL("../src/assets/img/og-padrao.png", import.meta.url)) });
await navegador.close();
console.log("og-padrao.png gerada.");
