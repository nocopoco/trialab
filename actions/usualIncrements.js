const UserModel = require('../models/UserModel');

const usualIncrements = async (user) => {
  try {
    console.log('Usual Incrementing...');
    const users = await UserModel.find();
    for (i = 0; i < users.length; i++) {
      users[i].money += users[i].nextIncrements.money;
      users[i].population += users[i].nextIncrements.population;
      await users[i].save();
    }
    console.log('[DONE]Usual Incrementing...');
  } catch (err) {
    return err;
  }
};

module.exports = { usualIncrements };
