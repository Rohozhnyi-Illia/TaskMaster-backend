const UserModel = require('../models/User');
const bcrypt = require('bcrypt');

const createUser = async (data = {}) => {
  const hashPassword = await bcrypt.hash('123456', 10);

  return await UserModel.create({
    name: 'TestExistingUser',
    email: 'test@existingUser.com',
    password: hashPassword,
    ...data,
  });
};

module.exports = createUser;
