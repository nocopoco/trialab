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
    const {
      homes,
      moneyGenerator,
      intelDiv,
      armyCamp,
      airField,
      navalBase,
    } = req.body;
    const checkForEnufMoney =
      homes * 500 +
        moneyGenerator * 500 +
        intelDiv * 500 +
        armyCamp * 500 +
        airField * 500 +
        navalBase * 500 <=
      user.money;
    const checkForEnufLand =
      homes * 10 +
        moneyGenerator * 10 +
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
      homes * 10 +
      moneyGenerator * 10 +
      intelDiv * 10 +
      armyCamp * 10 +
      airField * 10 +
      navalBase * 10;

    //
    user.money -=
      homes * 500 +
      moneyGenerator * 500 +
      intelDiv * 500 +
      armyCamp * 500 +
      airField * 500 +
      navalBase * 500;
    if (homes > 0) {
      const build = new ActionsQueue({
        user: req.id,
        type: 'building',
        doneInWhatTick: 1,
        creation: {
          name: 'home',
          amount: homes,
        },
        date: DateTime.local()
          .setZone(dateSetting.timezone)
          .setLocale(dateSetting.locale)
          .toFormat(dateSetting.format),
      });
      await user.save();
      await build.save();
    }
    if (moneyGenerator > 0) {
      const build = new ActionsQueue({
        user: req.id,
        type: 'building',
        doneInWhatTick: 1,
        creation: {
          name: 'moneyGenerator',
          amount: moneyGenerator,
        },
        date: DateTime.local()
          .setZone(dateSetting.timezone)
          .setLocale(dateSetting.locale)
          .toFormat(dateSetting.format),
      });
      await user.save();
      await build.save();
    }
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
        infantryDiv.infantryTwo * 200 +
        infantryDiv.infantryThree * 300 +
        infantryDiv.infantryFour * 400 +
        airDiv.airOne * 100 +
        airDiv.airTwo * 200 +
        airDiv.airThree * 300 +
        airDiv.airFour * 400 +
        navalDiv.seaOne * 100 +
        navalDiv.seaTwo * 200 +
        navalDiv.seaThree * 300 +
        navalDiv.seaFour * 400 <=
      user.money;
    if (!checkifenufmoney) {
      return res.status(500).json({ msg: 'Not enough money.' });
    }
    const intel = Object.entries(intelligenceDiv);
    for (i = 0; i < intel.length; i++) {
      if (intel[i][1] > 0) {
        user.buildings.intelligenceCamp.usedSpace += intel[i][1] * 1;
        user.buildings.intelligenceCamp.availableSpace -= intel[i][1] * 1;
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
        user.buildings.infantryCamp.usedSpace += infantry[i][1] * 1;
        user.buildings.infantryCamp.availableSpace -= infantry[i][1] * 1;
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
        user.buildings.airField.usedSpace += air[i][1] * 1;
        user.buildings.airField.availableSpace -= air[i][1] * 1;
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
        user.buildings.navalBase.usedSpace += naval[i][1] * 1;
        user.buildings.navalBase.availableSpace -= naval[i][1] * 1;
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
      infantryDiv.infantryTwo * 200 +
      infantryDiv.infantryThree * 300 +
      infantryDiv.infantryFour * 400 +
      airDiv.airOne * 100 +
      airDiv.airTwo * 200 +
      airDiv.airThree * 300 +
      airDiv.airFour * 400 +
      navalDiv.seaOne * 100 +
      navalDiv.seaTwo * 200 +
      navalDiv.seaThree * 300 +
      navalDiv.seaFour * 400;
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
    const cost = {
      infantry1: 500,
      infantry2: 600,
      infantry3: 700,
      infantry4: 800,
      air1: 500,
      air2: 600,
      air3: 700,
      air4: 800,
      sea1: 500,
      sea2: 600,
      sea3: 700,
      sea4: 800,
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
      totalAttackPts += infantryDiv.infantryOne * attackp.infantry1;
      totalCost += infantryDiv.infantryOne * cost.infantry1;
    }
    if (infantryDiv.infantryTwo > 0) {
      forces.push({
        name: 'infantryTwo',
        type: 'infantry',
        amount: infantryDiv.infantryTwo,
      });
      user.infantryDivision.infantry2.quantity -= infantryDiv.infantryTwo;
      totalAttackPts += infantryDiv.infantryTwo * attackp.infantry2;
      totalCost += infantryDiv.infantryTwo * cost.infantry2;
    }
    if (infantryDiv.infantryThree > 0) {
      forces.push({
        name: 'infantryThree',
        type: 'infantry',
        amount: infantryDiv.infantryThree,
      });
      user.infantryDivision.infantry3.quantity -= infantryDiv.infantryThree;
      totalAttackPts += infantryDiv.infantryThree * attackp.infantry3;
      totalCost += infantryDiv.infantryThree * cost.infantry3;
    }
    if (infantryDiv.infantryFour > 0) {
      forces.push({
        name: 'infantryFour',
        type: 'infantry',
        amount: infantryDiv.infantryFour,
      });
      user.infantryDivision.infantry4.quantity -= infantryDiv.infantryFour;
      totalAttackPts += infantryDiv.infantryFour * attackp.infantry4;
      totalCost += infantryDiv.infantryFour * cost.infantry4;
    }

    if (airDiv.airOne > 0) {
      forces.push({
        name: 'airOne',
        type: 'air',
        amount: airDiv.airOne,
      });
      user.airDivision.air1.quantity -= airDiv.airOne;
      totalAttackPts += airDiv.airOne * attackp.air1;
      totalCost += airDiv.airOne * cost.air1;
    }
    if (airDiv.airTwo > 0) {
      forces.push({
        name: 'airTwo',
        type: 'air',
        amount: airDiv.airTwo,
      });
      user.airDivision.air2.quantity -= airDiv.airTwo;
      totalAttackPts += airDiv.airTwo * attackp.air2;
      totalCost += airDiv.airTwo * cost.air2;
    }
    if (airDiv.airThree > 0) {
      forces.push({
        name: 'airThree',
        type: 'air',
        amount: airDiv.airThree,
      });
      user.airDivision.air3.quantity -= airDiv.airThree;
      totalAttackPts += airDiv.airThree * attackp.air3;
      totalCost += airDiv.airTwo * cost.air3;
    }
    if (airDiv.airFour > 0) {
      forces.push({
        name: 'airFour',
        type: 'air',
        amount: airDiv.airFour,
      });
      user.airDivision.air4.quantity -= airDiv.airFour;
      totalAttackPts += airDiv.airFour * attackp.air4;
      totalCost += airDiv.airFour * cost.air4;
    }

    if (navalDiv.seaOne > 0) {
      forces.push({
        name: 'seaOne',
        type: 'naval',
        amount: navalDiv.seaOne,
      });
      user.seaDivision.sea1.quantity -= navalDiv.seaOne;
      totalAttackPts += navalDiv.seaOne * attackp.sea1;
      totalCost += navalDiv.seaOne * cost.sea1;
    }
    if (navalDiv.seaTwo > 0) {
      forces.push({
        name: 'seaTwo',
        type: 'naval',
        amount: navalDiv.seaTwo,
      });
      user.seaDivision.sea2.quantity -= navalDiv.seaTwo;
      totalAttackPts += navalDiv.seaTwo * attackp.sea2;
      totalCost += navalDiv.seaTwo * cost.sea2;
    }
    if (navalDiv.seaThree > 0) {
      forces.push({
        name: 'seaThree',
        type: 'naval',
        amount: navalDiv.seaThree,
      });
      user.seaDivision.sea3.quantity -= navalDiv.seaThree;
      totalAttackPts += navalDiv.seaThree * attackp.sea3;
      totalCost += navalDiv.seaThree * cost.sea3;
    }
    if (navalDiv.seaFour > 0) {
      forces.push({
        name: 'seaFour',
        type: 'naval',
        amount: navalDiv.seaFour,
      });
      user.seaDivision.sea4.quantity -= navalDiv.seaFour;
      totalAttackPts += navalDiv.seaFour * attackp.sea4;
      totalCost += navalDiv.seaFour * cost.sea4;
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

router.post('/sendcommandos', checkToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.id);
    const checkifenufcommandos =
      req.body.commando <= user.intelligenceDivision.commandos;
    if (!checkifenufcommandos) {
      return res.status(500).json({ msg: 'You dont have that many units.' });
    }
    user.intelligenceDivision.commandos -= req.body.commando;
    const action = new ActionsQueue({
      user: req.id,
      type: 'sabotage',
      doneInWhatTick: 1,
      target: req.body.target,
      forces: [
        {
          name: 'commando',
          type: 'sabotage',
          amount: req.body.commando,
        },
      ],
      date: DateTime.local()
        .setZone(dateSetting.timezone)
        .setLocale(dateSetting.locale)
        .toFormat(dateSetting.format),
    });
    await user.save();
    await action.save();
    res.json('ok');
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

router.get('/getsabotagetasks', checkToken, async (req, res) => {
  try {
    const tasks = await ActionsQueue.find({
      user: req.id,
      type: 'sabotage',
    })
      .populate('target')
      .sort({ date: 'desc' });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

router.get('/getsabotagemissions', checkToken, async (req, res) => {
  try {
    const missions = await UserModel.find({
      _id: req.id,
    }).populate('intelligenceDivision.sabotages.target');
    res.json(missions);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});
module.exports = router;
