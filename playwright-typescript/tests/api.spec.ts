import { apiTest as test, expect } from '../utils/fixtures';
import { allure } from 'allure-playwright';
import { expectSchemaMatch } from '../utils/contracts';

test.describe('API automation', () => {
  test('fetch demo user profile', async ({ apiRequest }) => {
    await allure.feature('API');
    await allure.story('Get user profile');

    const response = await apiRequest.get('/api/users/demo');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expectSchemaMatch('user-profile.schema.json', body);
    expect(body.user).toMatchObject({
      id: 101,
      username: 'demo',
      role: 'qa-engineer'
    });
    expect(body.user.features).toContain('api');
  });

  test('submit contact payload successfully', async ({ apiRequest }) => {
    await allure.feature('API');
    await allure.story('Create contact message');

    const response = await apiRequest.post('/api/messages', {
      data: {
        email: 'qa@example.com',
        message: 'API automation example from Playwright.'
      }
    });

    expect(response.status()).toBe(201);

    const body = await response.json();
    expectSchemaMatch('message-accepted.schema.json', body);
    expect(body).toMatchObject({
      status: 'accepted',
      messageId: 'msg-001',
      echo: {
        email: 'qa@example.com',
        message: 'API automation example from Playwright.'
      }
    });
  });

  test('reject invalid contact payload', async ({ apiRequest }) => {
    await allure.feature('API');
    await allure.story('Validate contact payload');

    const response = await apiRequest.post('/api/messages', {
      data: {
        email: 'bad-email',
        message: 'short'
      }
    });

    expect(response.status()).toBe(400);

    const body = await response.json();
    expectSchemaMatch('error-response.schema.json', body);
    expect(body).toEqual({
      status: 'error',
      message: 'A valid email is required.'
    });
  });
});
