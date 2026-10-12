// Alternância entre tema claro e escuro, respeitando a preferência do sistema.
import { gravar } from "./storage.js";

export function iniciarTema() {
  const botao = document.querySelector("[data-tema-alternar]");
  if (!botao) return;
  const raiz = document.documentElement;
  const sistemaEscuro = window.matchMedia("(prefers-color-scheme: dark)");

  const temaAtual = () => raiz.getAttribute("data-tema") || (sistemaEscuro.matches ? "escuro" : "claro");

  const atualizarBotao = () => botao.setAttribute("aria-pressed", String(temaAtual() === "escuro"));

  botao.addEventListener("click", () => {
    const novo = temaAtual() === "escuro" ? "claro" : "escuro";
    raiz.setAttribute("data-tema", novo);
    gravar("rr-tema", novo);
    atualizarBotao();
  });

  sistemaEscuro.addEventListener("change", atualizarBotao);
  atualizarBotao();
}
