// Ponto de entrada: inicializa cada módulo apenas se seus elementos existirem.
import { iniciarMenu } from "./modules/menu.js";
import { iniciarTema } from "./modules/theme.js";
import { iniciarConsentimento } from "./modules/consent.js";
import { iniciarVideos } from "./modules/video.js";
import { iniciarFormularioContato } from "./modules/contact-form.js";
import { iniciarBarraCta } from "./modules/sticky-cta.js";

const modulos = [iniciarMenu, iniciarTema, iniciarConsentimento, iniciarVideos, iniciarFormularioContato, iniciarBarraCta];

for (const iniciar of modulos) {
  try {
    iniciar();
  } catch (erro) {
    // Uma falha isolada não deve impedir os demais módulos.
    console.error(erro);
  }
}
