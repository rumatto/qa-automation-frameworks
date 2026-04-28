import { allure } from 'allure-playwright';
import { expect, test } from '../utils/fixtures';
import { runtimeConfig } from '../utils/runtimeConfig';

test.describe('Demo retry flow', () => {
  test.describe.configure({ retries: 1 });

  test('fails once for artifacts and passes on rerun', async ({ loginPage, homePage }, testInfo) => {
    await allure.story('Intentional retry demo');

    console.log(`Demo retry attempt ${testInfo.retry + 1} started`);

    await loginPage.login(runtimeConfig.credentials.username, runtimeConfig.credentials.password);

    const title = await homePage.getTitle();
    expect(title).toContain('Welcome');

    if (testInfo.retry === 0) {
      const note = 'Intentional failure on the first attempt to generate screenshot, video, and retry trace artifacts.';
      console.log(note);
      await testInfo.attach('demo-rerun-note', {
        body: note,
        contentType: 'text/plain'
      });

      expect(testInfo.retry, note).toBeGreaterThan(0);
    }

    const whoAmI = await homePage.getTextWhoAmI();
    expect(whoAmI).toContain(runtimeConfig.credentials.username);
    console.log(`Demo retry attempt ${testInfo.retry + 1} passed`);
  });
});
