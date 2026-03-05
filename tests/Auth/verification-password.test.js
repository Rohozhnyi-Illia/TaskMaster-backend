const request = require('supertest');
const app = require('../../app');
const createUser = require('../createUser');
const createVerifyCode = require('../../helpers/createVerifyCode');

describe('Verification password flow', () => {
  it('Verification pasword', async () => {
    const code = createVerifyCode();

    await createUser({
      emailActivated: true,
      passwordResetCode: code,
      passwordResetCodeLifetime: new Date(Date.now() + 15 * 60 * 1000),
    });

    const res = await request(app).post('/api/auth/verify-password').send({
      email: 'test@existingUser.com',
      verifyCode: code,
      newPassword: '654321',
      repeatPassword: '654321',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({ message: 'Password successfully changed' });
  });

  it('Verification of a password for a non-existent user', async () => {
    const code = createVerifyCode();

    const res = await request(app).post('/api/auth/verify-password').send({
      email: 'test@existingUser.com',
      verifyCode: code,
      newPassword: '654321',
      repeatPassword: '654321',
    });

    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('User not found');
  });

  it('New password not repeated', async () => {
    const code = createVerifyCode();

    await createUser({
      emailActivated: true,
      passwordResetCode: code,
      passwordResetCodeLifetime: new Date(Date.now() + 15 * 60 * 1000),
    });

    const res = await request(app).post('/api/auth/verify-password').send({
      email: 'test@existingUser.com',
      verifyCode: code,
      newPassword: '654321',
      repeatPassword: '653421',
    });

    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('Passwords do not match');
  });

  it('Change password to current', async () => {
    const code = createVerifyCode();

    await createUser({
      emailActivated: true,
      passwordResetCode: code,
      passwordResetCodeLifetime: new Date(Date.now() + 15 * 60 * 1000),
    });

    const res = await request(app).post('/api/auth/verify-password').send({
      email: 'test@existingUser.com',
      verifyCode: code,
      newPassword: '123456',
      repeatPassword: '123456',
    });

    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('This password is already in use');
  });

  it('Changing your password with an incorrect code', async () => {
    const code = createVerifyCode();

    await createUser({
      emailActivated: true,
      passwordResetCode: code,
      passwordResetCodeLifetime: new Date(Date.now() + 15 * 60 * 1000),
    });

    const res = await request(app).post('/api/auth/verify-password').send({
      email: 'test@existingUser.com',
      verifyCode: '123456',
      newPassword: '654321',
      repeatPassword: '654321',
    });

    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('Incorrect verification code');
  });

  it('Changing a password with an expired code', async () => {
    const code = createVerifyCode();

    await createUser({
      emailActivated: true,
      passwordResetCode: code,
      passwordResetCodeLifetime: new Date(),
    });

    const res = await request(app).post('/api/auth/verify-password').send({
      email: 'test@existingUser.com',
      verifyCode: code,
      newPassword: '654321',
      repeatPassword: '654321',
    });

    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('The code is no longer valid');
  });
});
