import { ENV } from './env';

async function globalSetup() {
  // Load + optionally validate env early.
  ENV.validate();
}

export default globalSetup;

