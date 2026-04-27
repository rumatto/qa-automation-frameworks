import {expect, test} from '../utils/fixtures';
import {allure} from 'allure-playwright';
import {VALID_CREDENTIALS} from '../utils/testApp';

test.describe('Navigation and assertions', () => {
    test('navigate between sections', async ({loginPage, appShell, settingsPage, formPage, homePage, page}) => {
        test.setTimeout(120_000);
        await allure.story('Primary navigation');

        await loginPage.login(VALID_CREDENTIALS.username, VALID_CREDENTIALS.password);

            await appShell.gotoSettings();
            //   await settingsPage.expectVisible();
            let text = await settingsPage.getSettingsText();
            expect(text).toContain('Preferences live here.')

            await appShell.gotoForm();
            await formPage.expectVisible();

    });
});
