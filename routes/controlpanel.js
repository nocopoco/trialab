const express = require('express');
const ServerTick = require('../models/ServerTickModel');
const Items = require('../models/ItemsModel');
const Food = require('../models/FoodModel');
const { startTicker } = require('../serverStuff');
const { DateTime } = require('luxon');

const router = express.Router();
let startTime;
let endTime;

router.get('/getstick', async (req, res) => {
  try {
    const serverTick = await ServerTick.findOne();
    res.json(serverTick);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/createtick', async (req, res) => {
  try {
    const startIt = new ServerTick({
      tick: 0,
    });
    await startIt.save();
    res.json(startIt);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/plusstick', async (req, res) => {
  try {
    const plusServerTicker = await ServerTick.findById(req.body.serverID);

    plusServerTicker.tick = plusServerTicker.tick + 1;
    await plusServerTicker.save();
    res.json(plusServerTicker);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/startTicker', async (req, res) => {
  try {
    startTicker(true);
    startTime = new Date();
    const startServerTicker = await ServerTick.findOneAndUpdate(
      null,
      {
        running: true,
      },
      { new: true }
    );
    console.log('Ticker started...', startServerTicker);
    res.json('Started');
  } catch (err) {
    res.status(500).json(err);
  }
});
router.post('/stopTicker', async (req, res) => {
  try {
    startTicker(false);
    endTime = new Date();
    const endServerTicker = await ServerTick.findOneAndUpdate(
      null,
      {
        running: false,
      },
      { new: true }
    );
    console.log(
      'Ticker ended... ',
      endServerTicker,
      '\n',
      'Start Time: ',
      startTime,
      '\n End Time: ',
      endTime
    );
    res.json('Stopped');
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/testing', async (req, res) => {
  try {
    const testing = await ServerTick.findOneAndUpdate(
      null,
      {
        running: false,
      },
      { new: true }
    );
    await testing.save();
    const newCurrentServerTicker = testing.tick;
    /*const updateItemsTicker = await Items.updateMany(null, {
      $inc: { DTick: -1 },
    });*/
    const getAllItems = await Items.find({ DTick: 0 });
    if (getAllItems.length > 0) {
      for (i = 0; i < getAllItems.length; i++) {
        //Scenario 1: [Offensive] Targetted User, Attack Type, etc -> Retrieve targetted userID then update accordingly
        //Scenario 2: [Utility] Utility Mode, .....
        try {
          const food = await Food.findById('5fdf46c1b44df7218de39403');
          food.calories -= 10;
          await food.save();
          console.log(food);
        } catch (err) {
          res.status(500).json(err.message);
        }
      }
      res.json(getAllItems);
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
});
module.exports = router;
