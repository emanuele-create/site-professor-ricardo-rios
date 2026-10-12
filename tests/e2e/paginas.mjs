// Lista de páginas geradas, usada pelos testes.
export const PAGINAS = [
  "/",
  "/aprenda-reforma-tributaria-na-pratica/",
  "/blog/",
  "/blog/categoria/reforma-tributaria/",
  "/blog/split-payment-o-que-comeca-agora/",
  "/politica-de-privacidade/",
  "/contato/obrigado/",
  "/404.html",
];

export async function semAvisoCookies(page) {
  await page.addInitScript(() => localStorage.setItem("rr-consentimento", "recusado"));
}
