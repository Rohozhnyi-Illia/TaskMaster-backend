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
const allowedOrigins = [
  'http://localhost:3000',
  'https://verdant-sfogliatella-0ba40c.netlify.app',
]

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true)

      if (allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })
)

app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoute)
app.use('/api/notification', notificationRoute)
app.use('/api/tasks', taskRoute)

app.get('/ping', async (req, res) => {
  try {
    if (!mongoose.connection.readyState) {
      return res.status(200).json({ message: 'Server awake, DB not connected' })
    }

    await mongoose.connection.db.admin().ping()
    res.status(200).json({ message: 'Server and MongoDB are awake' })
  } catch (error) {
    res.status(200).json({ message: 'Server awake, DB may be waking', error: error.message })
  }
})

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
