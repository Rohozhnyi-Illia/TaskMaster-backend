const request = require('supertest');
const app = require('../../app');
const createUser = require('../helpers/createUser');

describe('Login flow', () => {
  it('User logging', async () => {
    await createUser({ emailActivated: true });

    const res = await request(app).post('/api/auth/login').send({
      email: 'test@existingUser.com',
      password: '123456',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({
      id: expect.any(String),
      email: 'test@existingUser.com',
      accessToken: expect.any(String),
      name: 'TestExistingUser',
      emailActivated: true,
    });
  });

  it('Logging in as a non-existent user', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@existingUser.com',
      password: '123456',
    });

    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('User not found');
  });

  it('Logging with incomplete data', async () => {
    await createUser({ emailActivated: true });

    const res = await request(app).post('/api/auth/login').send({
      email: 'test@existingUser.com',
    });

    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('Incomplete data');
  });

  it('Logging in with an inactive account', async () => {
    await createUser({ emailActivated: false });

    const res = await request(app).post('/api/auth/login').send({
      email: 'test@existingUser.com',
      password: '123456',
    });

    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('Email not activated');
  });

  it('Logging in with an incorrect password', async () => {
    await createUser({ emailActivated: true });

    const res = await request(app).post('/api/auth/login').send({
      email: 'test@existingUser.com',
      password: '1234567',
    });

    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('Incorrect password');
  });
});
