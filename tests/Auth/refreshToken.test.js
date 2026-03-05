const request = require('supertest');
const app = require('../../app');
const createUser = require('../createUser');
const TokenService = require('../../services/tokenService');
const TokenModel = require('../../models/Token');

describe('Refresh Token flow', () => {
  it('Token update', async () => {
    const user = await createUser({ emailActivated: true });

    const tokens = TokenService.generateToken({ id: user._id });
    await TokenService.saveToken(user._id, tokens.refreshToken);

    const res = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', [`refreshToken=${tokens.refreshToken}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(expect.any(String));

    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();

    const refreshCookie = cookies.find((c) => c.startsWith('refreshToken='));
    expect(refreshCookie).toBeDefined();

    const newRefreshToken = refreshCookie.split(';')[0].split('=')[1];

    expect(newRefreshToken).not.toBe(tokens.refreshToken);

    const tokenInDb = await TokenModel.findOne({
      refreshToken: newRefreshToken,
    });

    expect(tokenInDb).toBeTruthy();
    expect(tokenInDb.user.toString()).toBe(user._id.toString());
  });

  it('Token update without refresh token', async () => {
    const res = await request(app).post('/api/auth/refresh');

    expect(res.statusCode).toBeGreaterThanOrEqual(400);
    expect(res.body.success).toBe(false);
  });
});
