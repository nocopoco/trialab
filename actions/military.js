const UserModel = require('../models/UserModel');
const ActionsQueue = require('../models/ActionsQueue');
const { DateTime } = require('luxon');

const dateSetting = {
  timezone: 'Asia/Singapore',
  locale: 'en-US',
  format: 'FF',
  localeString: DateTime.DATETIME_FULL_WITH_SECONDS,
};

const networthUnits = {
  recons: 50,
  commando: 50,
  infantry1: 25,
  infantry2: 35,
  infantry3: 45,
  infantry4: 55,
  air1: 25,
  air2: 35,
  air3: 45,
  air4: 55,
  sea1: 25,
  sea2: 35,
  sea3: 45,
  sea4: 55,
};
const attackp = {
  infantry1: 10,
  infantry2: 20,
  infantry3: 30,
  infantry4: 40,
  air1: 10,
  air2: 20,
  air3: 30,
  air4: 40,
  sea1: 10,
  sea2: 20,
  sea3: 30,
  sea4: 40,
};
const defencep = {
  infantry1: 5,
  infantry2: 6,
  infantry3: 7,
  infantry4: 8,
  air1: 5,
  air2: 6,
  air3: 7,
  air4: 8,
  sea1: 5,
  sea2: 6,
  sea3: 7,
  sea4: 8,
};

const military = async (actionData) => {
  console.log(actionData);
  const user = await UserModel.findById(actionData.user);
  if (actionData.creation.name === 'recon') {
    user.networth += actionData.creation.amount * networthUnits.recons;
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
    user.networth += actionData.creation.amount * networthUnits.commando;
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
    user.networth += actionData.creation.amount * networthUnits.infantry1;
    user.infantryDivision.infantry1.quantity += actionData.creation.amount;
    user.infantryDivision.attackPts +=
      actionData.creation.amount * attackp.infantry1;
    user.infantryDivision.defencePts +=
      actionData.creation.amount * defencep.infantry1;
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
    user.networth += actionData.creation.amount * networthUnits.infantry2;
    user.infantryDivision.infantry2.quantity += actionData.creation.amount;
    user.infantryDivision.attackPts +=
      actionData.creation.amount * attackp.infantry2;
    user.infantryDivision.defencePts +=
      actionData.creation.amount * defencep.infantry2;
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
    user.networth += actionData.creation.amount * networthUnits.infantry3;
    user.infantryDivision.infantry3.quantity += actionData.creation.amount;
    user.infantryDivision.attackPts +=
      actionData.creation.amount * attackp.infantry3;
    user.infantryDivision.defencePts +=
      actionData.creation.amount * defencep.infantry3;
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
    user.networth += actionData.creation.amount * networthUnits.infantry4;
    user.infantryDivision.infantry4.quantity += actionData.creation.amount;
    user.infantryDivision.attackPts +=
      actionData.creation.amount * attackp.infantry4;
    user.infantryDivision.defencePts +=
      actionData.creation.amount * defencep.infantry4;
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
    user.networth += actionData.creation.amount * networthUnits.air1;
    user.airDivision.air1.quantity += actionData.creation.amount;
    user.airDivision.attackPts += actionData.creation.amount * attackp.air1;
    user.airDivision.defencePts += actionData.creation.amount * defencep.air1;
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
    user.networth += actionData.creation.amount * networthUnits.air2;
    user.airDivision.air2.quantity += actionData.creation.amount;
    user.airDivision.attackPts += actionData.creation.amount * attackp.air2;
    user.airDivision.defencePts += actionData.creation.amount * defencep.air2;
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
    user.networth += actionData.creation.amount * networthUnits.air3;
    user.airDivision.air3.quantity += actionData.creation.amount;
    user.airDivision.attackPts += actionData.creation.amount * attackp.air3;
    user.airDivision.defencePts += actionData.creation.amount * defencep.air3;
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
    user.networth += actionData.creation.amount * networthUnits.air4;
    user.airDivision.air4.quantity += actionData.creation.amount;
    user.airDivision.attackPts += actionData.creation.amount * attackp.air4;
    user.airDivision.defencePts += actionData.creation.amount * defencep.air4;
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
    user.networth += actionData.creation.amount * networthUnits.sea1;
    user.seaDivision.sea1.quantity += actionData.creation.amount;
    user.seaDivision.attackPts += actionData.creation.amount * attackp.sea1;
    user.seaDivision.defencePts += actionData.creation.amount * defencep.sea1;
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
    user.networth += actionData.creation.amount * networthUnits.sea2;
    user.seaDivision.sea2.quantity += actionData.creation.amount;
    user.seaDivision.attackPts += actionData.creation.amount * attackp.sea2;
    user.seaDivision.defencePts += actionData.creation.amount * defencep.sea2;
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
    user.networth += actionData.creation.amount * networthUnits.sea3;
    user.seaDivision.sea3.quantity += actionData.creation.amount;
    user.seaDivision.attackPts += actionData.creation.amount * attackp.sea3;
    user.seaDivision.defencePts += actionData.creation.amount * defencep.sea3;
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
    user.networth += actionData.creation.amount * networthUnits.sea4;
    user.seaDivision.sea4.quantity += actionData.creation.amount;
    user.seaDivision.attackPts += actionData.creation.amount * attackp.sea4;
    user.seaDivision.defencePts += actionData.creation.amount * defencep.sea4;
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
