// TestSentry main-repo regression fixtures: qadoctor.selenium-java.shared-webdriver-lifecycle
//
// Self-contained TypeScript pseudo-fixtures representing the Java shared
// WebDriver lifecycle patterns (no selenium-java import).
//
// Intentional TestSentry smells. Do not convert to best-practice code.

declare const ChromeDriver: any;
declare const ChromeOptions: any;
declare const RemoteWebDriver: any;

// -------- Positives --------

// EXPECTED FINDING: qadoctor.selenium-java.shared-webdriver-lifecycle (static WebDriver field)
export let staticDriver: any;

// EXPECTED FINDING: qadoctor.selenium-java.shared-webdriver-lifecycle (static ChromeDriver field)
export let staticChromeDriver: any;

// EXPECTED FINDING: qadoctor.selenium-java.shared-webdriver-lifecycle (static RemoteWebDriver field)
export let staticRemoteDriver: any;

// EXPECTED FINDING: qadoctor.selenium-java.shared-webdriver-lifecycle (static driver assigned in setup lifecycle)
export function staticDriverAssignedInSetupLifecycle(): void {
  staticDriver = new ChromeDriver(new ChromeOptions());
}

// -------- Negatives --------

// EXPECTED NO FINDING: qadoctor.selenium-java.shared-webdriver-lifecycle (instance driver)
export function instanceDriver(): void {
  const driver: any = null;
}

// EXPECTED NO FINDING: qadoctor.selenium-java.shared-webdriver-lifecycle (local driver)
export function localDriver(): void {
  const local: any = null;
}

// EXPECTED NO FINDING: qadoctor.selenium-java.shared-webdriver-lifecycle (static non-driver field)
export const staticNotADriver: string = 'not-a-driver';

// EXPECTED NO FINDING: qadoctor.selenium-java.shared-webdriver-lifecycle (framework-managed / proxy placeholder)
export function frameworkManagedProxyPlaceholder(): void {
  // No framework-managed WebDriver proxy exists in this fixture set.
}
