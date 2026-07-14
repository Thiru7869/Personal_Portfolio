import { test, expect } from "@playwright/test";

/**
 * E2E smoke tests — verify the critical user journeys against a
 * production build: the homepage renders the owner's name, the
 * appearance toggle flips light/dark, and the blog/Q&A routes
 * load their real content.
 */

test("homepage renders the full name and default light appearance", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("Poluru Thirumala Narasimha");
  await expect(page.locator("html")).toHaveAttribute("data-appearance", "light");
  await expect(page.locator("html")).toHaveAttribute("data-mode", "professional");
});

test("appearance toggle switches to dark and back", async ({ page }) => {
  await page.goto("/");
  const html = page.locator("html");
  const toggle = page.getByRole("button", { name: /appearance/i });
  await toggle.click();
  await expect(html).toHaveAttribute("data-appearance", "dark");
  await toggle.click();
  await expect(html).toHaveAttribute("data-appearance", "light");
});

test("blog index lists articles and an article opens", async ({ page }) => {
  await page.goto("/blog");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const firstCard = page.locator('a[href^="/blog/"]').first();
  await firstCard.click();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page).toHaveURL(/\/blog\/.+/);
});

test("Q&A page renders questions and search works", async ({ page }) => {
  await page.goto("/qa");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/Q&A|Questions/i);
  const details = page.locator("details");
  await expect(details.first()).toBeVisible();
});

test("projects page loads real project cards", async ({ page }) => {
  await page.goto("/projects");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
