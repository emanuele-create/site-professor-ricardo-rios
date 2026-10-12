// Menu principal recolhível em telas menores.
const LARGURA_DESKTOP = 1280;

export function iniciarMenu() {
  const botao = document.querySelector("[data-menu-alternar]");
  const painel = document.getElementById("menu-principal");
  if (!botao || !painel) return;
  const rotulo = botao.querySelector("[data-menu-rotulo]");

  const definir = (aberto) => {
    botao.setAttribute("aria-expanded", String(aberto));
    painel.classList.toggle("esta-aberto", aberto);
    if (rotulo) rotulo.textContent = aberto ? "Fechar menu" : "Abrir menu";
  };

  botao.addEventListener("click", () => definir(botao.getAttribute("aria-expanded") !== "true"));

  // Fecha ao escolher um link (âncoras da mesma página)
  painel.addEventListener("click", (evento) => {
    if (evento.target.closest("a")) definir(false);
  });

  // Fecha com Esc e devolve o foco ao botão
  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && botao.getAttribute("aria-expanded") === "true") {
      definir(false);
      botao.focus();
    }
  });

  window.matchMedia(`(min-width: ${LARGURA_DESKTOP}px)`).addEventListener("change", (m) => {
    if (m.matches) definir(false);
  });
}
