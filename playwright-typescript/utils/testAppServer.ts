import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';

type StartedServer = {
  url: string;
  close: () => Promise<void>;
};

export async function startTestAppServer(): Promise<StartedServer> {
  const appPath = path.resolve(__dirname, '../../demo-services/test-app/app.html');
  const appHtml = await fs.readFile(appPath, 'utf8');

  const server = http.createServer((request, response) => {
    const url = new URL(request.url ?? '/', 'http://127.0.0.1');

    if (url.pathname !== '/app.html') {
      response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      response.end('Not found');
      return;
    }

    response.writeHead(200, {
      'content-type': 'text/html; charset=utf-8',
      'content-length': Buffer.byteLength(appHtml)
    });
    response.end(appHtml);
  });

  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      server.off('error', reject);
      resolve();
    });
  });

  const address = server.address();
  if (!address || typeof address === 'string') {
    throw new Error('Unable to determine app server address.');
  }

  return {
    url: `http://127.0.0.1:${address.port}/app.html`,
    close: async () => {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        });
      });
    }
  };
}
