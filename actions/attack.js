const UserModel = require('../models/UserModel');
const ActionsQueue = require('../models/ActionsQueue');
const { DateTime } = require('luxon');

const dateSetting = {
  timezone: 'Asia/Singapore',
  locale: 'en-US',
  format: 'FF',
  localeString: DateTime.DATETIME_FULL_WITH_SECONDS,
};

//If attack succeeds => destroy 5%  of land, and military. You will lose 1% of your units sent.
//if attack fails => destory 1% military. You will lose 5% of your units sent.

const attack = async (actionData) => {
  try {
    console.log(actionData);
    let logs = {};
    let totalDefencePts = 0;
    const target = await UserModel.findById(actionData.target);
    const user = await UserModel.findById(actionData.user);
    totalDefencePts += target.infantryDivision.defencePts;
    totalDefencePts += target.airDivision.defencePts;
    totalDefencePts += target.seaDivision.defencePts;
    const winOrLose = totalDefencePts < actionData.totalPower;
    if (winOrLose) {
      const landTaken = target.land * 0.05;
      user.land += landTaken;
      target.land -= landTaken;
      target.infantryDivision.infantry1.quantity -= Math.ceil(
        target.infantryDivision.infantry1.quantity * 0.05
      );
      logs.infantryOne =
        'Lost ' +
        Math.ceil(target.infantryDivision.infantry1.quantity * 0.05) +
        ' infantryOne';
      target.infantryDivision.infantry2.quantity -= Math.ceil(
        target.infantryDivision.infantry2.quantity * 0.05
      );
      logs.infantryTwo =
        'Lost ' +
        Math.ceil(target.infantryDivision.infantry2.quantity * 0.05) +
        ' infantryTwo';
      target.infantryDivision.infantry3.quantity -= Math.ceil(
        target.infantryDivision.infantry3.quantity * 0.05
      );
      logs.infantryThree =
        'Lost ' +
        Math.ceil(target.infantryDivision.infantry3.quantity * 0.05) +
        ' infantryThree';
      target.infantryDivision.infantry4.quantity -= Math.ceil(
        target.infantryDivision.infantry4.quantity * 0.05
      );
      logs.infantryFour =
        'Lost ' +
        Math.ceil(target.infantryDivision.infantry4.quantity * 0.05) +
        ' infantryFour';

      target.AnDLogs.unshift({
        type: 'Defend',
        from: actionData.user,
        result: 'Lost',
        description: 'Lost 5% of land and military.',
        date: DateTime.local()
          .setZone(dateSetting.timezone)
          .setLocale(dateSetting.locale)
          .toFormat(dateSetting.format),
      });

      user.AnDLogs.unshift({
        type: 'Attack',
        from: actionData.target,
        result: 'Success',
        description: 'Gained ' + landTaken + '.',
        date: DateTime.local()
          .setZone(dateSetting.timezone)
          .setLocale(dateSetting.locale)
          .toFormat(dateSetting.format),
      });
      await user.save();
      await target.save();
    } else {
      for (i = 0; i < actionData.forces.length; i++) {
        if (actionData.forces[i].type === 'infantry') {
          if (actionData.forces[i].name === 'infantryOne') {
            user.infantryDivision.infantry1 += Math.ceil(
              actionData.forces[i].amount * 0.05
            );
          }
          if (actionData.forces[i].name === 'infantryTwo') {
            user.infantryDivision.infantry2 += Math.ceil(
              actionData.forces[i].amount * 0.05
            );
          }
          if (actionData.forces[i].name === 'infantryThree') {
            user.infantryDivision.infantry3 += Math.ceil(
              actionData.forces[i].amount * 0.05
            );
          }
          if (actionData.forces[i].name === 'infantryFour') {
            user.infantryDivision.infantry4 += Math.ceil(
              actionData.forces[i].amount * 0.05
            );
          }
          user.infantryDivision.attackPts =
            user.infantryDivision.infantry1 * 10 +
            user.infantryDivision.infantry2 * 20 +
            user.infantryDivision.infantry3 * 30 +
            user.infantryDivision.infantry4 * 40;
          user.infantryDivision.defencePts =
            user.infantryDivision.infantry1 * 5 +
            user.infantryDivision.infantry2 * 5 +
            user.infantryDivision.infantry3 * 5 +
            user.infantryDivision.infantry4 * 5;
        }
        if (actionData.forces[i].type === 'air') {
          if (actionData.forces[i].name === 'airOne') {
            user.airDivision.air1 += Math.ceil(
              actionData.forces[i].amount * 0.05
            );
          }
          if (actionData.forces[i].name === 'airTwo') {
            user.airDivision.air2 += Math.ceil(
              actionData.forces[i].amount * 0.05
            );
          }
          if (actionData.forces[i].name === 'airThree') {
            user.airDivision.air3 += Math.ceil(
              actionData.forces[i].amount * 0.05
            );
          }
          if (actionData.forces[i].name === 'airFour') {
            user.airDivision.air4 += Math.ceil(
              actionData.forces[i].amount * 0.05
            );
          }
          user.airDivision.attackPts =
            user.airDivision.air1 * 10 +
            user.airDivision.air2 * 20 +
            user.airDivision.air3 * 30 +
            user.airDivision.air4 * 40;
          user.airDivision.defencePts =
            user.airDivision.air1 * 5 +
            user.airDivision.air2 * 5 +
            user.airDivision.air3 * 5 +
            user.airDivision.air4 * 5;
        }
        if (actionData.forces[i].type === 'naval') {
          if (actionData.forces[i].name === 'seaOne') {
            user.seaDivision.sea1 += Math.ceil(
              actionData.forces[i].amount * 0.05
            );
          }
          if (actionData.forces[i].name === 'seaTwo') {
            user.seaDivision.sea2 += Math.ceil(
              actionData.forces[i].amount * 0.05
            );
          }
          if (actionData.forces[i].name === 'seaThree') {
            user.seaDivision.sea3 += Math.ceil(
              actionData.forces[i].amount * 0.05
            );
          }
          if (actionData.forces[i].name === 'seaFour') {
            user.seaDivision.sea4 += Math.ceil(
              actionData.forces[i].amount * 0.05
            );
          }
          user.seaDivision.attackPts =
            user.seaDivision.sea1 * 10 +
            user.seaDivision.sea2 * 20 +
            user.seaDivision.sea3 * 30 +
            user.seaDivision.sea4 * 40;
          user.seaDivision.defencePts =
            user.seaDivision.sea1 * 5 +
            user.seaDivision.sea2 * 5 +
            user.seaDivision.sea3 * 5 +
            user.seaDivision.sea4 * 5;
        }
      }
      user.AnDLogs.unshift({
        type: 'Attack',
        from: actionData.target,
        result: 'Lost',
        description: 'Lost 5% of the units sent.',
        date: DateTime.local()
          .setZone(dateSetting.timezone)
          .setLocale(dateSetting.locale)
          .toFormat(dateSetting.format),
      });
      target.AnDLogs.unshift({
        type: 'Defend',
        from: actionData.user,
        result: 'Success',
        description: 'Destroyed 5% of enemy attacking units.',
        date: DateTime.local()
          .setZone(dateSetting.timezone)
          .setLocale(dateSetting.locale)
          .toFormat(dateSetting.format),
      });
      await user.save();
      await target.save();
    }
  } catch (err) {
    return err;
  }
};

module.exports = { attack };
