const UserModel = require('../models/UserModel');
const ActionsQueue = require('../models/ActionsQueue');
const { DateTime } = require('luxon');

const dateSetting = {
  timezone: 'Asia/Singapore',
  locale: 'en-US',
  format: 'FF',
  localeString: DateTime.DATETIME_FULL_WITH_SECONDS,
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

//If attack succeeds => destroy 5%  of land, and military. You will gain 5% of the land, lose 1% of your units sent.
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
        target.infantryDivision.infantry1.quantity * attackp.infantry1 +
        target.infantryDivision.infantry2.quantity * attackp.infantry2 +
        target.infantryDivision.infantry3.quantity * attackp.infantry3 +
        target.infantryDivision.infantry4.quantity * attackp.infantry3;
      target.infantryDivision.defencePts =
        target.infantryDivision.infantry1.quantity * defencep.infantry1 +
        target.infantryDivision.infantry2.quantity * defencep.infantry2 +
        target.infantryDivision.infantry3.quantity * defencep.infantry3 +
        target.infantryDivision.infantry4.quantity * defencep.infantry4;

      target.airDivision.attackPts =
        target.airDivision.air1.quantity * attackp.air1 +
        target.airDivision.air2.quantity * attackp.air2 +
        target.airDivision.air3.quantity * attackp.air3 +
        target.airDivision.air4.quantity * attackp.air4;
      target.airDivision.defencePts =
        target.airDivision.air1.quantity * defencep.air1 +
        target.airDivision.air2.quantity * defencep.air2 +
        target.airDivision.air3.quantity * defencep.air3 +
        target.airDivision.air4.quantity * defencep.air4;

      target.seaDivision.attackPts =
        target.seaDivision.sea1.quantity * attackp.sea1 +
        target.seaDivision.sea2.quantity * attackp.sea2 +
        target.seaDivision.sea3.quantity * attackp.sea3 +
        target.seaDivision.sea4.quantity * attackp.sea4;
      target.seaDivision.defencePts =
        target.seaDivision.sea1.quantity * defencep.sea1 +
        target.seaDivision.sea2.quantity * defencep.sea2 +
        target.seaDivision.sea3.quantity * defencep.sea3 +
        target.seaDivision.sea4.quantity * defencep.sea4;

      target.networth =
        1000 +
        target.buildings.homes * 100 +
        target.buidlings.moneyGenerator * 100 +
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
        user.infantryDivision.infantry1.quantity * attackp.infantry1 +
        user.infantryDivision.infantry2.quantity * attackp.infantry2 +
        user.infantryDivision.infantry3.quantity * attackp.infantry3 +
        user.infantryDivision.infantry4.quantity * attackp.infantry4;
      user.infantryDivision.defencePts =
        user.infantryDivision.infantry1.quantity * defencep.infantry1 +
        user.infantryDivision.infantry2.quantity * defencep.infantry2 +
        user.infantryDivision.infantry3.quantity * defencep.infantry3 +
        user.infantryDivision.infantry4.quantity * defencep.infantry4;

      ////
      user.airDivision.attackPts =
        user.airDivision.air1.quantity * attackp.air1 +
        user.airDivision.air2.quantity * attackp.air2 +
        user.airDivision.air3.quantity * attackp.air3 +
        user.airDivision.air4.quantity * attackp.air4;
      user.airDivision.defencePts =
        user.airDivision.air1.quantity * defencep.air1 +
        user.airDivision.air2.quantity * defencep.air2 +
        user.airDivision.air3.quantity * defencep.air3 +
        user.airDivision.air4.quantity * defencep.air4;

      ///
      user.seaDivision.attackPts =
        user.seaDivision.sea1.quantity * attackp.sea1 +
        user.seaDivision.sea2.quantity * attackp.sea2 +
        user.seaDivision.sea3.quantity * attackp.sea3 +
        user.seaDivision.sea4.quantity * attackp.sea4;
      user.seaDivision.defencePts =
        user.seaDivision.sea1.quantity * defencep.sea1 +
        user.seaDivision.sea2.quantity * defencep.sea2 +
        user.seaDivision.sea3.quantity * defencep.sea3 +
        user.seaDivision.sea4.quantity * defencep.sea4;

      user.networth =
        1000 +
        user.buildings.homes * 100 +
        user.buildings.moneyGenerator * 100 +
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
        description: 'Gained ' + landTaken + ' land.',
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
        user.infantryDivision.infantry1.quantity * attackp.infantry1 +
        user.infantryDivision.infantry2.quantity * attackp.infantry2 +
        user.infantryDivision.infantry3.quantity * attackp.infantry3 +
        user.infantryDivision.infantry4.quantity * attackp.infantry4;
      user.infantryDivision.defencePts =
        user.infantryDivision.infantry1.quantity * defencep.infantry1 +
        user.infantryDivision.infantry2.quantity * defencep.infantry2 +
        user.infantryDivision.infantry3.quantity * defencep.infantry3 +
        user.infantryDivision.infantry4.quantity * defencep.infantry4;
      //
      user.airDivision.attackPts =
        user.airDivision.air1.quantity * attackp.air1 +
        user.airDivision.air2.quantity * attackp.air2 +
        user.airDivision.air3.quantity * attackp.air3 +
        user.airDivision.air4.quantity * attackp.air4;
      user.airDivision.defencePts =
        user.airDivision.air1.quantity * defencep.air1 +
        user.airDivision.air2.quantity * defencep.air2 +
        user.airDivision.air3.quantity * defencep.air3 +
        user.airDivision.air4.quantity * defencep.air4;
      //
      user.seaDivision.attackPts =
        user.seaDivision.sea1.quantity * attackp.sea1 +
        user.seaDivision.sea2.quantity * attackp.sea2 +
        user.seaDivision.sea3.quantity * attackp.sea3 +
        user.seaDivision.sea4.quantity * attackp.sea4;
      user.seaDivision.defencePts =
        user.seaDivision.sea1.quantity * defencep.sea1 +
        user.seaDivision.sea2.quantity * defencep.sea2 +
        user.seaDivision.sea3.quantity * defencep.sea3 +
        user.seaDivision.sea4.quantity * defencep.sea4;

      user.networth =
        1000 +
        user.buildings.homes * 100 +
        user.buidlings.moneyGenerator * 100 +
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
        target.infantryDivision.infantry1.quantity * attackp.infantry1 +
        target.infantryDivision.infantry2.quantity * attackp.infantry2 +
        target.infantryDivision.infantry3.quantity * attackp.infantry3 +
        target.infantryDivision.infantry4.quantity * attackp.infantry4;
      target.infantryDivision.defencePts =
        target.infantryDivision.infantry1.quantity * defencep.infantry1 +
        target.infantryDivision.infantry2.quantity * defencep.infantry2 +
        target.infantryDivision.infantry3.quantity * defencep.infantry3 +
        target.infantryDivision.infantry4.quantity * defencep.infantry4;
      //
      target.airDivision.attackPts =
        target.airDivision.air1.quantity * attackp.air1 +
        target.airDivision.air2.quantity * attackp.air2 +
        target.airDivision.air3.quantity * attackp.air3 +
        target.airDivision.air4.quantity * attackp.air4;
      target.airDivision.defencePts =
        target.airDivision.air1.quantity * defencep.air1 +
        target.airDivision.air2.quantity * defencep.air2 +
        target.airDivision.air3.quantity * defencep.air3 +
        target.airDivision.air4.quantity * defencep.air4;
      //
      target.seaDivision.attackPts =
        target.seaDivision.sea1.quantity * attackp.sea1 +
        target.seaDivision.sea2.quantity * attackp.sea2 +
        target.seaDivision.sea3.quantity * attackp.sea3 +
        target.seaDivision.sea4.quantity * attackp.sea3;
      target.seaDivision.defencePts =
        target.seaDivision.sea1.quantity * defencep.sea1 +
        target.seaDivision.sea2.quantity * defencep.sea2 +
        target.seaDivision.sea3.quantity * defencep.sea3 +
        target.seaDivision.sea4.quantity * defencep.sea4;

      target.networth =
        1000 +
        target.buildings.homes * 100 +
        target.buildings.moneyGenerator * 100 +
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
    await ActionsQueue.findByIdAndDelete(actionData._id);
  } catch (err) {
    return err;
  }
};

module.exports = { attack };
