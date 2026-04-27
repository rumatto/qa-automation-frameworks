import {type Page} from '@playwright/test';
import {BasePage} from './factory/BasePage';

export class SettingsPage extends BasePage {
    readonly settingsText: string = 'settings-text';
    readonly view: string = 'view-settings';

    constructor(page: Page) {
        super(page);
    }

    async getSettingsText(): Promise<string> {
        return await this.getTestIdText(this.settingsText);
    }
}
