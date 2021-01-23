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
      console.log('WON');
      const landTaken = Math.ceil(target.land * 0.05);
      user.land += landTaken;
      target.land -= landTaken;
      target.infantryDivision.infantry1.quantity -= Math.ceil(
        target.infantryDivision.infantry1.quantity * 0.05
      );
      target.airDivision.air1.quantity -= Math.ceil(
        target.airDivision.air1.quantity * 0.05
      );
      target.seaDivision.sea1.quantity -= Math.ceil(
        target.seaDivision.sea1.quantity * 0.05
      );

      target.infantryDivision.infantry2.quantity -= Math.ceil(
        target.infantryDivision.infantry2.quantity * 0.05
      );
      target.airDivision.air2.quantity -= Math.ceil(
        target.airDivision.air2.quantity * 0.05
      );
      target.seaDivision.sea2.quantity -= Math.ceil(
        target.seaDivision.sea2.quantity * 0.05
      );

      target.infantryDivision.infantry3.quantity -= Math.ceil(
        target.infantryDivision.infantry3.quantity * 0.05
      );
      target.airDivision.air3.quantity -= Math.ceil(
        target.airDivision.air3.quantity * 0.05
      );
      target.seaDivision.sea3.quantity -= Math.ceil(
        target.seaDivision.sea3.quantity * 0.05
      );

      target.infantryDivision.infantry4.quantity -= Math.ceil(
        target.infantryDivision.infantry4.quantity * 0.05
      );
      target.airDivision.air4.quantity -= Math.ceil(
        target.airDivision.air4.quantity * 0.05
      );
      target.seaDivision.sea4.quantity -= Math.ceil(
        target.seaDivision.sea4.quantity * 0.05
      );

      target.infantryDivision.attackPts =
        target.infantryDivision.infantry1.quantity * 10 +
        target.infantryDivision.infantry2.quantity * 10 +
        target.infantryDivision.infantry3.quantity * 10 +
        target.infantryDivision.infantry4.quantity * 10;
      target.infantryDivision.defencePts =
        target.infantryDivision.infantry1.quantity * 5 +
        target.infantryDivision.infantry2.quantity * 5 +
        target.infantryDivision.infantry3.quantity * 5 +
        target.infantryDivision.infantry4.quantity * 5;

      target.airDivision.attackPts =
        target.airDivision.air1.quantity * 10 +
        target.airDivision.air2.quantity * 10 +
        target.airDivision.air3.quantity * 10 +
        target.airDivision.air4.quantity * 10;
      target.airDivision.defencePts =
        target.airDivision.air1.quantity * 5 +
        target.airDivision.air2.quantity * 5 +
        target.airDivision.air3.quantity * 5 +
        target.airDivision.air4.quantity * 5;

      target.seaDivision.attackPts =
        target.seaDivision.sea1.quantity * 10 +
        target.seaDivision.sea2.quantity * 10 +
        target.seaDivision.sea3.quantity * 10 +
        target.seaDivision.sea4.quantity * 10;
      target.seaDivision.defencePts =
        target.seaDivision.sea1.quantity * 5 +
        target.seaDivision.sea2.quantity * 5 +
        target.seaDivision.sea3.quantity * 5 +
        target.seaDivision.sea4.quantity * 5;

      target.networth =
        1000 +
        target.buildings.intelligenceCamp.quantity * 100 +
        target.buildings.infantryCamp.quantity * 100 +
        target.buildings.airField.quantity * 100 +
        target.buildings.navalBase.quantity * 100 +
        target.intelligenceDivision.recons * networthUnits.recons +
        target.intelligenceDivision.commandos * networthUnits.commando +
        target.infantryDivision.infantry1.quantity * networthUnits.infantry1 +
        target.infantryDivision.infantry2.quantity * networthUnits.infantry2 +
        target.infantryDivision.infantry3.quantity * networthUnits.infantry3 +
        target.infantryDivision.infantry4.quantity * networthUnits.infantry4 +
        target.airDivision.air1.quantity * networthUnits.air1 +
        target.airDivision.air2.quantity * networthUnits.air2 +
        target.airDivision.air3.quantity * networthUnits.air3 +
        target.airDivision.air4.quantity * networthUnits.air4 +
        target.seaDivision.sea1.quantity * networthUnits.sea1 +
        target.seaDivision.sea2.quantity * networthUnits.sea2 +
        target.seaDivision.sea3.quantity * networthUnits.sea3 +
        target.seaDivision.sea4.quantity * networthUnits.sea4;

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

      for (i = 0; i < actionData.forces.length; i++) {
        if (actionData.forces[i].name === 'infantryOne') {
          user.infantryDivision.infantry1.quantity +=
            actionData.forces[i].amount -
            Math.ceil(actionData.forces[i].amount * 0.01);
        }
        if (actionData.forces[i].name === 'infantryTwo') {
          user.infantryDivision.infantry2.quantity +=
            actionData.forces[i].amount -
            Math.ceil(actionData.forces[i].amount * 0.01);
        }
        if (actionData.forces[i].name === 'infantryThree') {
          user.infantryDivision.infantry3.quantity +=
            actionData.forces[i].amount -
            Math.ceil(actionData.forces[i].amount * 0.01);
        }
        if (actionData.forces[i].name === 'infantryFour') {
          user.infantryDivision.infantry4.quantity +=
            actionData.forces[i].amount -
            Math.ceil(actionData.forces[i].amount * 0.01);
        }
        if (actionData.forces[i].name === 'airOne') {
          user.airDivision.air1.quantity +=
            actionData.forces[i].amount -
            Math.ceil(actionData.forces[i].amount * 0.01);
        }
        if (actionData.forces[i].name === 'airTwo') {
          user.airDivision.air2.quantity +=
            actionData.forces[i].amount -
            Math.ceil(actionData.forces[i].amount * 0.01);
        }
        if (actionData.forces[i].name === 'airThree') {
          user.airDivision.air3.quantity +=
            actionData.forces[i].amount -
            Math.ceil(actionData.forces[i].amount * 0.01);
        }
        if (actionData.forces[i].name === 'airFour') {
          user.airDivision.air4.quantity +=
            actionData.forces[i].amount -
            Math.ceil(actionData.forces[i].amount * 0.01);
        }
        if (actionData.forces[i].name === 'seaOne') {
          user.seaDivision.sea4.quantity +=
            actionData.forces[i].amount -
            Math.ceil(actionData.forces[i].amount * 0.01);
        }
        if (actionData.forces[i].name === 'seaTwo') {
          user.seaDivision.sea4.quantity +=
            actionData.forces[i].amount -
            Math.ceil(actionData.forces[i].amount * 0.01);
        }
        if (actionData.forces[i].name === 'seaThree') {
          user.seaDivision.sea4.quantity +=
            actionData.forces[i].amount -
            Math.ceil(actionData.forces[i].amount * 0.01);
        }
        if (actionData.forces[i].name === 'seaFour') {
          user.seaDivision.sea4.quantity +=
            actionData.forces[i].amount -
            Math.ceil(actionData.forces[i].amount * 0.01);
        }
      }

      ///
      user.infantryDivision.attackPts =
        user.infantryDivision.infantry1.quantity * 10 +
        user.infantryDivision.infantry2.quantity * 10 +
        user.infantryDivision.infantry3.quantity * 10 +
        user.infantryDivision.infantry4.quantity * 10;
      user.infantryDivision.defencePts =
        user.infantryDivision.infantry1.quantity * 5 +
        user.infantryDivision.infantry2.quantity * 5 +
        user.infantryDivision.infantry3.quantity * 5 +
        user.infantryDivision.infantry4.quantity * 5;

      ////
      user.airDivision.attackPts =
        user.airDivision.air1.quantity * 10 +
        user.airDivision.air2.quantity * 10 +
        user.airDivision.air3.quantity * 10 +
        user.airDivision.air4.quantity * 10;
      user.airDivision.defencePts =
        user.airDivision.air1.quantity * 5 +
        user.airDivision.air2.quantity * 5 +
        user.airDivision.air3.quantity * 5 +
        user.airDivision.air4.quantity * 5;

      ///
      user.seaDivision.attackPts =
        user.seaDivision.sea1.quantity * 10 +
        user.seaDivision.sea2.quantity * 10 +
        user.seaDivision.sea3.quantity * 10 +
        user.seaDivision.sea4.quantity * 10;
      user.seaDivision.defencePts =
        user.seaDivision.sea1.quantity * 5 +
        user.seaDivision.sea2.quantity * 5 +
        user.seaDivision.sea3.quantity * 5 +
        user.seaDivision.sea4.quantity * 5;

      user.networth =
        1000 +
        user.buildings.intelligenceCamp.quantity * 100 +
        user.buildings.infantryCamp.quantity * 100 +
        user.buildings.airField.quantity * 100 +
        user.buildings.navalBase.quantity * 100 +
        user.intelligenceDivision.recons * networthUnits.recons +
        user.intelligenceDivision.commandos * networthUnits.commando +
        user.infantryDivision.infantry1.quantity * networthUnits.infantry1 +
        user.infantryDivision.infantry2.quantity * networthUnits.infantry2 +
        user.infantryDivision.infantry3.quantity * networthUnits.infantry3 +
        user.infantryDivision.infantry4.quantity * networthUnits.infantry4 +
        user.airDivision.air1.quantity * networthUnits.air1 +
        user.airDivision.air2.quantity * networthUnits.air2 +
        user.airDivision.air3.quantity * networthUnits.air3 +
        user.airDivision.air4.quantity * networthUnits.air4 +
        user.seaDivision.sea1.quantity * networthUnits.sea1 +
        user.seaDivision.sea2.quantity * networthUnits.sea2 +
        user.seaDivision.sea3.quantity * networthUnits.sea3 +
        user.seaDivision.sea4.quantity * networthUnits.sea4;

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
    } else {
      console.log('LOST');
      for (i = 0; i < actionData.forces.length; i++) {
        if (actionData.forces[i].type === 'infantry') {
          if (actionData.forces[i].name === 'infantryOne') {
            user.infantryDivision.infantry1.quantity += Math.ceil(
              actionData.forces[i].amount * 0.05
            );
          }
          if (actionData.forces[i].name === 'infantryTwo') {
            user.infantryDivision.infantry2.quantity += Math.ceil(
              actionData.forces[i].amount * 0.05
            );
          }
          if (actionData.forces[i].name === 'infantryThree') {
            user.infantryDivision.infantry3.quantity += Math.ceil(
              actionData.forces[i].amount * 0.05
            );
          }
          if (actionData.forces[i].name === 'infantryFour') {
            user.infantryDivision.infantry4.quantity += Math.ceil(
              actionData.forces[i].amount * 0.05
            );
          }
        }
        if (actionData.forces[i].type === 'air') {
          if (actionData.forces[i].name === 'airOne') {
            user.airDivision.air1.quantity += Math.ceil(
              actionData.forces[i].amount * 0.05
            );
          }
          if (actionData.forces[i].name === 'airTwo') {
            user.airDivision.air2.quantity += Math.ceil(
              actionData.forces[i].amount * 0.05
            );
          }
          if (actionData.forces[i].name === 'airThree') {
            user.airDivision.air3.quantity += Math.ceil(
              actionData.forces[i].amount * 0.05
            );
          }
          if (actionData.forces[i].name === 'airFour') {
            user.airDivision.air4.quantity += Math.ceil(
              actionData.forces[i].amount * 0.05
            );
          }
        }
        if (actionData.forces[i].type === 'naval') {
          if (actionData.forces[i].name === 'seaOne') {
            user.seaDivision.sea1.quantity += Math.ceil(
              actionData.forces[i].amount * 0.05
            );
          }
          if (actionData.forces[i].name === 'seaTwo') {
            user.seaDivision.sea2.quantity += Math.ceil(
              actionData.forces[i].amount * 0.05
            );
          }
          if (actionData.forces[i].name === 'seaThree') {
            user.seaDivision.sea3.quantity += Math.ceil(
              actionData.forces[i].amount * 0.05
            );
          }
          if (actionData.forces[i].name === 'seaFour') {
            user.seaDivision.sea4.quantity += Math.ceil(
              actionData.forces[i].amount * 0.05
            );
          }
        }
      }
      user.infantryDivision.attackPts =
        user.infantryDivision.infantry1.quantity * 10 +
        user.infantryDivision.infantry2.quantity * 20 +
        user.infantryDivision.infantry3.quantity * 30 +
        user.infantryDivision.infantry4.quantity * 40;
      user.infantryDivision.defencePts =
        user.infantryDivision.infantry1.quantity * 5 +
        user.infantryDivision.infantry2.quantity * 5 +
        user.infantryDivision.infantry3.quantity * 5 +
        user.infantryDivision.infantry4.quantity * 5;
      //
      user.airDivision.attackPts =
        user.airDivision.air1.quantity * 10 +
        user.airDivision.air2.quantity * 20 +
        user.airDivision.air3.quantity * 30 +
        user.airDivision.air4.quantity * 40;
      user.airDivision.defencePts =
        user.airDivision.air1.quantity * 5 +
        user.airDivision.air2.quantity * 5 +
        user.airDivision.air3.quantity * 5 +
        user.airDivision.air4.quantity * 5;
      //
      user.seaDivision.attackPts =
        user.seaDivision.sea1.quantity * 10 +
        user.seaDivision.sea2.quantity * 20 +
        user.seaDivision.sea3.quantity * 30 +
        user.seaDivision.sea4.quantity * 40;
      user.seaDivision.defencePts =
        user.seaDivision.sea1.quantity * 5 +
        user.seaDivision.sea2.quantity * 5 +
        user.seaDivision.sea3.quantity * 5 +
        user.seaDivision.sea4.quantity * 5;

      user.networth =
        1000 +
        user.buildings.intelligenceCamp.quantity * 100 +
        user.buildings.infantryCamp.quantity * 100 +
        user.buildings.airField.quantity * 100 +
        user.buildings.navalBase.quantity * 100 +
        user.intelligenceDivision.recons * networthUnits.recons +
        user.intelligenceDivision.commandos * networthUnits.commando +
        user.infantryDivision.infantry1.quantity * networthUnits.infantry1 +
        user.infantryDivision.infantry2.quantity * networthUnits.infantry2 +
        user.infantryDivision.infantry3.quantity * networthUnits.infantry3 +
        user.infantryDivision.infantry4.quantity * networthUnits.infantry4 +
        user.airDivision.air1.quantity * networthUnits.air1 +
        user.airDivision.air2.quantity * networthUnits.air2 +
        user.airDivision.air3.quantity * networthUnits.air3 +
        user.airDivision.air4.quantity * networthUnits.air4 +
        user.seaDivision.sea1.quantity * networthUnits.sea1 +
        user.seaDivision.sea2.quantity * networthUnits.sea2 +
        user.seaDivision.sea3.quantity * networthUnits.sea3 +
        user.seaDivision.sea4.quantity * networthUnits.sea4;

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
      target.infantryDivision.infantry1.quantity = Math.ceil(
        target.infantryDivision.infantry1.quantity * 0.99
      );
      target.infantryDivision.infantry2.quantity = Math.ceil(
        target.infantryDivision.infantry2.quantity * 0.99
      );
      target.infantryDivision.infantry3.quantity = Math.ceil(
        target.infantryDivision.infantry3.quantity * 0.99
      );
      target.infantryDivision.infantry4.quantity = Math.ceil(
        target.infantryDivision.infantry4.quantity * 0.99
      );
      //
      target.airDivision.air1.quantity = Math.ceil(
        target.airDivision.air1.quantity * 0.99
      );
      target.airDivision.air2.quantity = Math.ceil(
        target.airDivision.air2.quantity * 0.99
      );
      target.airDivision.air3.quantity = Math.ceil(
        target.airDivision.air3.quantity * 0.99
      );
      target.airDivision.air4.quantity = Math.ceil(
        target.airDivision.air4.quantity * 0.99
      );
      //
      target.seaDivision.sea1.quantity = Math.ceil(
        target.seaDivision.sea1.quantity * 0.99
      );
      target.seaDivision.sea2.quantity = Math.ceil(
        target.seaDivision.sea2.quantity * 0.99
      );
      target.seaDivision.sea3.quantity = Math.ceil(
        target.seaDivision.sea3.quantity * 0.99
      );
      target.seaDivision.sea4.quantity = Math.ceil(
        target.seaDivision.sea4.quantity * 0.99
      );
      target.infantryDivision.attackPts =
        target.infantryDivision.infantry1.quantity * 10 +
        target.infantryDivision.infantry2.quantity * 20 +
        target.infantryDivision.infantry3.quantity * 30 +
        target.infantryDivision.infantry4.quantity * 40;
      target.infantryDivision.defencePts =
        target.infantryDivision.infantry1.quantity * 5 +
        target.infantryDivision.infantry2.quantity * 5 +
        target.infantryDivision.infantry3.quantity * 5 +
        target.infantryDivision.infantry4.quantity * 5;
      //
      target.airDivision.attackPts =
        target.airDivision.air1.quantity * 10 +
        target.airDivision.air2.quantity * 20 +
        target.airDivision.air3.quantity * 30 +
        target.airDivision.air4.quantity * 40;
      target.airDivision.defencePts =
        target.airDivision.air1.quantity * 5 +
        target.airDivision.air2.quantity * 5 +
        target.airDivision.air3.quantity * 5 +
        target.airDivision.air4.quantity * 5;
      //
      target.seaDivision.attackPts =
        target.seaDivision.sea1.quantity * 10 +
        target.seaDivision.sea2.quantity * 20 +
        target.seaDivision.sea3.quantity * 30 +
        target.seaDivision.sea4.quantity * 40;
      target.seaDivision.defencePts =
        target.seaDivision.sea1.quantity * 5 +
        target.seaDivision.sea2.quantity * 5 +
        target.seaDivision.sea3.quantity * 5 +
        target.seaDivision.sea4.quantity * 5;

      target.networth =
        1000 +
        target.buildings.intelligenceCamp.quantity * 100 +
        target.buildings.infantryCamp.quantity * 100 +
        target.buildings.airField.quantity * 100 +
        target.buildings.navalBase.quantity * 100 +
        target.intelligenceDivision.recons * networthUnits.recons +
        target.intelligenceDivision.commandos * networthUnits.commando +
        target.infantryDivision.infantry1.quantity * networthUnits.infantry1 +
        target.infantryDivision.infantry2.quantity * networthUnits.infantry2 +
        target.infantryDivision.infantry3.quantity * networthUnits.infantry3 +
        target.infantryDivision.infantry4.quantity * networthUnits.infantry4 +
        target.airDivision.air1.quantity * networthUnits.air1 +
        target.airDivision.air2.quantity * networthUnits.air2 +
        target.airDivision.air3.quantity * networthUnits.air3 +
        target.airDivision.air4.quantity * networthUnits.air4 +
        target.seaDivision.sea1.quantity * networthUnits.sea1 +
        target.seaDivision.sea2.quantity * networthUnits.sea2 +
        target.seaDivision.sea3.quantity * networthUnits.sea3 +
        target.seaDivision.sea4.quantity * networthUnits.sea4;
      target.AnDLogs.unshift({
        type: 'Defend',
        from: actionData.user,
        result: 'Success',
        description:
          'Destroyed 5% of enemy attacking units. Lost 1% of your military.',
        date: DateTime.local()
          .setZone(dateSetting.timezone)
          .setLocale(dateSetting.locale)
          .toFormat(dateSetting.format),
      });
    }
    await user.save();
    await target.save();
    //await ActionsQueue.findByIdAndDelete(actionData._id);
  } catch (err) {
    return err;
  }
};

module.exports = { attack };
