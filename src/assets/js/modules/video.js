// Fachada de vídeo: só incorpora o player do YouTube com consentimento.
// Sem consentimento (ou sem JS), o link abre o vídeo no próprio YouTube.
import { consentimentoAceito } from "./consent.js";

const ID_VALIDO = /^[A-Za-z0-9_-]{11}$/;

function incorporar(quadro) {
  const id = quadro.dataset.video;
  if (!ID_VALIDO.test(id)) return;
  const iframe = document.createElement("iframe");
  iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
  iframe.title = quadro.dataset.titulo || "Vídeo do YouTube";
  iframe.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
  iframe.allowFullscreen = true;
  iframe.referrerPolicy = "strict-origin-when-cross-origin";
  quadro.replaceChildren(iframe);
  iframe.focus();
}

export function iniciarVideos() {
  document.querySelectorAll("[data-video]").forEach((quadro) => {
    const fachada = quadro.querySelector(".video__fachada");
    if (!fachada) return;
    fachada.addEventListener("click", (evento) => {
      if (!consentimentoAceito()) return; // segue o link para o YouTube
      evento.preventDefault();
      incorporar(quadro);
    });
  });
}
