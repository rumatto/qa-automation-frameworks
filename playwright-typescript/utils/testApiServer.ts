import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import net from 'node:net';
import path from 'node:path';

type StartedServer = {
  url: string;
  close: () => Promise<void>;
};

async function waitForHealthcheck(url: string): Promise<void> {
  let lastError: unknown;

  for (let attempt = 0; attempt < 20; attempt += 1) {
    try {
      const response = await fetch(`${url}/api/health`);
      if (response.ok) {
        return;
      }
      lastError = new Error(`Healthcheck returned ${response.status}.`);
    } catch (error) {
      lastError = error;
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw lastError instanceof Error ? lastError : new Error('Shared test API did not start.');
}

function stopProcess(child: ChildProcessWithoutNullStreams): Promise<void> {
  return new Promise((resolve) => {
    if (child.exitCode !== null || child.signalCode !== null) {
      resolve();
      return;
    }

    child.once('exit', () => resolve());
    child.kill();
  });
}

function findOpenPort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = net.createServer();

    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      if (!address || typeof address === 'string') {
        server.close(() => reject(new Error('Unable to determine open port.')));
        return;
      }

      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(address.port);
      });
    });
  });
}

export async function startTestApiServer(): Promise<StartedServer> {
  const port = await findOpenPort();
  const scriptPath = path.resolve(__dirname, '../../demo-services/test-api/server.js');
  const child = spawn('node', [scriptPath], {
    env: {
      ...process.env,
      PORT: String(port)
    },
    stdio: 'pipe'
  });

  const stderr: string[] = [];
  child.stderr.on('data', (chunk) => {
    stderr.push(chunk.toString('utf8'));
  });

  const url = `http://127.0.0.1:${port}`;
  try {
    await waitForHealthcheck(url);
  } catch (error) {
    await stopProcess(child);
    const stderrText = stderr.join('').trim();
    const detail = stderrText ? `\n${stderrText}` : '';
    throw new Error(`Unable to start shared test API.${detail}`, { cause: error });
  }

  return {
    url,
    close: async () => {
      await stopProcess(child);
    }
  };
}
