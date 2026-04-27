export type DemoUser = {
  id: number;
  username: string;
  role: string;
  features: string[];
};

export type ContactRequest = {
  email?: string;
  message?: string;
};

export const DEMO_USER: DemoUser = {
  id: 101,
  username: 'demo',
  role: 'qa-engineer',
  features: ['ui', 'api', 'reporting']
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactRequest(payload: ContactRequest): { valid: boolean; error?: string } {
  const email = payload.email?.trim() ?? '';
  const message = payload.message?.trim() ?? '';

  if (!emailPattern.test(email)) {
    return { valid: false, error: 'A valid email is required.' };
  }

  if (message.length < 10) {
    return { valid: false, error: 'Message must be at least 10 characters long.' };
  }

  return { valid: true };
}
