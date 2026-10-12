// Aviso de cookies (LGPD): pergunta no primeiro acesso e permite rever a escolha.
import { ler, gravar } from "./storage.js";

const CHAVE = "rr-consentimento";

export function consentimentoAceito() {
  return ler(CHAVE) === "aceito";
}

export function iniciarConsentimento() {
  const aviso = document.querySelector("[data-consentimento]");
  if (!aviso) return;

  const mostrar = () => {
    aviso.hidden = false;
    aviso.querySelector("button")?.focus({ preventScroll: true });
  };

  if (ler(CHAVE) === null) aviso.hidden = false;

  aviso.addEventListener("click", (evento) => {
    const botao = evento.target.closest("[data-consentimento-escolha]");
    if (!botao) return;
    gravar(CHAVE, botao.dataset.consentimentoEscolha);
    aviso.hidden = true;
    document.dispatchEvent(new CustomEvent("rr:consentimento"));
  });

  document.querySelectorAll("[data-consentimento-abrir]").forEach((b) => b.addEventListener("click", mostrar));
}
