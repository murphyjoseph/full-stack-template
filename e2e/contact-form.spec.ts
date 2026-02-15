import { test, expect } from "@playwright/test";

const API_URL = "http://localhost:3001";

test.describe("Contact Form", () => {
  test.beforeEach(async ({ request }) => {
    const res = await request.get(`${API_URL}/contacts`);
    const contacts = await res.json();
    for (const contact of contacts) {
      await request.delete(`${API_URL}/contacts/${contact.id}`);
    }
  });

  test("can submit a contact and see it in the list", async ({ page }) => {
    await page.goto("/contacts");

    await page.fill('[name="name"]', "Test User");
    await page.fill('[name="email"]', "test@example.com");
    await page.fill('[name="message"]', "Hello from Playwright");

    await page.click('button[type="submit"]');

    await expect(page.getByText("Test User")).toBeVisible();
    await expect(page.getByText("test@example.com")).toBeVisible();
    await expect(page.getByText("Hello from Playwright")).toBeVisible();
  });
});
