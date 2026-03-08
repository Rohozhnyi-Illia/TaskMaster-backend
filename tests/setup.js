const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
jest.setTimeout(30000);

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.disconnect();
  await mongoose.connect(mongoServer.getUri(), { dbName: 'TaskMasterTest' });

  jest.mock('../crons/checkDeadlines', () => jest.fn());
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  jest.clearAllTimers();
  await mongoose.disconnect();
  await mongoServer.stop();
});
