const request = require('supertest');
const app = require('../../app');
const createUser = require('../createUser');
const createVerifyCode = require('../../helpers/createVerifyCode');

describe('Verification flow', () => {
  it('Email verification', async () => {
    const code = createVerifyCode();
    await createUser({
      emailActivationCode: code,
      emailActivationCodeLifetime: new Date(Date.now() + 15 * 60 * 1000),
    });

    const res = await request(app).post('/api/auth/verify-email').send({
      email: 'test@existingUser.com',
      verifyCode: code,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({
      id: expect.any(String),
      name: 'TestExistingUser',
      email: 'test@existingUser.com',
      accessToken: expect.any(String),
    });
  });

  it('verification of a non-existent user', async () => {
    const code = createVerifyCode();

    const res = await request(app).post('/api/auth/verify-email').send({
      email: 'test@existingUser.com',
      verifyCode: code,
    });

    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('User not found');
  });

  it('Invalid code', async () => {
    const code = createVerifyCode();
    await createUser({
      emailActivationCode: code,
      emailActivationCodeLifetime: new Date(Date.now() + 15 * 60 * 1000),
    });

    const res = await request(app).post('/api/auth/verify-email').send({
      email: 'test@existingUser.com',
      verifyCode: '123456',
    });

    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('Incorrect verification code');
  });

  it('Expired code', async () => {
    const code = createVerifyCode();
    await createUser({
      emailActivationCode: code,
      emailActivationCodeLifetime: new Date(Date.now()),
    });

    const res = await request(app).post('/api/auth/verify-email').send({
      email: 'test@existingUser.com',
      verifyCode: code,
    });

    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('The code is no longer valid');
  });
});
