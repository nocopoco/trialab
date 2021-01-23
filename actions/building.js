const UserModel = require('../models/UserModel');
const ActionsQueue = require('../models/ActionsQueue');
const { DateTime } = require('luxon');

const dateSetting = {
  timezone: 'Asia/Singapore',
  locale: 'en-US',
  format: 'FF',
  localeString: DateTime.DATETIME_FULL_WITH_SECONDS,
};

const spaceAmount = {
  intelCamp: 5,
  armyCamp: 5,
  airField: 5,
  navalBase: 5,
  foodBank: 5,
};

const networthBuildings = {
  intelCamp: 100,
  armyCamp: 100,
  airField: 100,
  navalBase: 100,
};

const build = async (actionData) => {
  try {
    console.log(actionData);
    const user = await UserModel.findById(actionData.user);
    if (actionData.creation.name === 'intelDept') {
      user.networth += actionData.creation.amount * networthBuildings.intelCamp;
      user.buildings.intelligenceCamp.quantity += actionData.creation.amount;
      user.buildings.intelligenceCamp.availableSpace +=
        actionData.creation.amount * spaceAmount.intelCamp;
      user.buildings.intelligenceCamp.totalSpace +=
        actionData.creation.amount * spaceAmount.intelCamp;
      user.AnDLogs.unshift({
        type: 'Building',
        from: actionData.user,
        result: 'Success',
        description: actionData.creation.amount + ' ' + 'intel camps(s) built.',
        date: DateTime.local()
          .setZone(dateSetting.timezone)
          .setLocale(dateSetting.locale)
          .toFormat(dateSetting.format),
      });
      await user.save();
      await ActionsQueue.findByIdAndDelete(actionData._id);
    }
    if (actionData.creation.name === 'armyCamp') {
      user.networth += actionData.creation.amount * networthBuildings.armyCamp;
      user.buildings.infantryCamp.quantity += actionData.creation.amount;
      user.buildings.infantryCamp.availableSpace +=
        actionData.creation.amount * spaceAmount.armyCamp;
      user.buildings.infantryCamp.totalSpace +=
        actionData.creation.amount * spaceAmount.armyCamp;
      user.AnDLogs.unshift({
        type: 'Building',
        from: actionData.user,
        result: 'Success',
        description: actionData.creation.amount + ' ' + 'army camp(s) built.',
        date: DateTime.local()
          .setZone(dateSetting.timezone)
          .setLocale(dateSetting.locale)
          .toFormat(dateSetting.format),
      });
      await user.save();
      await ActionsQueue.findByIdAndDelete(actionData._id);
    }
    if (actionData.creation.name === 'airField') {
      user.networth += actionData.creation.amount * networthBuildings.airField;
      user.buildings.airField.quantity += actionData.creation.amount;
      user.buildings.airField.availableSpace +=
        actionData.creation.amount * spaceAmount.airField;

      user.buildings.airField.totalSpace +=
        actionData.creation.amount * spaceAmount.airField;
      user.AnDLogs.unshift({
        type: 'Building',
        from: actionData.user,
        result: 'Success',
        description: actionData.creation.amount + ' ' + 'air field(s) built.',
        date: DateTime.local()
          .setZone(dateSetting.timezone)
          .setLocale(dateSetting.locale)
          .toFormat(dateSetting.format),
      });
      await user.save();
      await ActionsQueue.findByIdAndDelete(actionData._id);
    }
    if (actionData.creation.name === 'navalBase') {
      user.networth += actionData.creation.amount * networthBuildings.navalBase;
      user.buildings.navalBase.quantity += actionData.creation.amount;
      user.buildings.navalBase.availableSpace +=
        actionData.creation.amount * spaceAmount.navalBase;

      user.buildings.navalBase.totalSpace +=
        actionData.creation.amount * spaceAmount.navalBase;
      user.AnDLogs.unshift({
        type: 'Building',
        from: actionData.user,
        result: 'Success',
        description: actionData.creation.amount + ' ' + 'naval base(s) built.',
        date: DateTime.local()
          .setZone(dateSetting.timezone)
          .setLocale(dateSetting.locale)
          .toFormat(dateSetting.format),
      });
      await user.save();
      await ActionsQueue.findByIdAndDelete(actionData._id);
    }
  } catch (err) {
    return err;
  }
};

module.exports = { build };
