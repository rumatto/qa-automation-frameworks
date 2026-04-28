import {test} from '../utils/fixtures';
import {allure} from 'allure-playwright';
import {expect} from "@playwright/test";
import {runtimeConfig} from '../utils/runtimeConfig';

test.describe('Form submission', () => {
    test('submit form successfully', async ({loginPage, appShell, formPage}) => {
        await allure.story('Valid submission');

        await loginPage.login(runtimeConfig.credentials.username, runtimeConfig.credentials.password);
        await appShell.gotoForm();

        await formPage.submitForm('qa@example.com', 'Hello from Playwright!');
        let status = await formPage.getStatusText();
        expect(status).toBe('Submitted successfully.');

    });

    test('invalid form shows validation error', async ({loginPage, appShell, formPage}) => {
        await allure.feature('Forms');

        await loginPage.login(runtimeConfig.credentials.username, runtimeConfig.credentials.password);
        await appShell.gotoForm();

        await formPage.submitForm('not-an-email', 'x');
        let status = await formPage.getStatusText();
        expect(status).toBe('Please enter a valid email and message.');
    });
});
