const UserModel = require('../models/UserModel');
const ActionsQueue = require('../models/ActionsQueue');
const { DateTime } = require('luxon');

const dateSetting = {
  timezone: 'Asia/Singapore',
  locale: 'en-US',
  format: 'FF',
  localeString: DateTime.DATETIME_FULL_WITH_SECONDS,
};

const LAND_INCREMENTS_PER_UNIT = 5;

const explore = async (actionData) => {
  try {
    console.log(actionData);
    const user = await UserModel.findById(actionData.user);
    const landGained = actionData.creation.amount * LAND_INCREMENTS_PER_UNIT;
    user.land = user.land + landGained;
    user.AnDLogs.unshift({
      type: 'Explore',
      from: actionData.user,
      result: 'Success',
      description:
        'Dispatched: ' +
        actionData.creation.amount +
        ' unit' +
        '\n' +
        'Gained: ' +
        landGained +
        ' land',
      date: DateTime.local()
        .setZone(dateSetting.timezone)
        .setLocale(dateSetting.locale)
        .toFormat(dateSetting.format),
    });
    await user.save();
    await ActionsQueue.findByIdAndDelete(actionData._id);
  } catch (err) {
    return err;
  }
};

module.exports = { explore };
