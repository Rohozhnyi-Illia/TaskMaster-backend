const request = require('supertest');
const app = require('../../app');
const createUser = require('../helpers/createUser');
const TokenService = require('../../services/tokenService');

describe('Create task flow', () => {
  it('Create Task', async () => {
    const user = await createUser({ emailActivated: true });
    const tokens = TokenService.generateToken({ id: user._id });

    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${tokens.accessToken}`)
      .send({
        id: user._id,
        task: 'Test Task',
        status: 'Active',
        category: 'High',
        deadline: '2026-03-08T00:00:00.000Z',
        remainingTime: 48,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({
      task: 'Test Task',
      status: 'Active',
      category: 'High',
      deadline: '2026-03-08T00:00:00.000Z',
      remainingTime: 48,
      order: expect.any(Number),
    });
    expect(res.body.data._id).toBeDefined();
  });

  it('Creating a task with incomplete data', async () => {
    const user = await createUser({ emailActivated: true });
    const tokens = TokenService.generateToken({ id: user._id });
    await TokenService.saveToken(user._id, tokens.refreshToken);

    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${tokens.accessToken}`)
      .send({
        id: user._id,
        task: 'Test Task',
        category: 'High',
        deadline: '2026-03-08T00:00:00.000Z',
        remainingTime: 48,
      });

    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('Incomplete data');
  });
});
