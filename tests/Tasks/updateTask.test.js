const request = require('supertest');
const app = require('../../app');
const createUser = require('../helpers/createUser');
const createTask = require('../helpers/createTask');
const TokenService = require('../../services/tokenService');

describe('Update task flow', () => {
  it('Status update', async () => {
    const user = await createUser({ emailActivated: true });
    const tokens = TokenService.generateToken({ id: user._id });
    const task = await createTask({ user: user._id, task: 'Task 1', order: 0 });

    const res = await request(app)
      .patch(`/api/tasks/${task._id}/status`)
      .set('Authorization', `Bearer ${tokens.accessToken}`)
      .send({ status: 'InProgress' });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({
      task: 'Task 1',
      status: 'InProgress',
      category: 'High',
      deadline: '2026-03-08T00:00:00.000Z',
      remainingTime: 24,
      order: expect.any(Number),
    });
  });

  it('Status update with unresolved status', async () => {
    const user = await createUser({ emailActivated: true });
    const tokens = TokenService.generateToken({ id: user._id });
    const task = await createTask({ user: user._id, task: 'Task 1', order: 0 });

    const res = await request(app)
      .patch(`/api/tasks/${task._id}/status`)
      .set('Authorization', `Bearer ${tokens.accessToken}`)
      .send({ status: 'Blocked' });

    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('Invalid status');
  });

  it('Task not found during status update', async () => {
    const user = await createUser({ emailActivated: true });
    const tokens = TokenService.generateToken({ id: user._id });
    await createTask({ user: user._id, task: 'Task 1', order: 0 });
    const fakeTaskId = '64b1f5b9d0f5c100f0a12345';

    const res = await request(app)
      .patch(`/api/tasks/${fakeTaskId}/status`)
      .set('Authorization', `Bearer ${tokens.accessToken}`)
      .send({ status: 'Done' });

    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('Task not found or does not belong to the user');
  });

  it('Category update', async () => {
    const user = await createUser({ emailActivated: true });
    const tokens = TokenService.generateToken({ id: user._id });
    const task = await createTask({ user: user._id, task: 'Task 1', order: 0 });

    const res = await request(app)
      .patch(`/api/tasks/${task._id}/category`)
      .set('Authorization', `Bearer ${tokens.accessToken}`)
      .send({ category: 'Critical' });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({
      task: 'Task 1',
      status: 'Active',
      category: 'Critical',
      deadline: '2026-03-08T00:00:00.000Z',
      remainingTime: 24,
      order: expect.any(Number),
    });
  });

  it('Category update with unresolved status', async () => {
    const user = await createUser({ emailActivated: true });
    const tokens = TokenService.generateToken({ id: user._id });
    const task = await createTask({ user: user._id, task: 'Task 1', order: 0 });

    const res = await request(app)
      .patch(`/api/tasks/${task._id}/category`)
      .set('Authorization', `Bearer ${tokens.accessToken}`)
      .send({ category: 'Epic' });

    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('Invalid category');
  });

  it('Task not found during category update', async () => {
    const user = await createUser({ emailActivated: true });
    const tokens = TokenService.generateToken({ id: user._id });
    await createTask({ user: user._id, task: 'Task 1', order: 0 });
    const fakeTaskId = '64b1f5b9d0f5c100f0a12345';

    const res = await request(app)
      .patch(`/api/tasks/${fakeTaskId}/category`)
      .set('Authorization', `Bearer ${tokens.accessToken}`)
      .send({ category: 'High' });

    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('Task not found or does not belong to the user');
  });
});
