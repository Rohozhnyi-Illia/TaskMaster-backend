require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const initDeadlineChecker = require('./crons/checkDeadlines')
const authRoute = require('./routers/authRoute')
const notificationRoute = require('./routers/notificationRoute')
const taskRoute = require('./routers/taskRoute')

const app = express()
const PORT = process.env.PORT
const allowedOrigins = ['https://prod-domen.com', 'http://localhost:3000']

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true)

      if (allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by cors'))
      }
    },

    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)
app.use(express.json())
app.use(cookieParser())
app.use('/api/auth', authRoute)
app.use('/api/notification', notificationRoute)
app.use('/api/tasks', taskRoute)

const startServer = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      dbName: 'TaskMaster',
    })
    console.log('✅ MongoDB connected successfully')
    app.listen(PORT, () => {
      console.log(`Server was started on port: ${PORT}`)
    })
    initDeadlineChecker()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
}

startServer()
