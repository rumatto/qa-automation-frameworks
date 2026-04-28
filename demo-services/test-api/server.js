const http = require('node:http');

const DEMO_USER = {
  id: 101,
  username: 'demo',
  role: 'qa-engineer',
  features: ['ui', 'api', 'reporting']
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateContactRequest(payload) {
  const email = typeof payload.email === 'string' ? payload.email.trim() : '';
  const message = typeof payload.message === 'string' ? payload.message.trim() : '';

  if (!emailPattern.test(email)) {
    return { valid: false, error: 'A valid email is required.' };
  }

  if (message.length < 10) {
    return { valid: false, error: 'Message must be at least 10 characters long.' };
  }

  return { valid: true };
}

function readJsonBody(request) {
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
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
    request.on('error', reject);
  });
}

function writeJson(response, statusCode, payload) {
  const body = JSON.stringify(payload);
  response.writeHead(statusCode, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(body)
  });
  response.end(body);
}

const server = http.createServer(async (request, response) => {
  const method = request.method || 'GET';
  const url = new URL(request.url || '/', 'http://127.0.0.1');

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
          email: payload.email.trim(),
          message: payload.message.trim()
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

const port = Number.parseInt(process.env.PORT || '8080', 10);
server.listen(port, '0.0.0.0');
