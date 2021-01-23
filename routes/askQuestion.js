const express = require('express');
const QuestionModel = require('../models/QuestionModel');
const checkToken = require('../checkToken');
const { DateTime } = require('luxon');

const dateSetting = {
  timezone: 'Asia/Singapore',
  locale: 'en-US',
  format: 'FF',
  localeString: DateTime.DATETIME_FULL_WITH_SECONDS,
};

const router = express.Router();

router.post('/sendQuestion', checkToken, async (req, res) => {
  try {
    const qns = new QuestionModel({
      user: req.id,
      question: req.body.question,
      askingWho: req.body.to,
      date: DateTime.local()
        .setZone(dateSetting.timezone)
        .setLocale(dateSetting.locale)
        .toFormat(dateSetting.format),
    });
    await qns.save();
    res.json('OK');
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

router.get('/getQuestions/:name', async (req, res) => {
  try {
    const result = await QuestionModel.find({
      askingWho: req.params.name,
      proper: true,
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

module.exports = router;
