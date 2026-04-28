import { ENV } from './env';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const localAppUrl = pathToFileURL(
  path.resolve(__dirname, '../../demo-services/test-app/app.html')
).toString();
export const resolvedAppUrl = ENV.BASE_URL || localAppUrl;
