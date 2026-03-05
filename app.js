require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoute = require('./routers/authRoute');
const notificationRoute = require('./routers/notificationRoute');
const taskRoute = require('./routers/taskRoute');

const app = express();

const allowedOrigins = ['http://localhost:3000', 'https://taskmaster.ink'];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoute);
app.use('/api/notification', notificationRoute);
app.use('/api/tasks', taskRoute);

app.get('/ping', async (req, res) => {
  res.status(200).json({ message: 'pong' });
});

module.exports = app;
