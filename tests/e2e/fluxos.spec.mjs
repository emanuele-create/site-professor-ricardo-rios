// Fluxos das histórias de usuário (spec.md).
import { test, expect } from "@playwright/test";
import { semAvisoCookies } from "./paginas.mjs";

test.describe("US1 — cursos", () => {
  test("título e CTA visíveis sem rolar no celular", async ({ page }) => {
    await semAvisoCookies(page);
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto("/");
    await expect(page.locator("h1")).toBeInViewport();
    await expect(page.getByRole("link", { name: /Conheça os cursos/ })).toBeInViewport();
  });

  test("cada curso tem um link próprio e não há placeholders", async ({ page }) => {
    await semAvisoCookies(page);
    await page.goto("/");
    const secao = page.locator("#cursos");
    await expect(secao.getByRole("link", { name: "Conheça o curso" })).toHaveAttribute("href", "/aprenda-reforma-tributaria-na-pratica/");
    const hrefs = await secao.locator("a.botao").evaluateAll((as) => as.map((a) => a.getAttribute("href")));
    const externos = hrefs.filter((h) => h.startsWith("https://"));
    expect(new Set(externos).size).toBe(externos.length);
    await expect(page.locator("body")).not.toContainText(/\bTítulo\b|about:blank|100%/);
  });

  test("CTA do cabeçalho leva à seção de cursos", async ({ page }) => {
    await semAvisoCookies(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/blog/");
    await page.locator(".cabecalho__cta").click();
    await expect(page).toHaveURL(/\/#cursos$/);
  });

  test("menu móvel abre, fecha com Esc e devolve o foco", async ({ page }) => {
    await semAvisoCookies(page);
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/");
    const botao = page.locator("[data-menu-alternar]");
    await botao.click();
    await expect(botao).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#menu-principal").getByRole("link", { name: "Blog" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(botao).toHaveAttribute("aria-expanded", "false");
    await expect(botao).toBeFocused();
  });
});

test.describe("US2 — página do curso", () => {
  test("FAQ abre e fecha pelo teclado; 5 benefícios e 4 módulos", async ({ page }) => {
    await semAvisoCookies(page);
    await page.goto("/aprenda-reforma-tributaria-na-pratica/");
    await expect(page.locator(".modulo")).toHaveCount(4);
    await expect(page.locator(".beneficio__numero")).toHaveCount(5);
    const pergunta = page.locator(".faq__pergunta").first();
    await pergunta.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator(".faq__item").first()).toHaveAttribute("open", "");
    await page.keyboard.press("Enter");
    await expect(page.locator(".faq__item").first()).not.toHaveAttribute("open", "");
  });

  test("barra de inscrição aparece no celular após o topo", async ({ page }) => {
    await semAvisoCookies(page);
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/aprenda-reforma-tributaria-na-pratica/");
    const barra = page.locator("[data-barra-cta]");
    await expect(barra).not.toHaveClass(/esta-visivel/);
    await page.locator("#estrutura").scrollIntoViewIfNeeded();
    await expect(barra).toHaveClass(/esta-visivel/);
  });
});

test.describe("US4 — blog", () => {
  test("artigos em ordem decrescente e filtro por categoria", async ({ page }) => {
    await page.goto("/blog/");
    const datas = await page.locator(".artigo-cartao time").evaluateAll((ts) => ts.map((t) => t.getAttribute("datetime")));
    expect(datas).toEqual([...datas].sort().reverse());
    expect(datas.length).toBe(6);
    await page.getByRole("link", { name: "Contabilidade", exact: true }).click();
    await expect(page).toHaveURL(/\/blog\/categoria\/contabilidade\/$/);
    await expect(page.locator(".artigo-cartao")).toHaveCount(2);
    await expect(page.getByRole("link", { name: "Contabilidade", exact: true })).toHaveAttribute("aria-current", "page");
  });

  test("endereço antigo do blog redireciona", async ({ page }) => {
    await page.goto("/inicio/blog-contabil-financeiro/");
    await expect(page).toHaveURL(/\/blog\/$/);
  });

  test("endereço inexistente mostra página 404 útil", async ({ page }) => {
    const resposta = await page.goto("/nao-existe/");
    expect(resposta.status()).toBe(404);
    await expect(page.getByRole("link", { name: "Página inicial", exact: true })).toBeVisible();
  });
});

test.describe("US5 — vídeos", () => {
  test("sem consentimento, nenhum player é carregado", async ({ page }) => {
    await semAvisoCookies(page);
    await page.goto("/#videos");
    await expect(page.locator("iframe")).toHaveCount(0);
    await expect(page.locator(".video__fachada").first()).toHaveAttribute("href", /youtube\.com\/watch/);
  });

  test("com consentimento, o player só aparece após o clique", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("rr-consentimento", "aceito"));
    await page.route("https://www.youtube-nocookie.com/**", (r) => r.fulfill({ body: "<p>player</p>", contentType: "text/html" }));
    await page.goto("/#videos");
    await expect(page.locator("iframe")).toHaveCount(0);
    await page.locator(".video__fachada").first().click();
    await expect(page.locator("iframe")).toHaveAttribute("src", /youtube-nocookie\.com\/embed\/Tt8ymkFv5YQ/);
  });
});

test.describe("US6 — contato e privacidade", () => {
  test("aviso de cookies aparece uma vez e pode ser reaberto", async ({ page }) => {
    await page.goto("/");
    const aviso = page.locator("[data-consentimento]");
    await expect(aviso).toBeVisible();
    await aviso.getByRole("button", { name: "Recusar" }).click();
    await expect(aviso).toBeHidden();
    await page.reload();
    await expect(aviso).toBeHidden();
    await page.getByRole("button", { name: "Preferências de cookies" }).click();
    await expect(aviso).toBeVisible();
  });

  test("formulário vazio mostra erros por campo e foca o primeiro", async ({ page }) => {
    await semAvisoCookies(page);
    await page.goto("/#contato");
    await page.getByRole("button", { name: "Enviar mensagem" }).click();
    await expect(page.locator("#campo-nome")).toBeFocused();
    await expect(page.locator("#campo-nome")).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator("#erro-email")).toHaveText("Informe seu e-mail.");
    await expect(page.locator("#erro-privacidade")).not.toBeEmpty();
    await expect(page.locator("[data-form-status]")).toContainText("5 campos");
  });

  test("e-mail inválido é rejeitado", async ({ page }) => {
    await semAvisoCookies(page);
    await page.goto("/#contato");
    await page.fill("#campo-email", "nome@");
    await page.getByRole("button", { name: "Enviar mensagem" }).click();
    await expect(page.locator("#erro-email")).toContainText("e-mail válido");
  });

  test("envio pelo serviço mostra confirmação e limpa o formulário", async ({ page }) => {
    await semAvisoCookies(page);
    await page.goto("/#contato");
    // Simula o modo serviço com endpoint fictício interceptado
    await page.evaluate(() => {
      const f = document.querySelector("[data-form-contato]");
      f.dataset.modo = "servico";
      f.action = "https://formspree.io/f/teste";
    });
    await page.route("https://formspree.io/**", (r) => r.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' }));
    await page.fill("#campo-nome", "Maria Souza");
    await page.fill("#campo-email", "maria@empresa.com.br");
    await page.selectOption("#campo-assunto", "palestra");
    await page.fill("#campo-mensagem", "Gostaria de convidar para uma palestra.");
    await page.check("#campo-privacidade");
    await page.getByRole("button", { name: "Enviar mensagem" }).click();
    await expect(page.locator("[data-form-status]")).toContainText("Mensagem enviada");
    await expect(page.locator("#campo-nome")).toHaveValue("");
  });

  test("falha de rede mantém o texto digitado", async ({ page }) => {
    await semAvisoCookies(page);
    await page.goto("/#contato");
    await page.evaluate(() => {
      const f = document.querySelector("[data-form-contato]");
      f.dataset.modo = "servico";
      f.action = "https://formspree.io/f/teste";
    });
    await page.route("https://formspree.io/**", (r) => r.abort());
    await page.fill("#campo-nome", "Maria Souza");
    await page.fill("#campo-email", "maria@empresa.com.br");
    await page.selectOption("#campo-assunto", "curso");
    await page.fill("#campo-mensagem", "Dúvida sobre o curso de reforma.");
    await page.check("#campo-privacidade");
    await page.getByRole("button", { name: "Enviar mensagem" }).click();
    await expect(page.locator("[data-form-status]")).toContainText("Seu texto foi mantido");
    await expect(page.locator("#campo-mensagem")).toHaveValue("Dúvida sobre o curso de reforma.");
  });

  test("política de privacidade tem 8 seções e data", async ({ page }) => {
    await page.goto("/politica-de-privacidade/");
    await expect(page.locator(".prosa h2")).toHaveCount(8);
    await expect(page.locator("time")).toContainText("2026");
  });
});

test.describe("sem JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("menu, FAQ e formulário continuam utilizáveis", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/");
    await expect(page.locator(".nav__lista").getByRole("link", { name: "Blog" })).toBeVisible();
    await expect(page.locator("[data-form-contato]")).toHaveAttribute("action", /^(mailto:|https:)/);
    await page.goto("/aprenda-reforma-tributaria-na-pratica/");
    await page.locator(".faq__pergunta").first().click();
    await expect(page.locator(".faq__item").first()).toHaveAttribute("open", "");
  });
});
