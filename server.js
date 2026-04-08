require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');
const initDeadlineChecker = require('./crons/checkDeadlines');

const PORT = process.env.PORT;
if (!PORT) throw new Error('PORT is not defined in environment variables');

const startServer = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, { dbName: 'TaskMaster' });
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    initDeadlineChecker();
  } catch (error) {
    console.error('Failed to start server:', error);
    throw error;
  }
};

startServer();
