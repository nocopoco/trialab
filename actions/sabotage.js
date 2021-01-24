const UserModel = require('../models/UserModel');
const ActionsQueue = require('../models/ActionsQueue');
const { DateTime } = require('luxon');

const dateSetting = {
  timezone: 'Asia/Singapore',
  locale: 'en-US',
  format: 'FF',
  localeString: DateTime.DATETIME_FULL_WITH_SECONDS,
};
//if success => destroy 10% recons&commandos. lose 1% ur units;
//if lost => lose 10% ur units, destroy 1% commandos;

const sabotage = async (actionData) => {
  try {
    console.log(actionData);
    const user = await UserModel.findById(actionData.user);
    const target = await UserModel.findById(actionData.target);
    const winOrLose =
      actionData.forces[0].amount < target.intelligenceDivision.commandos;
    if (winOrLose) {
      console.log('Lost');
      user.intelligenceDivision.commandos += Math.floor(
        actionData.forces[0].amount * 0.9
      );
      user.networth -= Math.ceil(actionData.forces[0].amount * 0.1) * 50;

      user.AnDLogs.unshift({
        type: 'Sabotage',
        result: 'Lost',
        from: actionData.user,
        description:
          'Lost ' +
          Math.ceil(actionData.forces[0].amount * 0.1) +
          ' commandos. Failed to sabotage.',
        date: DateTime.local()
          .setZone(dateSetting.timezone)
          .setLocale(dateSetting.locale)
          .toFormat(dateSetting.format),
      });

      target.intelligenceDivision.commandos = Math.ceil(
        target.intelligenceDivision.commandos * 0.99
      );
      target.networth -=
        Math.ceil(target.intelligenceDivision.commandos * 0.99) * 50;
      target.AnDLogs.unshift({
        type: 'Sabotage',
        result: 'Won',
        from: actionData.user,
        description:
          'Successfully defended a sabotage. Lost ' +
          Math.ceil(target.intelligenceDivision.commandos * 0.99) +
          ' commandos',
        date: DateTime.local()
          .setZone(dateSetting.timezone)
          .setLocale(dateSetting.locale)
          .toFormat(dateSetting.format),
      });
    } else {
      console.log('Win');
      user.intelligenceDivision.commandos += Math.floor(
        actionData.forces[0].amount * 0.99
      );
      user.networth -= Math.ceil(actionData.forces[0].amount * 0.01) * 50;

      user.AnDLogs.unshift({
        type: 'Sabotage',
        result: 'Won',
        from: actionData.user,
        description:
          'Sabotaged successfully. Lost ' +
          Math.ceil(actionData.forces[0].amount * 0.01) +
          ' units. View Intelligence Page for more details.',
        date: DateTime.local()
          .setZone(dateSetting.timezone)
          .setLocale(dateSetting.locale)
          .toFormat(dateSetting.format),
      });

      user.intelligenceDivision.sabotages.unshift({
        result: 'Success',
        description:
          'Sabotaged successfully. Destroyed ' +
          Math.ceil(target.intelligenceDivision.commandos * 0.1) +
          ' recons. Destroyed ' +
          Math.ceil(target.intelligenceDivision.commandos * 0.1) +
          ' commandos Lost ' +
          Math.ceil(actionData.forces[0].amount * 0.01) +
          ' commandos.',
        target: actionData.target,
        date: DateTime.local()
          .setZone(dateSetting.timezone)
          .setLocale(dateSetting.locale)
          .toFormat(dateSetting.format),
      });

      target.intelligenceDivision.commandos = Math.ceil(
        target.intelligenceDivision.commandos * 0.9
      );
      target.intelligenceDivision.recons = Math.ceil(
        target.intelligenceDivision.recons * 0.9
      );
      target.networth -=
        Math.ceil(target.intelligenceDivision.commandos * 0.1) * 50 +
        Math.ceil(target.intelligenceDivision.recons * 0.1) * 50;
      target.AnDLogs.unshift({
        type: 'Sabotage',
        result: 'Lost',
        from: actionData.user,
        description:
          'Failed to defend a sabotage. Lost ' +
          Math.ceil(target.intelligenceDivision.commandos * 0.1) +
          ' commandos. Lost ' +
          Math.ceil(target.intelligenceDivision.recons * 0.1) +
          ' recons',
        date: DateTime.local()
          .setZone(dateSetting.timezone)
          .setLocale(dateSetting.locale)
          .toFormat(dateSetting.format),
      });
    }
    await user.save();
    await target.save();
    await ActionsQueue.findByIdAndDelete(actionData._id);
  } catch (err) {
    return err;
  }
};

module.exports = { sabotage };
