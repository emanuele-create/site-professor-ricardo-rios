// Barra fixa de inscrição na página do curso (celular): aparece depois que o
// botão principal sai da tela e some quando a chamada final está visível.
export function iniciarBarraCta() {
  const barra = document.querySelector("[data-barra-cta]");
  const principal = document.querySelector("[data-cta-principal]");
  const final = document.querySelector("[data-cta-final]");
  if (!barra || !principal || !("IntersectionObserver" in window)) return;

  let principalVisivel = true;
  let finalVisivel = false;

  const atualizar = () => {
    const mostrar = !principalVisivel && !finalVisivel;
    barra.classList.toggle("esta-visivel", mostrar);
    barra.inert = !mostrar;
  };

  barra.hidden = false;
  atualizar();

  new IntersectionObserver(([e]) => {
    principalVisivel = e.isIntersecting || e.boundingClientRect.top > 0;
    atualizar();
  }).observe(principal);

  if (final) {
    new IntersectionObserver(([e]) => {
      finalVisivel = e.isIntersecting;
      atualizar();
    }).observe(final);
  }
}
