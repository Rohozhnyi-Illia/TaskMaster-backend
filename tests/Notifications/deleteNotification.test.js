const request = require('supertest');
const app = require('../../app');
const createUser = require('../helpers/createUser');
const createTask = require('../helpers/createTask');
const TokenService = require('../../services/tokenService');
const NotificationService = require('../../services/notificationService');
describe('Delete notifications flow', () => {
  it('Deleting a single notification', async () => {
    const user = await createUser({ emailActivated: true });
    const tokens = TokenService.generateToken({ id: user._id });

    const now = new Date();

    const deadlineWeek = new Date(now);
    deadlineWeek.setDate(now.getDate() + 7);

    const deadlinePast = new Date(now);
    deadlinePast.setDate(now.getDate() - 1);

    const deadlineReminder = new Date(now);
    deadlineReminder.setHours(now.getHours() + 5);

    await createTask({
      user: user._id,
      task: 'Warning task',
      deadline: deadlineWeek,
      remainingTime: 24,
    });

    await createTask({
      user: user._id,
      task: 'Overdue task',
      deadline: deadlinePast,
      remainingTime: 48,
    });

    await createTask({
      user: user._id,
      task: 'Reminder task',
      deadline: deadlineReminder,
      remainingTime: 24,
    });

    await NotificationService.checkDeadlines();

    let res = await request(app)
      .get('/api/notification')
      .set('Authorization', `Bearer ${tokens.accessToken}`);

    expect(res.statusCode).toBe(200);
    const initialCount = res.body.data.length;

    const notificationToDelete = res.body.data[0];
    const deleteRes = await request(app)
      .delete(`/api/notification/${notificationToDelete._id}`)
      .set('Authorization', `Bearer ${tokens.accessToken}`);

    expect(deleteRes.statusCode).toBe(200);
    expect(deleteRes.body.success).toBe(true);

    await NotificationService.checkDeadlines();

    res = await request(app)
      .get('/api/notification')
      .set('Authorization', `Bearer ${tokens.accessToken}`);

    expect(res.body.data.length).toBe(initialCount - 1);
  });

  it('Delete all read notifications', async () => {
    const user = await createUser({ emailActivated: true });
    const tokens = TokenService.generateToken({ id: user._id });

    const now = new Date();

    const deadlineWeek = new Date(now);
    deadlineWeek.setDate(now.getDate() + 7);

    const deadlinePast = new Date(now);
    deadlinePast.setDate(now.getDate() - 1);

    const deadlineReminder = new Date(now);
    deadlineReminder.setHours(now.getHours() + 5);

    await createTask({
      user: user._id,
      task: 'Warning task',
      deadline: deadlineWeek,
      remainingTime: 24,
    });

    await createTask({
      user: user._id,
      task: 'Overdue task',
      deadline: deadlinePast,
      remainingTime: 48,
    });

    await createTask({
      user: user._id,
      task: 'Reminder task',
      deadline: deadlineReminder,
      remainingTime: 24,
    });

    await NotificationService.checkDeadlines();

    let notifications = await request(app)
      .get('/api/notification')
      .set('Authorization', `Bearer ${tokens.accessToken}`);
    expect(notifications.statusCode).toBe(200);
    expect(notifications.body.success).toBe(true);

    const notificationsList = notifications.body.data;

    const firstId = notificationsList[0]._id;
    const secondId = notificationsList[1]._id;

    const res = await request(app)
      .patch(`/api/notification/${firstId}/read`)
      .set('Authorization', `Bearer ${tokens.accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    const res2 = await request(app)
      .patch(`/api/notification/${secondId}/read`)
      .set('Authorization', `Bearer ${tokens.accessToken}`);

    expect(res2.statusCode).toBe(200);
    expect(res2.body.success).toBe(true);

    const res3 = await request(app)
      .patch('/api/notification/readAll')
      .set('Authorization', `Bearer ${tokens.accessToken}`);

    expect(res3.statusCode).toBe(200);
    expect(res3.body.success).toBe(true);
    expect(res3.body.data.deletedCount).toBe(2);

    const afterDelete = await request(app)
      .get('/api/notification')
      .set('Authorization', `Bearer ${tokens.accessToken}`);

    expect(afterDelete.body.data.length).toBe(notificationsList.length - 2);
  });

  it('Delete all notifications', async () => {
    const user = await createUser({ emailActivated: true });
    const tokens = TokenService.generateToken({ id: user._id });

    const now = new Date();

    const deadlineWeek = new Date(now);
    deadlineWeek.setDate(now.getDate() + 7);

    const deadlinePast = new Date(now);
    deadlinePast.setDate(now.getDate() - 1);

    const deadlineReminder = new Date(now);
    deadlineReminder.setHours(now.getHours() + 5);

    await createTask({
      user: user._id,
      task: 'Warning task',
      deadline: deadlineWeek,
      remainingTime: 24,
    });

    await createTask({
      user: user._id,
      task: 'Overdue task',
      deadline: deadlinePast,
      remainingTime: 48,
    });

    await createTask({
      user: user._id,
      task: 'Reminder task',
      deadline: deadlineReminder,
      remainingTime: 24,
    });

    await NotificationService.checkDeadlines();

    const notifications = await request(app)
      .get('/api/notification')
      .set('Authorization', `Bearer ${tokens.accessToken}`);

    expect(notifications.statusCode).toBe(200);
    expect(notifications.body.success).toBe(true);

    const notificationsList = notifications.body.data;

    const afterDelete = await request(app)
      .patch('/api/notification/deleteAll')
      .set('Authorization', `Bearer ${tokens.accessToken}`);

    expect(afterDelete.statusCode).toBe(200);
    expect(afterDelete.body.success).toBe(true);
    expect(afterDelete.body.data.deletedCount).toBe(notificationsList.length);

    const notificationsAfter = await request(app)
      .get('/api/notification')
      .set('Authorization', `Bearer ${tokens.accessToken}`);

    expect(notificationsAfter.body.data).toHaveLength(0);
  });
});
