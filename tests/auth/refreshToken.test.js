require('dotenv').config()
const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../../testServer')
const UserModel = require('../../models/User')
const bcrypt = require('bcrypt')

describe('Auth: Refresh Token', () => {
  const testEmail = 'jest3Test@gmail.com'
  const testPassword = '123456'
  let refreshCookie

  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URL)

    await UserModel.deleteOne({ email: testEmail })

    const hashPassword = await bcrypt.hash(testPassword, 10)
    await UserModel.create({ email: testEmail, password: hashPassword })

    const loginRes = await request(app)
      .post('/auth/login')
      .send({ email: testEmail, password: testPassword })
      .expect(200)

    const cookies = loginRes.header['set-cookie']
    refreshCookie = cookies.find((c) => c.startsWith('refreshToken='))
  })

  afterAll(async () => {
    await UserModel.deleteOne({ email: testEmail })
    console.log('User was deleted')
    await mongoose.connection.close()
  })

  it('should refresh access token using refreshToken cookie', async () => {
    const res = await request(app)
      .post('/auth/refresh')
      .set('Cookie', refreshCookie)
      .expect(200)

    expect(res.body).toHaveProperty('accessToken')
    expect(res.body).toHaveProperty('refreshToken')
    expect(res.body.refreshToken).not.toBeNull()
  })
})
