// Acesso seguro ao localStorage (pode estar bloqueado ou indisponível).
export function ler(chave) {
  try {
    return localStorage.getItem(chave);
  } catch {
    return null;
  }
}

export function gravar(chave, valor) {
  try {
    localStorage.setItem(chave, valor);
  } catch {
    /* sem persistência: a escolha vale só nesta visita */
  }
}
