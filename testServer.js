const express = require('express')
const authRouter = require('./routers/authRoute')
const cookieParser = require('cookie-parser')
const notificationRoute = require('./routers/notificationRoute')

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use('/auth', authRouter)
app.use('/api/notification', notificationRoute)

module.exports = app
