require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const authRoute = require('./routers/authRoute')

const app = express()
const PORT = process.env.PORT || 2000
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

const startServer = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      dbName: 'TaskMaster',
    })
    console.log('✅ MongoDB connected successfully')
    app.listen(PORT, () => {
      console.log(`Server was started on port: ${PORT}`)
    })
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
}

startServer()
