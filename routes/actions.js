const express = require('express');
const checkToken = require('../checkToken');
const ActionsQueue = require('../models/ActionsQueue');
const UserModel = require('../models/UserModel');
const router = express.Router();
const { DateTime } = require('luxon');

const dateSetting = {
  timezone: 'Asia/Singapore',
  locale: 'en-US',
  format: 'FF',
  localeString: DateTime.DATETIME_FULL_WITH_SECONDS,
};

router.post('/sendexplorer', checkToken, async (req, res) => {
  try {
    console.log(req.body);
    const userMoney = await UserModel.findById(req.id, 'money population');
    const checkifenufmoney = req.body.totalCost <= userMoney.money;
    const checkifenufpopulation =
      req.body.creation.amount <= userMoney.population;
    if (req.body.creation.amount <= 0) {
      return res.status(500).json({ msg: 'Invalid amount.' });
    }
    if (!checkifenufmoney) {
      return res.status(500).json({ msg: 'Not enough money.' });
    }
    if (!checkifenufpopulation) {
      return res.status(500).json({ msg: 'Not population.' });
    }
    userMoney.population -= req.body.creation.amount;
    userMoney.money -= req.body.totalCost;
    await userMoney.save();
    const structureBody = {};
    structureBody.creation = { amount: req.body.creation.amount };
    structureBody.user = req.id;
    structureBody.type = 'explore';
    structureBody.doneInWhatTick = 1;
    structureBody.date = DateTime.local()
      .setZone(dateSetting.timezone)
      .setLocale(dateSetting.locale)
      .toFormat(dateSetting.format);

    const newAction = new ActionsQueue(structureBody);
    await newAction.save();
    res.json(checkifenufmoney);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

router.get('/getexploringtasks', checkToken, async (req, res) => {
  try {
    const tasks = await ActionsQueue.find({
      user: req.id,
      type: 'explore',
    }).sort({ date: 'desc' });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

router.post('/buildbuildings', checkToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.id);
    const { intelDiv, armyCamp, airField, navalBase } = req.body;
    const checkForEnufMoney =
      intelDiv * 500 + armyCamp * 500 + airField * 500 + navalBase * 500 <=
      user.money;
    const checkForEnufLand =
      intelDiv * 10 +
        armyCamp * 10 +
        airField * 10 +
        navalBase * 10 +
        user.landUsed <=
      user.land;
    console.log(checkForEnufMoney);
    if (!checkForEnufLand) {
      return res.status(500).json({ msg: 'Not enough land.' });
    }
    if (!checkForEnufMoney) {
      return res.status(500).json({ msg: 'Not enough money.' });
    }

    user.landUsed +=
      intelDiv * 10 + armyCamp * 10 + airField * 10 + navalBase * 10;

    //
    user.money -=
      intelDiv * 500 + armyCamp * 500 + airField * 500 + navalBase * 500;
    if (intelDiv > 0) {
      const build = new ActionsQueue({
        user: req.id,
        type: 'building',
        doneInWhatTick: 1,
        creation: {
          name: 'intelDept',
          amount: intelDiv,
        },
        date: DateTime.local()
          .setZone(dateSetting.timezone)
          .setLocale(dateSetting.locale)
          .toFormat(dateSetting.format),
      });

      await user.save();
      await build.save();
    }
    if (armyCamp > 0) {
      const build = new ActionsQueue({
        user: req.id,
        type: 'building',
        doneInWhatTick: 1,
        creation: {
          name: 'armyCamp',
          amount: armyCamp,
        },
        date: DateTime.local()
          .setZone(dateSetting.timezone)
          .setLocale(dateSetting.locale)
          .toFormat(dateSetting.format),
      });
      await build.save();
    }
    if (airField > 0) {
      const build = new ActionsQueue({
        user: req.id,
        type: 'building',
        doneInWhatTick: 1,
        creation: {
          name: 'airField',
          amount: airField,
        },
        date: DateTime.local()
          .setZone(dateSetting.timezone)
          .setLocale(dateSetting.locale)
          .toFormat(dateSetting.format),
      });
      await build.save();
    }
    if (navalBase > 0) {
      const build = new ActionsQueue({
        user: req.id,
        type: 'building',
        doneInWhatTick: 1,
        creation: {
          name: 'navalBase',
          amount: navalBase,
        },
        date: DateTime.local()
          .setZone(dateSetting.timezone)
          .setLocale(dateSetting.locale)
          .toFormat(dateSetting.format),
      });
      await build.save();
    }
    res.json('ok');
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

router.get('/getbuildingtasks', checkToken, async (req, res) => {
  try {
    const tasks = await ActionsQueue.find({
      user: req.id,
      type: 'building',
    }).sort({ date: 'desc' });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

router.post('/createmilitary', checkToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.id);
    const { intelligenceDiv, infantryDiv, airDiv, navalDiv } = req.body;
    const checkifenufspaceIntel =
      intelligenceDiv.recon * 1 +
        intelligenceDiv.commando * 1 +
        user.buildings.intelligenceCamp.usedSpace <=
      user.buildings.intelligenceCamp.totalSpace;
    if (!checkifenufspaceIntel) {
      return res.status(500).json({ msg: 'Not enough space [Intelligence]' });
    }
    const checkifenufspaceInfantry =
      infantryDiv.infantryOne * 1 +
        infantryDiv.infantryTwo * 1 +
        infantryDiv.infantryThree * 1 +
        infantryDiv.infantryFour * 1 +
        user.buildings.infantryCamp.usedSpace <=
      user.buildings.infantryCamp.totalSpace;
    if (!checkifenufspaceInfantry) {
      return res.status(500).json({ msg: 'Not enough space [Infantry]' });
    }
    const checkifenufspaceAir =
      airDiv.airOne * 1 +
        airDiv.airTwo * 1 +
        airDiv.airThree * 1 +
        airDiv.airFour * 1 +
        user.buildings.airField.usedSpace <=
      user.buildings.airField.totalSpace;
    if (!checkifenufspaceAir) {
      return res.status(500).json({ msg: 'Not enough space [Air]' });
    }
    const checkifenufspaceSea =
      navalDiv.seaOne * 1 +
        navalDiv.seaTwo * 1 +
        navalDiv.seaThree * 1 +
        navalDiv.seaFour * 1 +
        user.buildings.navalBase.usedSpace <=
      user.buildings.navalBase.totalSpace;
    if (!checkifenufspaceSea) {
      return res.status(500).json({ msg: 'Not enough space [Sea]' });
    }
    const checkifenufmoney =
      intelligenceDiv.recon * 100 +
        intelligenceDiv.commando * 100 +
        infantryDiv.infantryOne * 100 +
        infantryDiv.infantryTwo * 100 +
        infantryDiv.infantryThree * 100 +
        infantryDiv.infantryFour * 100 +
        airDiv.airOne * 100 +
        airDiv.airTwo * 100 +
        airDiv.airThree * 100 +
        airDiv.airFour * 100 +
        navalDiv.seaOne * 100 +
        navalDiv.seaTwo * 100 +
        navalDiv.seaThree * 100 +
        navalDiv.seaFour * 100 <=
      user.money;
    if (!checkifenufmoney) {
      return res.status(500).json({ msg: 'Not enough money.' });
    }
    const intel = Object.entries(intelligenceDiv);
    for (i = 0; i < intel.length; i++) {
      if (intel[i][1] > 0) {
        const build = new ActionsQueue({
          user: req.id,
          type: 'military',
          doneInWhatTick: 1,
          creation: {
            name: intel[i][0],
            amount: intel[i][1],
          },
          date: DateTime.local()
            .setZone(dateSetting.timezone)
            .setLocale(dateSetting.locale)
            .toFormat(dateSetting.format),
        });
        await build.save();
      }
    }
    const infantry = Object.entries(infantryDiv);
    let infantryPwr = 0;
    for (i = 0; i < infantry.length; i++) {
      if (infantry[i][1] > 0) {
        infantryPwr += infantry[i][1] * 500;
        const build = new ActionsQueue({
          user: req.id,
          type: 'military',
          doneInWhatTick: 1,
          creation: {
            name: infantry[i][0],
            amount: infantry[i][1],
          },
          date: DateTime.local()
            .setZone(dateSetting.timezone)
            .setLocale(dateSetting.locale)
            .toFormat(dateSetting.format),
        });

        await build.save();
      }
    }
    const air = Object.entries(airDiv);
    let airPwr = 0;
    for (i = 0; i < air.length; i++) {
      if (air[i][1] > 0) {
        airPwr += air[i][1] * 500;
        const build = new ActionsQueue({
          user: req.id,
          type: 'military',
          doneInWhatTick: 1,
          creation: {
            name: air[i][0],
            amount: air[i][1],
          },
          date: DateTime.local()
            .setZone(dateSetting.timezone)
            .setLocale(dateSetting.locale)
            .toFormat(dateSetting.format),
        });
        await build.save();
      }
    }
    const naval = Object.entries(navalDiv);
    let navalPwr = 0;
    for (i = 0; i < air.length; i++) {
      if (naval[i][1] > 0) {
        navalPwr += naval[i][1] * 500;
        const build = new ActionsQueue({
          user: req.id,
          type: 'military',
          doneInWhatTick: 1,
          creation: {
            name: naval[i][0],
            amount: naval[i][1],
          },
          date: DateTime.local()
            .setZone(dateSetting.timezone)
            .setLocale(dateSetting.locale)
            .toFormat(dateSetting.format),
        });
        await build.save();
      }
    }
    user.money -=
      intelligenceDiv.recon * 100 +
      intelligenceDiv.commando * 100 +
      infantryDiv.infantryOne * 100 +
      infantryDiv.infantryTwo * 100 +
      infantryDiv.infantryThree * 100 +
      infantryDiv.infantryFour * 100 +
      airDiv.airOne * 100 +
      airDiv.airTwo * 100 +
      airDiv.airThree * 100 +
      airDiv.airFour * 100 +
      navalDiv.seaOne * 100 +
      navalDiv.seaTwo * 100 +
      navalDiv.seaThree * 100 +
      navalDiv.seaFour * 100;
    await user.save();

    res.json('ok');
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

router.get('/getmilitarytasks', checkToken, async (req, res) => {
  try {
    const tasks = await ActionsQueue.find({
      user: req.id,
      type: 'military',
    }).sort({ date: 'desc' });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

router.post('/attack', checkToken, async (req, res) => {
  try {
    let forces = [];
    let totalAttackPts = 0;
    let totalCost = 0;
    const user = await UserModel.findById(req.id);

    const { target, infantryDiv, airDiv, navalDiv } = req.body;
    //let checkifenufunitsInfantry = false;
    /*infantryDiv.infantryOne +
        infantryDiv.infantryTwo +
        infantryDiv.infantryThree +
        infantryDiv.infantryFour <=
      user.infantryDivision.infantry1.quantity +
        user.infantryDivision.infantry2.quantity +
        user.infantryDivision.infantry3.quantity +
        user.infantryDivision.infantry4.quantity;*/
    if (infantryDiv.infantryOne > user.infantryDivision.infantry1.quantity) {
      return res
        .status(500)
        .json({ msg: 'You dont have that many unit[InfantryOne]' });
    }
    if (infantryDiv.infantryTwo > user.infantryDivision.infantry2.quantity) {
      return res
        .status(500)
        .json({ msg: 'You dont have that many unit[InfantryTwo]' });
    }
    if (infantryDiv.infantryThree > user.infantryDivision.infantry3.quantity) {
      return res
        .status(500)
        .json({ msg: 'You dont have that many unit[InfantryThree]' });
    }
    if (infantryDiv.infantryFour > user.infantryDivision.infantry4.quantity) {
      return res
        .status(500)
        .json({ msg: 'You dont have that many unit[InfantryFour]' });
    }
    /*const checkifenufunitsAir =
      airDiv.airOne + airDiv.airTwo + airDiv.airThree + airDiv.airFour <=
      user.airDivision.air1.quantity +
        user.airDivision.air2.quantity +
        user.airDivision.air3.quantity +
        user.airDivision.air4.quantity;
    if (!checkifenufunitsAir) {
      return res.status(500).json({ msg: 'You dont have that many unit[Air]' });
    }*/
    if (airDiv.airOne > user.airDivision.air1.quantity) {
      return res
        .status(500)
        .json({ msg: 'You dont have that many unit[airOne]' });
    }
    if (airDiv.airTwo > user.airDivision.air2.quantity) {
      return res
        .status(500)
        .json({ msg: 'You dont have that many unit[airTwo]' });
    }
    if (airDiv.airThree > user.airDivision.air3.quantity) {
      return res
        .status(500)
        .json({ msg: 'You dont have that many unit[airThree]' });
    }
    if (airDiv.airFour > user.airDivision.air4.quantity) {
      return res
        .status(500)
        .json({ msg: 'You dont have that many unit[airFour]' });
    }
    /*const checkifenufunitsNaval =
      navalDiv.seaOne +
        navalDiv.seaTwo +
        navalDiv.seaThree +
        navalDiv.seaFour <=
      user.seaDivision.sea1.quantity +
        user.seaDivision.sea2.quantity +
        user.seaDivision.sea3.quantity +
        user.seaDivision.sea4.quantity;
    if (!checkifenufunitsNaval) {
      return res
        .status(500)
        .json({ msg: 'You dont have that many unit[Naval]' });
    }*/
    if (navalDiv.seaOne > user.seaDivision.sea1.quantity) {
      return res
        .status(500)
        .json({ msg: 'You dont have that many unit[seaOne]' });
    }
    if (navalDiv.seaTwo > user.seaDivision.sea2.quantity) {
      return res
        .status(500)
        .json({ msg: 'You dont have that many unit[seaTwo]' });
    }
    if (navalDiv.seaThree > user.seaDivision.sea3.quantity) {
      return res
        .status(500)
        .json({ msg: 'You dont have that many unit[seaThree]' });
    }
    if (navalDiv.seaFour > user.seaDivision.sea4.quantity) {
      return res
        .status(500)
        .json({ msg: 'You dont have that many unit[seaFour]' });
    }
    if (infantryDiv.infantryOne > 0) {
      forces.push({
        name: 'infantryOne',
        type: 'infantry',
        amount: infantryDiv.infantryOne,
      });
      user.infantryDivision.infantry1.quantity -= infantryDiv.infantryOne;
      totalAttackPts += infantryDiv.infantryOne * 10;
      totalCost += infantryDiv.infantryOne * 500;
    }
    if (infantryDiv.infantryTwo > 0) {
      forces.push({
        name: 'infantryTwo',
        type: 'infantry',
        amount: infantryDiv.infantryTwo,
      });
      user.infantryDivision.infantry2.quantity -= infantryDiv.infantryTwo;
      totalAttackPts += infantryDiv.infantryTwo * 20;
      totalCost += infantryDiv.infantryTwo * 500;
    }
    if (infantryDiv.infantryThree > 0) {
      forces.push({
        name: 'infantryThree',
        type: 'infantry',
        amount: infantryDiv.infantryThree,
      });
      user.infantryDivision.infantry3.quantity -= infantryDiv.infantryThree;
      totalAttackPts += infantryDiv.infantryThree * 30;
      totalCost += infantryDiv.infantryThree * 500;
    }
    if (infantryDiv.infantryFour > 0) {
      forces.push({
        name: 'infantryFour',
        type: 'infantry',
        amount: infantryDiv.infantryFour,
      });
      user.infantryDivision.infantry4.quantity -= infantryDiv.infantryFour;
      totalAttackPts += infantryDiv.infantryFour * 40;
      totalCost += infantryDiv.infantryFour * 500;
    }

    if (airDiv.airOne > 0) {
      forces.push({
        name: 'airOne',
        type: 'air',
        amount: airDiv.airOne,
      });
      user.airDivision.air1.quantity -= airDiv.airOne;
      totalAttackPts += airDiv.airOne * 10;
      totalCost += airDiv.airOne * 500;
    }
    if (airDiv.airTwo > 0) {
      forces.push({
        name: 'airTwo',
        type: 'air',
        amount: airDiv.airTwo,
      });
      user.airDivision.air2.quantity -= airDiv.airTwo;
      totalAttackPts += airDiv.airTwo * 20;
      totalCost += airDiv.airTwo * 500;
    }
    if (airDiv.airThree > 0) {
      forces.push({
        name: 'airThree',
        type: 'air',
        amount: airDiv.airThree,
      });
      user.airDivision.air3.quantity -= airDiv.airThree;
      totalAttackPts += airDiv.airThree * 30;
      totalCost += airDiv.airTwo * 500;
    }
    if (airDiv.airFour > 0) {
      forces.push({
        name: 'airFour',
        type: 'air',
        amount: airDiv.airFour,
      });
      user.airDivision.air4.quantity -= airDiv.airFour;
      totalAttackPts += airDiv.airFour * 40;
      totalCost += airDiv.airFour * 500;
    }

    if (navalDiv.seaOne > 0) {
      forces.push({
        name: 'seaOne',
        type: 'naval',
        amount: navalDiv.seaOne,
      });
      user.seaDivision.sea1.quantity -= navalDiv.seaOne;
      totalAttackPts += navalDiv.seaOne * 10;
      totalCost += navalDiv.seaOne * 500;
    }
    if (navalDiv.seaTwo > 0) {
      forces.push({
        name: 'seaTwo',
        type: 'naval',
        amount: navalDiv.seaTwo,
      });
      user.seaDivision.sea2.quantity -= navalDiv.seaTwo;
      totalAttackPts += navalDiv.seaTwo * 20;
      totalCost += navalDiv.seaTwo * 500;
    }
    if (navalDiv.seaThree > 0) {
      forces.push({
        name: 'seaThree',
        type: 'naval',
        amount: navalDiv.seaThree,
      });
      user.seaDivision.sea3.quantity -= navalDiv.seaThree;
      totalAttackPts += navalDiv.seaThree * 30;
      totalCost += navalDiv.seaThree * 500;
    }
    if (navalDiv.seaFour > 0) {
      forces.push({
        name: 'seaFour',
        type: 'naval',
        amount: navalDiv.seaFour,
      });
      user.seaDivision.sea4.quantity -= navalDiv.seaFour;
      totalAttackPts += navalDiv.seaFour * 40;
      totalCost += navalDiv.seaFour * 500;
    }

    user.infantryDivision.attackPts =
      user.infantryDivision.infantry1.quantity * 10 +
      user.infantryDivision.infantry2.quantity * 20 +
      user.infantryDivision.infantry3.quantity * 30 +
      user.infantryDivision.infantry4.quantity * 40;
    user.airDivision.attackPts =
      user.airDivision.air1.quantity * 10 +
      user.airDivision.air2.quantity * 20 +
      user.airDivision.air3.quantity * 30 +
      user.airDivision.air4.quantity * 40;
    user.seaDivision.attackPts =
      user.seaDivision.sea1.quantity * 10 +
      user.seaDivision.sea2.quantity * 20 +
      user.seaDivision.sea3.quantity * 30 +
      user.seaDivision.sea4.quantity * 40;

    /*const targetTotalDefencePts =
      userTarget.infantryDivision.defencePts +
      userTarget.airDivision.defencePts +
      userTarget.seaDivision.defencePts;*/
    const attack = new ActionsQueue({
      user: req.id,
      type: 'attack',
      doneInWhatTick: 1,
      target: target,
      totalPower: totalAttackPts,
      forces: forces,
      date: DateTime.local()
        .setZone(dateSetting.timezone)
        .setLocale(dateSetting.locale)
        .toFormat(dateSetting.format),
    });
    if (totalCost > user.money) {
      return res.status(500).json({ msg: 'Not enough money.' });
    }
    user.money -= totalCost;
    await user.save();
    await attack.save();
    res.json('ok');
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

router.get('/getattacktasks', checkToken, async (req, res) => {
  try {
    const tasks = await ActionsQueue.find({
      user: req.id,
      type: 'attack',
    })
      .populate('target')
      .sort({ date: 'desc' });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

router.post('/sendrecons', checkToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.id);
    const checkifenufrecons =
      req.body.recon <= user.intelligenceDivision.recons;
    if (!checkifenufrecons) {
      return res.status(500).json({ msg: 'You dont have that many units.' });
    }
    user.intelligenceDivision.recons -= req.body.recon;
    const action = new ActionsQueue({
      user: req.id,
      type: 'intel',
      doneInWhatTick: 1,
      target: req.body.target,
      forces: [
        {
          name: 'recons',
          type: 'intel',
          amount: req.body.recon,
        },
      ],
      date: DateTime.local()
        .setZone(dateSetting.timezone)
        .setLocale(dateSetting.locale)
        .toFormat(dateSetting.format),
    });
    await user.save();
    await action.save();
    res.json({ msg: 'ok' });
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

router.get('/getinteltasks', checkToken, async (req, res) => {
  try {
    const tasks = await ActionsQueue.find({
      user: req.id,
      type: 'intel',
    })
      .populate('target')
      .sort({ date: 'desc' });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

router.get('/getintelreports', checkToken, async (req, res) => {
  try {
    const tasks = await UserModel.find({
      _id: req.id,
    }).populate('intelligenceDivision.intels.target');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

module.exports = router;
