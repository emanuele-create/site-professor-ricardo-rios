// Sem rolagem horizontal de 320 a 1920px (Princípio II).
import { test, expect } from "@playwright/test";
import { PAGINAS, semAvisoCookies } from "./paginas.mjs";

const LARGURAS = [320, 360, 768, 1024, 1440, 1920];

for (const largura of LARGURAS) {
  test(`sem rolagem horizontal em ${largura}px`, async ({ page }) => {
    await semAvisoCookies(page);
    await page.setViewportSize({ width: largura, height: 900 });
    for (const caminho of PAGINAS) {
      await page.goto(caminho);
      const excesso = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(excesso, `${caminho} em ${largura}px`).toBeLessThanOrEqual(0);
    }
  });
}

test("alvos de toque têm pelo menos 44px no celular", async ({ page }) => {
  await semAvisoCookies(page);
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");
  const pequenos = await page.$$eval("a.botao, button, .nav__link, .botao-icone", (els) =>
    els
      .filter((el) => el.offsetParent !== null)
      .map((el) => ({ t: el.textContent.trim().slice(0, 30), h: el.getBoundingClientRect().height }))
      .filter((r) => r.h > 0 && r.h < 44)
  );
  expect(pequenos).toEqual([]);
});
