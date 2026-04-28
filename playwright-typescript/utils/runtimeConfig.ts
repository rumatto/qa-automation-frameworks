import { ENV } from './env';
import { VALID_CREDENTIALS, type Credentials } from './testApp';

export type RuntimeConfig = {
  testEnv: string;
  environmentName: string;
  baseUrl?: string;
  apiBaseUrl?: string;
  credentials: Credentials;
};

const testEnv = process.env.TEST_ENV || 'testing';

function readCredentials(): Credentials {
  return {
    username: process.env.APP_USERNAME || VALID_CREDENTIALS.username,
    password: process.env.APP_PASSWORD || VALID_CREDENTIALS.password
  };
}

export const runtimeConfig: RuntimeConfig = {
  testEnv,
  environmentName: process.env.APP_ENV_NAME || testEnv,
  baseUrl: ENV.BASE_URL,
  apiBaseUrl: process.env.API_BASE_URL,
  credentials: readCredentials()
};
