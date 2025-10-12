require('dotenv').config()
const request = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const app = require('../../testServer')
const UserModel = require('../../models/User')
const NotificationModel = require('../../models/Notification')
const jwt = require('jsonwebtoken')

describe('Notifications API - Delete Notification', () => {
  let token
  let userId
  let notificationId

  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URL)
    const testEmail = 'jestDelete@test.com'
    const testPassword = '123456'
    const hashPassword = await bcrypt.hash(testPassword, 10)
    const user = await UserModel.create({ email: testEmail, password: hashPassword })
    userId = user._id
    token = jwt.sign({ id: user._id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '1h' })

    const notification = await NotificationModel.create({
      user: user._id,
      task: new mongoose.Types.ObjectId(),
      message: 'Test notification',
      type: 'reminder',
    })
    notificationId = notification._id
  })

  afterAll(async () => {
    await UserModel.deleteOne({ _id: userId })
    await NotificationModel.deleteMany({ user: userId })
    await mongoose.connection.close()
  })

  it('should delete notification', async () => {
    await request(app)
      .delete(`/api/notification/${notificationId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    const deleted = await NotificationModel.findById(notificationId)
    expect(deleted).toBeNull()
  })
})
