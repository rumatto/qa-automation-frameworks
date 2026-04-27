import {type Page} from '@playwright/test';
import {BasePage} from './factory/BasePage';

export class HomePage extends BasePage {
    readonly welcome: string = 'welcome';
    readonly whoami: string = 'whoami';

    constructor(page: Page) {
        super(page);
    }

    async getTitle(): Promise<string> {
        return await this.getTestIdText(this.welcome);
    }


    async getTextWhoAmI(): Promise<string> {
        return await this.getTestIdText(this.whoami);
    }
}
