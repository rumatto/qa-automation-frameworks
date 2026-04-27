import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';

// Load environment variables from `.env.<TEST_ENV>` once per Node process.
// Mirrors the pattern used in `jetpay-playwright`.
if (!process.env.ENV_LOADED) {
  const testEnv = process.env.TEST_ENV || 'testing';
  const envFile = `.env.${testEnv}`;
  const envPath = path.resolve(process.cwd(), envFile);

  if (fs.existsSync(envPath)) {
    // eslint-disable-next-line no-console
    console.log(`Loading environment from: ${envPath}`);
    dotenv.config({ path: envPath });
  } else {
    // Keep local usage quiet since this demo framework can run without any `.env.*` file.
    // In CI (or when explicitly requested), warn to catch misconfiguration early.
    if (process.env.CI || process.env.ENV_STRICT === '1') {
      // eslint-disable-next-line no-console
      console.warn(`Warning: Environment file not found at ${envPath}`);
    }
  }

  // Avoid repeating logs across workers/imports.
  process.env.ENV_LOADED = 'true';
}

export class ENV {
  public static readonly BASE_URL = process.env.BASE_URL;

  /**
   * Optional validation. Keep this framework runnable without any `.env.*` file
   * (it can fall back to the local `app.html` file URL).
   */
  public static validate(): void {
    // Intentionally empty for now.
    // Add required vars here once you start depending on them.
  }
}
