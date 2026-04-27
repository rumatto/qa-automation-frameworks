import {type Page} from '@playwright/test';
import {BasePage} from './factory/BasePage';

export class AppShellPage extends BasePage {
    // readonly title: Locator;
    // readonly navHome: Locator;
    // readonly navSettings: Locator;
    // readonly navForm: Locator;
    // readonly logoutButton: Locator;


    readonly title = 'app-title';
    readonly navHome = 'nav-home';
    readonly navSettings = 'nav-settings';
    readonly navForm = 'nav-form';
    readonly logoutButton = 'logout-btn';

    constructor(page: Page) {
        super(page);
        // this.title = this.byTestId('app-title');
        // this.navHome = this.byTestId('nav-home');
        // this.navSettings = this.byTestId('nav-settings');
        // this.navForm = this.byTestId('nav-form');
        // this.logoutButton = this.byTestId('logout-btn');
    }


    // async gotoHome() {
    //   await this.clickTestId('nav-home');
    // }

    async gotoSettings() {
        await this.clickOn(this.navSettings);
    }

    async gotoForm() {
        await this.clickOn(this.navForm);
    }

    async logout() {
        await this.clickOn(this.logoutButton);
    }

    // async expectVisible(): Promise<void> {
    //   await expect(this.title).toBeVisible();
    // }
}
