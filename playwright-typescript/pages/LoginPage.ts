import {type Page} from '@playwright/test';
import {resolvedAppUrl} from '../utils/appUrl';
import {BasePage} from './factory/BasePage';

export class LoginPage extends BasePage {
    readonly username: string = 'username';
    readonly password: string = 'password';
    readonly error: string = 'login-error';
    readonly loginBtn: string = 'login-btn';

    constructor(page: Page) {
        super(page);
    }

    async login(user: string, pass: string) {
        await this.navigateToHome('username', resolvedAppUrl, 1_000);
        await this.typeInto(this.username, user);
        await this.typeInto(this.password, pass);
        await this.clickOn(this.loginBtn);
    }

    async getErrorMessage(): Promise<string> {
        return await this.getTestIdText(this.error);
    }
}
