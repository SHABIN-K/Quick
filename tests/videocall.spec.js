import { test, expect } from "@playwright/test";

const APP_WEB_URL = "http://localhost:3000";

test.beforeEach(async ({ page }) => {
  await page.goto(APP_WEB_URL);
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

test.afterEach(async ({ page }, testInfo) => {
  await page.screenshot({
    path: `./tests/snapshot/${testInfo.title}-shot.png`,
  });

  console.log(`Finished ${testInfo.title} with status ${testInfo.status}`);

  if (test.info().status !== test.info().expectedStatus)
    console.log(`Did not run as expected, ended up at ${page.url()}`);
});

test("should allow the user to videocall", async ({ page }) => {
  //get the user
  await page.getByText("Started a conversation").click();

  //fill the form
  await page.getByText("Type a message").click();
  await page.locator("[name=message]").fill("hello world");

  // click the send button
  await page.keyboard.press("Enter");
});
