const request = require('supertest');
const app = require('../../app');
const createUser = require('../helpers/createUser');

describe('Register flow', () => {
  it('New user registration', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: '123456',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({
      id: expect.any(String),
      name: 'Test User',
      email: 'test@example.com',
    });
    expect(res.body.data.id).toBeDefined();
  });

  it('Incomplete registration data', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      password: '123456',
    });

    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('Incomplete data');
  });

  it('Existing user registration', async () => {
    await createUser();

    const res = await request(app).post('/api/auth/register').send({
      name: 'TestExistingUser',
      email: 'test@existingUser.com',
      password: '123456',
    });

    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('User already exists');
  });
});
