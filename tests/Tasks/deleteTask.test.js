const request = require('supertest');
const app = require('../../app');
const createUser = require('../helpers/createUser');
const createTask = require('../helpers/createTask');
const TokenService = require('../../services/tokenService');

describe('Delete task flow', () => {
  it('Delete Task', async () => {
    const user = await createUser({ emailActivated: true });
    const tokens = TokenService.generateToken({ id: user._id });
    const task1 = await createTask({ user: user._id, task: 'Task 1', order: 0 });
    await createTask({ user: user._id, task: 'Task 2', order: 1 });

    const res = await request(app)
      .delete(`/api/tasks/${task1._id}`)
      .set('Authorization', `Bearer ${tokens.accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({
      task: 'Task 1',
      status: 'Active',
      category: 'High',
      deadline: '2026-03-08T00:00:00.000Z',
      remainingTime: 24,
      order: expect.any(Number),
    });
    expect(res.body.data._id).toBeDefined();

    const tasks = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${tokens.accessToken}`);

    expect(tasks.statusCode).toBe(200);
    expect(tasks.body.success).toBe(true);
    expect(tasks.body.data).toHaveLength(1);
  });
});
