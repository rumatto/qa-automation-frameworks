import {expect, type Page} from '@playwright/test';
import {BasePage} from './factory/BasePage';

export class FormPage extends BasePage {
    readonly email: string = 'email';
    readonly message: string = 'message';
    readonly submit: string = 'submit-btn';
    readonly status: string = 'form-status';
    readonly view: string = 'view-form';

    constructor(page: Page) {
        super(page);
    }

    async submitForm(email: string, message: string) {
        await this.typeInto(this.email, email);
        await this.typeInto(this.message, message);
        await this.clickOn(this.submit);
    }

    async expectVisible(): Promise<void> {
        expect(await this.isTestIdVisible(this.view)).toBeTruthy();
        expect(await this.isTestIdVisible(this.email)).toBeTruthy();
        expect(await this.isTestIdVisible(this.message)).toBeTruthy();
    }

    async getStatusText(): Promise<string> {
        return await this.getTestIdText(this.status);
    }
}
