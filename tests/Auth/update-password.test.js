const request = require('supertest');
const app = require('../../app');
const createUser = require('../helpers/createUser');

describe('Update password flow', () => {
  it('Change password', async () => {
    await createUser();

    const res = await request(app).post('/api/auth/update-password').send({
      email: 'test@existingUser.com',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({
      message: 'The operation was successful',
    });
  });

  it('Changing the password of a non-existent user', async () => {
    const res = await request(app).post('/api/auth/update-password').send({
      email: 'test@existingUser.com',
    });

    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('User not found');
  });
});
