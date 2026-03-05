const request = require('supertest');
const app = require('../../app');
const createUser = require('../createUser');
const createVerifyCode = require('../../helpers/createVerifyCode');

describe('Re-verification flow', () => {
  it('Email re-verification', async () => {
    const code = createVerifyCode();
    await createUser({
      emailActivated: false,
      emailActivationCode: code,
      emailActivationCodeLifetime: new Date(Date.now() + 15 * 60 * 1000),
    });

    const res = await request(app).post('/api/auth/re-verify-email').send({
      email: 'test@existingUser.com',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({
      emailActivated: expect.any(Boolean),
    });
  });

  it('Re-verification of a non-existent user', async () => {
    const res = await request(app).post('/api/auth/re-verify-email').send({
      email: 'test@existingUser.com',
    });

    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('User not found');
  });

  it('Re-verification of an activated account', async () => {
    const code = createVerifyCode();
    await createUser({
      emailActivated: true,
      emailActivationCode: code,
      emailActivationCodeLifetime: new Date(Date.now() + 15 * 60 * 1000),
    });

    const res = await request(app).post('/api/auth/re-verify-email').send({
      email: 'test@existingUser.com',
    });

    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('Account already activated');
  });
});
