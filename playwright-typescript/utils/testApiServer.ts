import http, { type IncomingMessage, type ServerResponse } from 'node:http';
import { DEMO_USER, type ContactRequest, validateContactRequest } from './testApi';

type StartedServer = {
  url: string;
  close: () => Promise<void>;
};

function readJsonBody(request: IncomingMessage): Promise<ContactRequest> {
  return new Promise((resolve, reject) => {
    let body = '';

    request.setEncoding('utf8');
    request.on('data', (chunk) => {
      body += chunk;
    });
    request.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body) as ContactRequest);
      } catch (error) {
        reject(error);
      }
    });
    request.on('error', reject);
  });
}

function writeJson(response: ServerResponse, statusCode: number, payload: unknown): void {
  const body = JSON.stringify(payload);
  response.writeHead(statusCode, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(body)
  });
  response.end(body);
}

export async function startTestApiServer(): Promise<StartedServer> {
  const server = http.createServer(async (request, response) => {
    const method = request.method ?? 'GET';
    const url = new URL(request.url ?? '/', 'http://127.0.0.1');

    if (method === 'GET' && url.pathname === '/api/health') {
      writeJson(response, 200, { status: 'ok' });
      return;
    }

    if (method === 'GET' && url.pathname === '/api/users/demo') {
      writeJson(response, 200, { user: DEMO_USER });
      return;
    }

    if (method === 'POST' && url.pathname === '/api/messages') {
      try {
        const payload = await readJsonBody(request);
        const validation = validateContactRequest(payload);

        if (!validation.valid) {
          writeJson(response, 400, {
            status: 'error',
            message: validation.error
          });
          return;
        }

        writeJson(response, 201, {
          status: 'accepted',
          messageId: 'msg-001',
          submittedAt: '2026-04-25T12:00:00Z',
          echo: {
            email: payload.email?.trim(),
            message: payload.message?.trim()
          }
        });
      } catch {
        writeJson(response, 400, {
          status: 'error',
          message: 'Request body must be valid JSON.'
        });
      }
      return;
    }

    writeJson(response, 404, {
      status: 'error',
      message: 'Not found'
    });
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
    throw new Error('Unable to determine API server address.');
  }

  return {
    url: `http://127.0.0.1:${address.port}`,
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
