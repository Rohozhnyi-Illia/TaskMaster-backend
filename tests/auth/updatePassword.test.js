require('dotenv').config()
const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../../testServer')
const UserModel = require('../../models/User')
const bcrypt = require('bcrypt')

describe('Auth: Password Update', () => {
  const testEmail = 'jest2Test@gmail.com'
  const oldPassword = '123456'
  const newPassword = '654321'

  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URL)
    await UserModel.deleteOne({ email: testEmail })
    const hashPassword = await bcrypt.hash(oldPassword, 10)
    await UserModel.create({ email: testEmail, password: hashPassword })
  })

  afterAll(async () => {
    await UserModel.deleteOne({ email: testEmail })
    console.log('User was deleted')
    await mongoose.connection.close()
  })

  it('should update the password when newPassword and repeatPassword match', async () => {
    const res = await request(app)
      .post('/api/auth/update-password')
      .send({
        email: testEmail,
        newPassword: newPassword,
        repeatPassword: newPassword,
      })
      .expect(200)

    expect(res.body).toHaveProperty('message', 'Password updated successfully')
  })

  it('should return 500 when newPassword and repeatPassword do not match', async () => {
    await request(app)
      .post('/api/auth/update-password')
      .send({
        email: testEmail,
        newPassword: newPassword,
        repeatPassword: 'differentPassword',
      })
      .expect(500)
  })
})
