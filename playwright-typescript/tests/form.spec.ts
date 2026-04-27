import {test} from '../utils/fixtures';
import {allure} from 'allure-playwright';
import {VALID_CREDENTIALS} from '../utils/testApp';
import {expect} from "@playwright/test";

test.describe('Form submission', () => {
    test('submit form successfully', async ({loginPage, appShell, formPage}) => {
        await allure.story('Valid submission');

        await loginPage.login(VALID_CREDENTIALS.username, VALID_CREDENTIALS.password);
        await appShell.gotoForm();

        await formPage.submitForm('qa@example.com', 'Hello from Playwright!');
        let status = await formPage.getStatusText();
        expect(status).toBe('Submitted successfully.');

    });

    test('invalid form shows validation error', async ({loginPage, appShell, formPage}) => {
        await allure.feature('Forms');

        await loginPage.login(VALID_CREDENTIALS.username, VALID_CREDENTIALS.password);
        await appShell.gotoForm();

        await formPage.submitForm('not-an-email', 'x');
        let status = await formPage.getStatusText();
        expect(status).toBe('Please enter a valid email and message.');
    });
});
