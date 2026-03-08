const request = require('supertest');
const app = require('../../app');
const createUser = require('../helpers/createUser');
const TokenService = require('../../services/tokenService');
const jwt = require('jsonwebtoken');
const UserModel = require('../../models/User');

describe('Auth middleware flow', () => {
  it('Request with a valid token', async () => {
    const user = await createUser({ emailActivated: true });
    const tokens = TokenService.generateToken({ id: user._id });

    const res = await request(app)
      .get('/api/tasks/')
      .set('Authorization', `Bearer ${tokens.accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('Request without header', async () => {
    await createUser({ emailActivated: true });
    const res = await request(app).get('/api/tasks/');

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toContain('Authorization header missing');
  });

  it('Request without a token', async () => {
    await createUser({ emailActivated: true });

    const res = await request(app).get('/api/tasks/').set('Authorization', 'Bearer');

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toContain('Token missing');
  });

  it('Request with expired token', async () => {
    const user = await createUser({ emailActivated: true });
    const expiredToken = jwt.sign({ id: user._id }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: -10,
    });
    const res = await request(app)
      .get('/api/tasks/')
      .set('Authorization', `Bearer ${expiredToken}`);

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toContain('Token expired');
  });

  it('Request with invalid token', async () => {
    const res = await request(app)
      .get('/api/tasks/')
      .set('Authorization', 'Bearer invalid.jwt.token');

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toContain('Invalid token');
  });

  it('Request when user no longer exists', async () => {
    const user = await createUser({ emailActivated: true });
    const tokens = TokenService.generateToken({ id: user._id });

    await UserModel.findByIdAndDelete(user._id);

    const res = await request(app)
      .get('/api/tasks/')
      .set('Authorization', `Bearer ${tokens.accessToken}`);

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toContain('User not found');
  });
});
