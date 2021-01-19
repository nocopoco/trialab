const express = require('express');
const PostModel = require('../models/PostModel');
const checkToken = require('../checkToken');
const { DateTime } = require('luxon');

const dateSetting = {
  timezone: 'Asia/Singapore',
  locale: 'en-US',
  format: 'FF',
  localeString: DateTime.DATETIME_FULL_WITH_SECONDS,
};

const router = express.Router();

router.post('/post', checkToken, async (req, res) => {
  try {
    //console.log('id', req.id);
    //console.log('body', req.body);
    console.log(req.body);
    const postStructure = {
      userID: req.id,
      coverage: req.body.coverage,
      school: req.body.school,
      name: req.body.name,
      text: req.body.text.content,
      date: DateTime.local()
        .setZone(dateSetting.timezone)
        .setLocale(dateSetting.locale)
        .toFormat(dateSetting.format),
    };
    const post = new PostModel(postStructure);
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

router.get('/getallposts', async (req, res) => {
  try {
    const posts = await PostModel.find().sort({ date: 'desc' });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

module.exports = router;
