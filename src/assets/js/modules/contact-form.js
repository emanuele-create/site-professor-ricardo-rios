// Formulário de contato: validação acessível e envio progressivo.
// Modo "servico": envia ao serviço de formulários via fetch (contracts/contact-form.md).
// Modo "email": sem serviço configurado, abre o e-mail do visitante com a mensagem pronta.

const ASSUNTOS = {
  palestra: "Convite para palestra",
  empresa: "Treinamento para empresa",
  curso: "Dúvida sobre cursos",
  outro: "Outro assunto",
};

const REGRAS = {
  nome: (v) => (v.trim().length < 2 ? "Informe seu nome." : ""),
  email: (v) =>
    !v.trim() ? "Informe seu e-mail." : /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.trim()) ? "" : "Informe um e-mail válido, como nome@empresa.com.br.",
  assunto: (v) => (ASSUNTOS[v] ? "" : "Selecione o assunto."),
  mensagem: (v) => (v.trim().length < 10 ? "Escreva uma mensagem com pelo menos 10 caracteres." : ""),
  privacidade: (_, campo) => (campo.checked ? "" : "Confirme que leu a política de privacidade."),
};

function validarCampo(form, nome) {
  const campo = form.elements[nome];
  const erro = REGRAS[nome](campo.value, campo);
  const saida = form.querySelector(`#erro-${nome}`);
  campo.setAttribute("aria-invalid", String(Boolean(erro)));
  if (saida) saida.textContent = erro;
  return !erro;
}

function mostrarStatus(form, texto, tipo) {
  const status = form.querySelector("[data-form-status]");
  status.classList.toggle("form__status--erro", tipo === "erro");
  status.textContent = texto;
}

function abrirEmail(form) {
  const dados = new FormData(form);
  const assunto = ASSUNTOS[dados.get("assunto")];
  const corpo = `${dados.get("mensagem")}\n\n${dados.get("nome")}\n${dados.get("email")}`;
  const destino = form.dataset.email;
  window.location.href = `mailto:${destino}?subject=${encodeURIComponent(`Contato pelo site — ${assunto}`)}&body=${encodeURIComponent(corpo)}`;
  mostrarStatus(form, `Abrimos o seu programa de e-mail com a mensagem pronta. Se nada aconteceu, escreva para ${destino}.`, "ok");
}

async function enviarServico(form, botao) {
  const dados = new FormData(form);
  dados.set("_subject", `Contato pelo site — ${ASSUNTOS[dados.get("assunto")]}`);
  botao.disabled = true;
  mostrarStatus(form, "Enviando…", "ok");
  try {
    const resposta = await fetch(form.action, {
      method: "POST",
      body: dados,
      headers: { Accept: "application/json" },
    });
    if (resposta.ok) {
      form.reset();
      mostrarStatus(form, "Mensagem enviada. Obrigado pelo contato; a resposta chega no e-mail informado.", "ok");
      return;
    }
    const corpo = await resposta.json().catch(() => ({}));
    const detalhe = Array.isArray(corpo.errors) ? corpo.errors.map((e) => e.message).join(" ") : "";
    mostrarStatus(form, `Não foi possível enviar. ${detalhe} Seu texto foi mantido; tente de novo ou escreva para ${form.dataset.email}.`, "erro");
  } catch {
    mostrarStatus(form, `Sem conexão no momento. Seu texto foi mantido; tente de novo ou escreva para ${form.dataset.email}.`, "erro");
  } finally {
    botao.disabled = false;
  }
}

export function iniciarFormularioContato() {
  const form = document.querySelector("[data-form-contato]");
  if (!form) return;
  form.noValidate = true; // a validação passa a ser feita aqui, com mensagens acessíveis

  Object.keys(REGRAS).forEach((nome) => {
    const campo = form.elements[nome];
    campo.addEventListener("blur", () => {
      if (campo.getAttribute("aria-invalid") !== null) validarCampo(form, nome);
    });
    campo.addEventListener("change", () => {
      if (campo.getAttribute("aria-invalid") === "true") validarCampo(form, nome);
    });
  });

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const botao = form.querySelector('[type="submit"]');

    // Honeypot preenchido: provável robô. Simula sucesso sem enviar.
    if (form.elements._gotcha?.value) {
      form.reset();
      mostrarStatus(form, "Mensagem enviada.", "ok");
      return;
    }

    const invalidos = Object.keys(REGRAS).filter((nome) => !validarCampo(form, nome));
    if (invalidos.length) {
      mostrarStatus(form, `Corrija ${invalidos.length === 1 ? "o campo indicado" : `os ${invalidos.length} campos indicados`} para enviar.`, "erro");
      form.elements[invalidos[0]].focus();
      return;
    }

    if (form.dataset.modo === "servico") enviarServico(form, botao);
    else abrirEmail(form);
  });
}
