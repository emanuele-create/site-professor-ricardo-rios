// WCAG 2.2 AA com axe-core em todas as páginas, nos temas claro e escuro.
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { PAGINAS, semAvisoCookies } from "./paginas.mjs";

for (const tema of ["light", "dark"]) {
  test.describe(`acessibilidade (${tema})`, () => {
    test.use({ colorScheme: tema });
    for (const caminho of PAGINAS) {
      test(`${caminho} sem violações sérias ou críticas`, async ({ page }) => {
        await semAvisoCookies(page);
        await page.goto(caminho);
        const { violations } = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
          .analyze();
        const graves = violations.filter((v) => ["serious", "critical"].includes(v.impact));
        expect(graves.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
      });
    }
  });
}

test("aviso de cookies também é acessível", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("[data-consentimento]")).toBeVisible();
  const { violations } = await new AxeBuilder({ page }).include("[data-consentimento]").analyze();
  expect(violations.filter((v) => ["serious", "critical"].includes(v.impact))).toEqual([]);
});
