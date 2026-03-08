const request = require('supertest');
const app = require('../../app');
const createUser = require('../helpers/createUser');

const TokenService = require('../../services/tokenService');

describe('Logout flow', () => {
  it('Logout', async () => {
    const user = await createUser({ emailActivated: true });

    const tokens = TokenService.generateToken({ id: user._id });
    await TokenService.saveToken(user._id, tokens.refreshToken);

    const res = await request(app)
      .post('/api/auth/logout')
      .set('Cookie', [`refreshToken=${tokens.refreshToken}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({
      message: 'Successfully logged out',
    });

    const storedToken = await TokenService.findToken(tokens.refreshToken);
    expect(storedToken).toBeNull();

    const cookieHeader = res.headers['set-cookie'][0];
    expect(cookieHeader).toContain('refreshToken=;');
  });

  it('Logout without refreshing cookies', async () => {
    const res = await request(app).post('/api/auth/logout').send();

    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('No token provided');
  });
});
