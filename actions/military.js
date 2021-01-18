const UserModel = require('../models/UserModel');
const ActionsQueue = require('../models/ActionsQueue');
const { DateTime } = require('luxon');

const dateSetting = {
  timezone: 'Asia/Singapore',
  locale: 'en-US',
  format: 'FF',
  localeString: DateTime.DATETIME_FULL_WITH_SECONDS,
};

const military = async (actionData) => {
  console.log(actionData);
  const user = await UserModel.findById(actionData.user);
  if (actionData.creation.name === 'recon') {
    user.intelligenceDivision.recons += actionData.creation.amount;
    user.AnDLogs.unshift({
      type: 'Military',
      from: actionData.user,
      result: 'Success',
      description: actionData.creation.amount + ' recon(s) built.',
      date: DateTime.local()
        .setZone(dateSetting.timezone)
        .setLocale(dateSetting.locale)
        .toFormat(dateSetting.format),
    });
    await user.save();
    await ActionsQueue.findByIdAndDelete(actionData._id);
  }
  if (actionData.creation.name === 'commando') {
    user.intelligenceDivision.commandos += actionData.creation.amount;
    user.AnDLogs.unshift({
      type: 'Military',
      from: actionData.user,
      result: 'Success',
      description: actionData.creation.amount + ' commando(s) built.',
      date: DateTime.local()
        .setZone(dateSetting.timezone)
        .setLocale(dateSetting.locale)
        .toFormat(dateSetting.format),
    });
    await user.save();
    await ActionsQueue.findByIdAndDelete(actionData._id);
  }
  if (actionData.creation.name === 'infantryOne') {
    user.infantryDivision.infantry1.quantity += actionData.creation.amount;
    user.infantryDivision.attackPts += actionData.creation.amount * 10;
    user.infantryDivision.defencePts += actionData.creation.amount * 5;
    user.AnDLogs.unshift({
      type: 'Military',
      from: actionData.user,
      result: 'Success',
      description: actionData.creation.amount + ' infantryOne(s) built.',
      date: DateTime.local()
        .setZone(dateSetting.timezone)
        .setLocale(dateSetting.locale)
        .toFormat(dateSetting.format),
    });
    await user.save();
    await ActionsQueue.findByIdAndDelete(actionData._id);
  }
  if (actionData.creation.name === 'infantryTwo') {
    user.infantryDivision.infantry2.quantity += actionData.creation.amount;
    user.infantryDivision.attackPts += actionData.creation.amount * 10;
    user.infantryDivision.defencePts += actionData.creation.amount * 5;
    user.AnDLogs.unshift({
      type: 'Military',
      from: actionData.user,
      result: 'Success',
      description: actionData.creation.amount + ' infantryTwo(s) built.',
      date: DateTime.local()
        .setZone(dateSetting.timezone)
        .setLocale(dateSetting.locale)
        .toFormat(dateSetting.format),
    });
    await user.save();
    await ActionsQueue.findByIdAndDelete(actionData._id);
  }
  if (actionData.creation.name === 'infantryThree') {
    user.infantryDivision.infantry3.quantity += actionData.creation.amount;
    user.infantryDivision.attackPts += actionData.creation.amount * 10;
    user.infantryDivision.defencePts += actionData.creation.amount * 5;
    user.AnDLogs.unshift({
      type: 'Military',
      from: actionData.user,
      result: 'Success',
      description: actionData.creation.amount + ' infantryThree(s) built.',
      date: DateTime.local()
        .setZone(dateSetting.timezone)
        .setLocale(dateSetting.locale)
        .toFormat(dateSetting.format),
    });
    await user.save();
    await ActionsQueue.findByIdAndDelete(actionData._id);
  }
  if (actionData.creation.name === 'infantryFour') {
    user.infantryDivision.infantry4.quantity += actionData.creation.amount;
    user.infantryDivision.attackPts += actionData.creation.amount * 10;
    user.infantryDivision.defencePts += actionData.creation.amount * 5;
    user.AnDLogs.unshift({
      type: 'Military',
      from: actionData.user,
      result: 'Success',
      description: actionData.creation.amount + ' infantryFour(s) built.',
      date: DateTime.local()
        .setZone(dateSetting.timezone)
        .setLocale(dateSetting.locale)
        .toFormat(dateSetting.format),
    });
    await user.save();
    await ActionsQueue.findByIdAndDelete(actionData._id);
  }

  if (actionData.creation.name === 'airOne') {
    user.airDivision.air1.quantity += actionData.creation.amount;
    user.airDivision.attackPts += actionData.creation.amount * 10;
    user.airDivision.defencePts += actionData.creation.amount * 5;
    user.AnDLogs.unshift({
      type: 'Military',
      from: actionData.user,
      result: 'Success',
      description: actionData.creation.amount + ' airOne(s) built.',
      date: DateTime.local()
        .setZone(dateSetting.timezone)
        .setLocale(dateSetting.locale)
        .toFormat(dateSetting.format),
    });
    await user.save();
    await ActionsQueue.findByIdAndDelete(actionData._id);
  }
  if (actionData.creation.name === 'airTwo') {
    user.airDivision.air2.quantity += actionData.creation.amount;
    user.airDivision.attackPts += actionData.creation.amount * 10;
    user.airDivision.defencePts += actionData.creation.amount * 5;
    user.AnDLogs.unshift({
      type: 'Military',
      from: actionData.user,
      result: 'Success',
      description: actionData.creation.amount + ' airTwo(s) built.',
      date: DateTime.local()
        .setZone(dateSetting.timezone)
        .setLocale(dateSetting.locale)
        .toFormat(dateSetting.format),
    });
    await user.save();
    await ActionsQueue.findByIdAndDelete(actionData._id);
  }
  if (actionData.creation.name === 'airThree') {
    user.airDivision.air3.quantity += actionData.creation.amount;
    user.airDivision.attackPts += actionData.creation.amount * 10;
    user.airDivision.defencePts += actionData.creation.amount * 5;
    user.AnDLogs.unshift({
      type: 'Military',
      from: actionData.user,
      result: 'Success',
      description: actionData.creation.amount + ' airThree(s) built.',
      date: DateTime.local()
        .setZone(dateSetting.timezone)
        .setLocale(dateSetting.locale)
        .toFormat(dateSetting.format),
    });
    await user.save();
    await ActionsQueue.findByIdAndDelete(actionData._id);
  }
  if (actionData.creation.name === 'airFour') {
    user.airDivision.air4.quantity += actionData.creation.amount;
    user.airDivision.attackPts += actionData.creation.amount * 10;
    user.airDivision.defencePts += actionData.creation.amount * 5;
    user.AnDLogs.unshift({
      type: 'Military',
      from: actionData.user,
      result: 'Success',
      description: actionData.creation.amount + ' airFour(s) built.',
      date: DateTime.local()
        .setZone(dateSetting.timezone)
        .setLocale(dateSetting.locale)
        .toFormat(dateSetting.format),
    });
    await user.save();
    await ActionsQueue.findByIdAndDelete(actionData._id);
  }

  if (actionData.creation.name === 'seaOne') {
    user.seaDivision.sea1.quantity += actionData.creation.amount;
    user.seaDivision.attackPts += actionData.creation.amount * 10;
    user.seaDivision.defencePts += actionData.creation.amount * 5;
    user.AnDLogs.unshift({
      type: 'Military',
      from: actionData.user,
      result: 'Success',
      description: actionData.creation.amount + ' seaOne(s) built.',
      date: DateTime.local()
        .setZone(dateSetting.timezone)
        .setLocale(dateSetting.locale)
        .toFormat(dateSetting.format),
    });
    await user.save();
    await ActionsQueue.findByIdAndDelete(actionData._id);
  }
  if (actionData.creation.name === 'seaTwo') {
    user.seaDivision.sea2.quantity += actionData.creation.amount;
    user.seaDivision.attackPts += actionData.creation.amount * 10;
    user.seaDivision.defencePts += actionData.creation.amount * 5;
    user.AnDLogs.unshift({
      type: 'Military',
      from: actionData.user,
      result: 'Success',
      description: actionData.creation.amount + ' seaTwo(s) built.',
      date: DateTime.local()
        .setZone(dateSetting.timezone)
        .setLocale(dateSetting.locale)
        .toFormat(dateSetting.format),
    });
    await user.save();
    await ActionsQueue.findByIdAndDelete(actionData._id);
  }
  if (actionData.creation.name === 'seaThree') {
    user.seaDivision.sea3.quantity += actionData.creation.amount;
    user.seaDivision.attackPts += actionData.creation.amount * 10;
    user.seaDivision.defencePts += actionData.creation.amount * 5;
    user.AnDLogs.unshift({
      type: 'Military',
      from: actionData.user,
      result: 'Success',
      description: actionData.creation.amount + ' seaThree(s) built.',
      date: DateTime.local()
        .setZone(dateSetting.timezone)
        .setLocale(dateSetting.locale)
        .toFormat(dateSetting.format),
    });
    await user.save();
    await ActionsQueue.findByIdAndDelete(actionData._id);
  }
  if (actionData.creation.name === 'seaFour') {
    user.seaDivision.sea4.quantity += actionData.creation.amount;
    user.seaDivision.attackPts += actionData.creation.amount * 10;
    user.seaDivision.defencePts += actionData.creation.amount * 5;
    user.AnDLogs.unshift({
      type: 'Military',
      from: actionData.user,
      result: 'Success',
      description: actionData.creation.amount + ' seaFour(s) built.',
      date: DateTime.local()
        .setZone(dateSetting.timezone)
        .setLocale(dateSetting.locale)
        .toFormat(dateSetting.format),
    });
    await user.save();
    await ActionsQueue.findByIdAndDelete(actionData._id);
  }
};

module.exports = { military };
