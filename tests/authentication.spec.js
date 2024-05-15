// @ts-check
import { test, expect } from "@playwright/test";

const APP_WEB_URL = "http://localhost:3000";

test.beforeEach(async ({ page }) => {
  await page.goto(APP_WEB_URL);
});

test.afterEach(async ({ page }, testInfo) => {
  await page.screenshot({
    path: `./tests/snapshot/${testInfo.title}-shot.png`,
  });

  console.log(`Finished ${testInfo.title} with status ${testInfo.status}`);

  if (test.info().status !== test.info().expectedStatus)
    console.log(`Did not run as expected, ended up at ${page.url()}`);
});

test("should allow the user to Register", async ({ page }) => {
  //get the sign in button
  await page.getByText("Create an account").click();

  //fill the form with the required information
  await page.locator("[name=name]").fill("ericdaniyel");
  await page.locator("[name=username]").fill("blahabal");
  await page.locator("[name=email]").fill("1@1.com");
  await page.locator("[name=password]").fill("password123");

  // click the register button
  await page.getByRole("button", { name: "Register" }).click();

  // wait for the page to redirect to the chat page
  await page.waitForURL("**/chats");

  await expect(
    page.getByText("Select a chat or start a new conversation")
  ).toBeVisible();
});

test("should allow the user to Login", async ({ page }) => {
  //fill the form with the required information
  await page.locator("[name=email]").fill("1@1.com");
  await page.locator("[name=password]").fill("password123");

  // click the Sign up button
  await page.getByRole("button", { name: "Sign in" }).click();

  // wait for the page to redirect to the chat page
  await page.waitForURL("**/chats");
  await expect(
    page.getByText("Select a chat or start a new conversation")
  ).toBeVisible();
});

test.describe("should allow to user to Forget password", () => {
  test("Request for Password Reset Instructions", async ({ page }) => {
    //get the sign in button
    await page.getByText("forget password ?").click();

    // wait for the page to redirect to the forget page
    await page.waitForURL("**/forget-pass");
    await expect(
      page.getByRole("heading", { name: "Forgot your password?" })
    ).toBeVisible();

    //fill the form with the email
    await page.locator("[name=email]").fill("1@1.com");

    // click the Forget button
    await page.getByRole("button", { name: "Reset password" }).click();

    // wait for the page to redirect to the chat page
    await page.goto(APP_WEB_URL);

    await expect(page.getByText("New to Quick?")).toBeVisible();
  });

  test("create new password", async ({ page }) => {
    await page.goto(`${APP_WEB_URL}/forget-pass/token`);

    // wait for the Reset page
    await expect(
      page.getByRole("heading", { name: "Create new password?" })
    ).toBeVisible();

    //fill the form with the email
    await page.getByLabel("New password").fill("12345678");
    await page.getByLabel("Confirm Password").fill("12345678");

    // click the Forget button
    await page.getByRole("button", { name: "Reset password" }).click();

    // wait for the page to redirect to the chat page
    await page.waitForURL("**/forget-pass");
    await expect(
      page.getByRole("heading", { name: "Forgot your password?" })
    ).toBeVisible();
  });
});

test.afterAll(async () => {
  console.log("Authentication test completed");
});
