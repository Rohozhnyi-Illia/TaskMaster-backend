require('dotenv').config()
const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../../testServer')
const UserModel = require('../../models/User')
const bcrypt = require('bcrypt')

describe('Auth: Login', () => {
  const testEmail = 'jest1Test@gmail.com'
  const testPassword = '123456'

  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URL)
    const hashPassword = await bcrypt.hash(testPassword, 10)
    await UserModel.create({ email: testEmail, password: hashPassword })
  })

  afterAll(async () => {
    await UserModel.deleteOne({ email: testEmail })
    console.log('User was deleted')
    await mongoose.connection.close()
  })

  it('should login an existing user and set refreshToken cookie', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: testEmail, password: testPassword })
      .expect(200)

    expect(res.body).toHaveProperty('id')
    expect(res.body).toHaveProperty('email', testEmail)
    expect(res.body).toHaveProperty('accessToken')

    const cookies = res.header['set-cookie']
    expect(cookies).toBeDefined()
    const refreshCookie = cookies.find((c) => c.startsWith('refreshToken='))
    expect(refreshCookie).toBeDefined()
    expect(refreshCookie).toMatch(/HttpOnly/)
  })
})
