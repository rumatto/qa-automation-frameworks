import type {Locator, Page} from '@playwright/test';

/**
 * base page with generic interaction helpers.
 * Keep the surface area small and add methods as the framework grows.
 */
export class BasePage {
    constructor(protected page: Page) {
    }

    async waitForVisible(locator: Locator, timeout = 5_000): Promise<void> {
        await locator.waitFor({state: 'visible', timeout});
    }

    async waitForInVisible(locator: Locator, timeout = 5_000): Promise<void> {
        await locator.waitFor({state: 'hidden', timeout});
    }

    async clickTestId(testId: string, timeout = 5_000): Promise<void> {
        await this.scrollAndClick(this.byTestId(testId), timeout);
    }

    async clickOn(testId: string): Promise<void> {
        await this.clickTestId(testId)
    }

    async typeByTestId(testId: string, value: string, timeout = 5_000): Promise<void> {
        const locator = this.byTestId(testId);
        await this.waitForVisible(locator, timeout);
        await locator.fill(value);
    }

    async typeInto(testId: string, value: string): Promise<void> {
        await this.typeByTestId(testId, value);
    }

    async getTestIdText(testId: string, timeout = 5_000): Promise<string> {
        const locator = this.byTestId(testId);
        await this.waitForVisible(locator, timeout);
        return (await locator.textContent())?.trim() ?? '';
    }

    async isTestIdVisible(testId: string, timeout = 0): Promise<boolean> {
        const locator = this.byTestId(testId).first();
        if (timeout > 0) {
            return locator.isVisible({timeout}).catch(() => false);
        }
        return locator.isVisible().catch(() => false);
    }

    async scrollAndClick(locator: Locator, timeout = 5_000): Promise<void> {
        await this.waitForVisible(locator, timeout);
        await locator.scrollIntoViewIfNeeded();
        await locator.click();
    }

    async delay(ms: number): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, ms));
    }

    /**
     * Useful for flaky cold starts (blank app, slow file:// load, etc).
     * If `locator` isn't visible quickly, reload `url` and wait again.
     */
    async navigateTo(locator: Locator, url: string, timeout = 1_000): Promise<void> {
        try {
            await this.waitForVisible(locator, timeout);
        } catch {
            await this.page.goto(url, {waitUntil: 'domcontentloaded'});
            await this.waitForVisible(locator);
        }
    }

    async navigateToHome(testId: string, url: string, timeout = 1_000): Promise<void> {
        await this.navigateTo(this.byTestId(testId), url, timeout);
    }

    protected byTestId(testId: string): Locator {
        return this.page.getByTestId(testId);
    }
}
