const UserModel = require('../models/UserModel');
const ActionsQueue = require('../models/ActionsQueue');
const { DateTime } = require('luxon');

const dateSetting = {
  timezone: 'Asia/Singapore',
  locale: 'en-US',
  format: 'FF',
  localeString: DateTime.DATETIME_FULL_WITH_SECONDS,
};

const intel = async (actionData) => {
  try {
    console.log(actionData);
    const user = await UserModel.findById(actionData.user);
    const target = await UserModel.findById(actionData.target);
    if (target.intelligenceDivision.recons < actionData.forces[0].amount) {
      user.intelligenceDivision.intels.unshift({
        result: 'Success',
        intelligenceDivision: {
          recons: target.intelligenceDivision.recons,
          commandos: target.intelligenceDivision.commandos,
        },
        infantryDivision: {
          attackPts: target.infantryDivision.attackPts,
          defencePts: target.infantryDivision.defencePts,
        },
        airDivision: {
          attackPts: target.airDivision.attackPts,
          defencePts: target.airDivision.defencePts,
        },
        navalDivision: {
          attackPts: target.seaDivision.attackPts,
          defencePts: target.seaDivision.defencePts,
        },
        target: actionData.target,
        date: DateTime.local()
          .setZone(dateSetting.timezone)
          .setLocale(dateSetting.locale)
          .toFormat(dateSetting.format),
      });
      user.intelligenceDivision.recons += Math.ceil(
        actionData.forces[0].amount * 0.9
      );
      user.AnDLogs.unshift({
        type: 'Recon',
        result: 'Success',
        from: actionData.user,
        description:
          'Check Intelligence Page for intel on ' + target.name + ' .',
        date: DateTime.local()
          .setZone(dateSetting.timezone)
          .setLocale(dateSetting.locale)
          .toFormat(dateSetting.format),
      });
      target.AnDLogs.unshift({
        type: 'Defend',
        result: 'Lost',
        from: actionData.user,
        description: 'Got Scanned.',
        date: DateTime.local()
          .setZone(dateSetting.timezone)
          .setLocale(dateSetting.locale)
          .toFormat(dateSetting.format),
      });
      await user.save();
      await target.save();
    } else {
      user.intelligenceDivision.recons += Math.ceil(
        actionData.forces[0].amount * 0.5
      );
      user.AnDLogs.unshift({
        type: 'Recon',
        result: 'Lost',
        from: actionData.user,
        description: 'Failed to scan ' + target.name + ' .',
        date: DateTime.local()
          .setZone(dateSetting.timezone)
          .setLocale(dateSetting.locale)
          .toFormat(dateSetting.format),
      });
      target.AnDLogs.unshift({
        type: 'Defend',
        result: 'Successful',
        from: actionData.user,
        description: 'Scan on us failed.',
        date: DateTime.local()
          .setZone(dateSetting.timezone)
          .setLocale(dateSetting.locale)
          .toFormat(dateSetting.format),
      });
      await user.save();
      await target.save();
    }
    await ActionsQueue.findByIdAndDelete(actionData._id);
  } catch (err) {
    return err;
  }
};

module.exports = { intel };
