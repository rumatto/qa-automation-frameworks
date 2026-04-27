import { ENV } from './env';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const localAppUrl = pathToFileURL(path.resolve(__dirname, 'app.html')).toString();
export const resolvedAppUrl = ENV.BASE_URL || localAppUrl;
