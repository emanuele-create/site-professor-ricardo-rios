# Contrato: formulário de contato

**Destino**: `POST {site.formEndpoint}` (Formspree). Sem JS: `application/x-www-form-urlencoded`
e o serviço mostra sua página de confirmação. Com JS: `fetch` com `FormData` e
`Accept: application/json`.

## Campos

| name | Obrigatório | Validação no cliente |
|------|-------------|----------------------|
| nome | sim | 2–100 caracteres |
| email | sim | formato de e-mail |
| assunto | sim | palestra \| empresa \| curso \| outro |
| mensagem | sim | 10–3000 caracteres |
| privacidade | sim | marcado |
| _gotcha | não (honeypot) | oculto; se preenchido, o envio é descartado |
| _subject | fixo | "Contato pelo site — {assunto}" |

## Respostas (modo JS)

| Resposta | Comportamento na página |
|----------|-------------------------|
| 200 `{ "ok": true }` | limpa o formulário e anuncia "Mensagem enviada." em região `aria-live` |
| 4xx com `errors[]` | mostra a mensagem do serviço; mantém o que foi digitado |
| Falha de rede / 5xx | mantém o texto; mostra erro + e-mail de contato como alternativa |
| `formEndpoint` vazio | formulário desabilitado com aviso e link `mailto:` |

## Segurança

- CSP: `form-action 'self' https://formspree.io` e `connect-src 'self' https://formspree.io`.
- Nenhum dado gravado no site; política de privacidade cita o serviço como operador.
