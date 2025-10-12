const express = require('express')
const cookieParser = require('cookie-parser')

const authRoute = require('./routers/authRoute')
const notificationRoute = require('./routers/notificationRoute')
const taskRoute = require('./routers/taskRoute')

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use('/api/auth', authRoute)
app.use('/api/notification', notificationRoute)
app.use('/api/tasks', taskRoute)

module.exports = app
