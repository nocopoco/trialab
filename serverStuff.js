const express = require('express');
const serverTicker = require('./models/ServerTickModel');
const actionQueue = require('./models/ActionsQueue');
const { DateTime } = require('luxon');
const { explore } = require('./actions/exploration');
const { build } = require('./actions/building');
const { military } = require('./actions/military');
const { attack } = require('./actions/attack');
const { intel } = require('./actions/intel');

//const router = express.Router();

const dateSetting = {
  timezone: 'Asia/Singapore',
  locale: 'en-US',
  format: 'FF',
  localeString: DateTime.DATETIME_FULL_WITH_SECONDS,
};

let serverDoneTicking = { done: false };

const plusServerTicker = async () => {
  try {
    if (!serverDoneTicking.done) {
      serverDoneTicking.done = true;

      console.log(
        'Tick processing => ',
        DateTime.local()
          .setZone(dateSetting.timezone)
          .setLocale(dateSetting.locale)
          .toFormat(dateSetting.format)
      );
      const incServerTicker = await serverTicker.findOneAndUpdate(
        null,
        {
          $inc: { tick: 1 },
        },
        { new: true }
      );
      await actionQueue.updateMany(null, {
        $inc: { doneInWhatTick: -1 },
      });
      const getQueue = await actionQueue.find({ doneInWhatTick: 0 });
      //await explore(getQueue[0]);
      //await explore(getQueue[1]);
      for (i = 0; i < getQueue.length; i++) {
        if (getQueue[i].type === 'explore') {
          await explore(getQueue[i]);
        }
        if (getQueue[i].type === 'building') {
          await build(getQueue[i]);
        }
        if (getQueue[i].type === 'military') {
          await military(getQueue[i]);
        }
        if (getQueue[i].type === 'attack') {
          await attack(getQueue[i]);
        }
        if (getQueue[i].type === 'intel') {
          await intel(getQueue[i]);
        }
      }
      console.log('[Tick complete] Current Server Ticker: ', incServerTicker);
    }
  } catch (err) {
    return err;
  }
};
const getTime = () => {
  const now = DateTime.local()
    .setZone('Asia/Singapore')
    .setLocale('en-US')
    .toFormat('m');

  if (now === '30' || now === '27') {
    plusServerTicker();
  }
  //0 > x < 60
  else if (parseInt(now) > 0 && parseInt(now) < 60 && serverDoneTicking.done) {
    serverDoneTicking.done = false;
    console.log('serverDoneTicking From getTime(): ', serverDoneTicking.done);
  }
};

let testFunc;
const startTicker = (start) => {
  if (start) {
    testFunc = setInterval(() => {
      getTime();
    }, 1000);
    console.log('Tick Started');
  } else {
    clearInterval(testFunc);
  }
};

module.exports = {
  startTicker,
};
