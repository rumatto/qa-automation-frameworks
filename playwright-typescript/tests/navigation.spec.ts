import {expect, test} from '../utils/fixtures';
import {allure} from 'allure-playwright';
import {runtimeConfig} from '../utils/runtimeConfig';

test.describe('Navigation and assertions', () => {
    test('navigate between sections', async ({loginPage, appShell, settingsPage, formPage, homePage, page}) => {
        test.setTimeout(120_000);
        await allure.story('Primary navigation');

        await loginPage.login(runtimeConfig.credentials.username, runtimeConfig.credentials.password);

            await appShell.gotoSettings();
            //   await settingsPage.expectVisible();
            let text = await settingsPage.getSettingsText();
            expect(text).toContain('Preferences live here.')

            await appShell.gotoForm();
            await formPage.expectVisible();

    });
});
