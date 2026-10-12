// Executa antes da pintura: marca JS ativo e aplica o tema salvo (evita piscar).
(function () {
  var raiz = document.documentElement;
  raiz.classList.remove("no-js");
  raiz.classList.add("js");
  try {
    var tema = localStorage.getItem("rr-tema");
    if (tema === "claro" || tema === "escuro") raiz.setAttribute("data-tema", tema);
  } catch (e) {
    /* armazenamento indisponível: segue o tema do sistema */
  }
})();
