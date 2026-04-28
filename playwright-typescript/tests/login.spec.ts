import {expect, test} from '../utils/fixtures';
import {allure} from 'allure-playwright';
import {runtimeConfig} from '../utils/runtimeConfig';

test.describe('Login', () => {
    test('valid login', async ({loginPage, homePage}) => {
        await allure.story('Valid login');

        await loginPage.login(runtimeConfig.credentials.username, runtimeConfig.credentials.password);

        let title = await homePage.getTitle()
        expect(title).toContain('Welcome')
        let textWhoAmI = await homePage.getTextWhoAmI();
        expect(textWhoAmI).toContain(runtimeConfig.credentials.username)
    });

    test('invalid login shows error', async ({loginPage}) => {
        await allure.story('Invalid login');

        await loginPage.login('bad', 'creds');

        let error = await loginPage.getErrorMessage();
        expect(error).toContain('Invalid credentials')
    });
});
