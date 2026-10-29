// TestSentry main-repo regression fixtures: qadoctor.selenium-java.mixed-wait-strategies
//
// Self-contained TypeScript pseudo-fixtures representing the Java WebDriver
// wait-strategy mixing patterns (no selenium-java import). `driver`/`element`
// are `any` so they typecheck standalone.
//
// Intentional TestSentry smells. Do not convert to best-practice code.

declare const driver: any;
declare let element: any;

// -------- Positives --------

// EXPECTED FINDING: qadoctor.selenium-java.mixed-wait-strategies (non-zero implicitlyWait + WebDriverWait on same driver)
export function implicitPlusWebDriverWait(): void {
  driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(5));
  new WebDriverWait(driver, Duration.ofSeconds(10));
}

// EXPECTED FINDING: qadoctor.selenium-java.mixed-wait-strategies (non-zero implicitlyWait + FluentWait on same driver)
export function implicitPlusFluentWait(): void {
  driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(3));
  new FluentWait(driver).withTimeout(Duration.ofSeconds(10));
}

// EXPECTED FINDING: qadoctor.selenium-java.mixed-wait-strategies (setup implicit + test explicit on same driver)
export function setupImplicitPlusTestExplicit(): void {
  driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(4));
  element = driver.findElement(By.id('lazy-element'));
  new WebDriverWait(driver, Duration.ofSeconds(5)).until((ignored: any) =>
    element.isDisplayed(),
  );
}

// -------- Negatives --------

// EXPECTED NO FINDING: qadoctor.selenium-java.mixed-wait-strategies (implicit only)
export function implicitOnly(): void {
  driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(5));
  driver.findElement(By.id('x'));
}

// EXPECTED NO FINDING: qadoctor.selenium-java.mixed-wait-strategies (explicit only)
export function explicitOnly(): void {
  new WebDriverWait(driver, Duration.ofSeconds(10));
}

// EXPECTED NO FINDING: qadoctor.selenium-java.mixed-wait-strategies (zero reset before explicit)
export function zeroResetBeforeExplicit(): void {
  driver.manage().timeouts().implicitlyWait(Duration.ZERO);
  new WebDriverWait(driver, Duration.ofSeconds(10));
}

// EXPECTED NO FINDING: qadoctor.selenium-java.mixed-wait-strategies (different drivers)
export function differentDrivers(): void {
  const driverA: any = null;
  const driverB: any = null;
  driverA.manage().timeouts().implicitlyWait(Duration.ofSeconds(5));
  new WebDriverWait(driverB, Duration.ofSeconds(10));
}

declare const Duration: any;
declare const WebDriverWait: any;
declare const FluentWait: any;
declare const By: any;
