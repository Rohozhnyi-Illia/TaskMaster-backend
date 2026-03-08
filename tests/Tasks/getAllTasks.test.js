const request = require('supertest');
const app = require('../../app');
const createUser = require('../helpers/createUser');
const createTask = require('../helpers/createTask');
const TokenService = require('../../services/tokenService');

describe('Getting tasks flow', () => {
  it('Getting tasks', async () => {
    const user = await createUser({ emailActivated: true });
    const tokens = TokenService.generateToken({ id: user._id });
    await TokenService.saveToken(user._id, tokens.refreshToken);

    await createTask({ user: user._id, task: 'Task 1', order: 0 });
    await createTask({ user: user._id, task: 'Task 2', order: 1 });

    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${tokens.accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(2);
  });
});
