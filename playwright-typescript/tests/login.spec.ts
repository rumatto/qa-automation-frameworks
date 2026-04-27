import {expect, test} from '../utils/fixtures';
import {allure} from 'allure-playwright';
import {VALID_CREDENTIALS} from '../utils/testApp';

test.describe('Login', () => {
    test('valid login', async ({loginPage, homePage}) => {
        await allure.story('Valid login');

        await loginPage.login(VALID_CREDENTIALS.username, VALID_CREDENTIALS.password);

        let title = await homePage.getTitle()
        expect(title).toContain('Welcome')
        let textWhoAmI = await homePage.getTextWhoAmI();
        expect(textWhoAmI).toContain(VALID_CREDENTIALS.username)
    });

    test('invalid login shows error', async ({loginPage}) => {
        await allure.story('Invalid login');

        await loginPage.login('bad', 'creds');

        let error = await loginPage.getErrorMessage();
        expect(error).toContain('Invalid credentials')
    });
});
