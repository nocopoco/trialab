const express = require('express');
const UserModel = require('../models/UserModel');
const Feedback = require('../models/FeedbackModel');
const checkToken = require('../checkToken');
const { DateTime } = require('luxon');

const dateSetting = {
  timezone: 'Asia/Singapore',
  locale: 'en-US',
  format: 'FF',
  localeString: DateTime.DATETIME_FULL_WITH_SECONDS,
};

const router = express.Router();
//Get all users
router.get('/getusers', async (req, res) => {
  try {
    const users = await UserModel.find(
      null,
      '_id name networth school country land'
    ).sort({ networth: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});
router.get('/getmyself', checkToken, async (req, res) => {
  try {
    const me = await UserModel.findById(req.id);
    res.json(me);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});
//get specific user
router.get('/getuser/:id', async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});
router.get('/getnews', checkToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.id)
      .select('AnDLogs')
      .populate('AnDLogs.from', 'name');
    user.AnDLogs.forEach((log) => {
      log.read = true;
    });
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});
//get unread news count
router.get('/geturnewscount', checkToken, async (req, res) => {
  try {
    const result = await UserModel.findById(req.id, 'AnDLogs');
    const lol = result.AnDLogs.filter((log) => log.read === false);
    res.json(lol.length);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});
//Message other user
router.post('/messageUser/:id', checkToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    const messageStructure = req.body;
    messageStructure.from = req.id;
    messageStructure.date = DateTime.local()
      .setZone(dateSetting.timezone)
      .setLocale(dateSetting.locale)
      .toFormat(dateSetting.format);
    user.messages.unshift(messageStructure);
    await user.save();
    res.json(user.messages);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});
//get messages
router.get('/messages', checkToken, async (req, res) => {
  try {
    const userMsgs = await UserModel.findById(req.id)
      .select('messages')
      .populate('messages.from', 'name');
    console.log(userMsgs);
    userMsgs.messages.forEach((msg) => {
      msg.read = true;
    });
    await userMsgs.save();
    res.json(userMsgs);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

//get unread messages count
router.get('/geturmessagescount', checkToken, async (req, res) => {
  try {
    const result = await UserModel.findById(req.id, 'messages');
    const lol = result.messages.filter((msg) => msg.read === false);
    res.json(lol.length);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

//post userProfile
router.post('/pushprofiledata', checkToken, async (req, res) => {
  try {
    const profileStructure = {
      name: req.body.name,
      bio: req.body.bio,
      skillsets: req.body.skills,
      experiences: req.body.experiences,
      social: {
        youtube: req.body.socialmedias
          ? req.body.socialmedias.youtube
            ? req.body.socialmedias.youtube
            : ''
          : '',
        twitter: req.body.socialmedias
          ? req.body.socialmedias.twitter
            ? req.body.socialmedias.twitter
            : ''
          : '',
        facebook: req.body.socialmedias
          ? req.body.socialmedias.facebook
            ? req.body.socialmedias.facebook
            : ''
          : '',
        instagram: req.body.socialmedias
          ? req.body.socialmedias.instagram
            ? req.body.socialmedias.instagram
            : ''
          : '',
      },
      website: req.body.website,
      company: req.body.company,
    };
    console.log(req.body);
    const yourProfile = await UserModel.findById(req.id);
    yourProfile.name = profileStructure.name;
    yourProfile.bio = profileStructure.bio;
    yourProfile.skillsets = profileStructure.skillsets;
    yourProfile.experiences = profileStructure.experiences;
    yourProfile.social = profileStructure.social;
    yourProfile.website = profileStructure.website;
    await yourProfile.save();
    res.json(yourProfile);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

router.post('/feedback', checkToken, async (req, res) => {
  try {
    const fdbck = new Feedback();
    /*date: DateTime.local()
        .setZone(dateSetting.timezone)
        .setLocale(dateSetting.locale)
        .toFormat(dateSetting.format), */
    fdbck.user = req.id;
    fdbck.feedback = req.body.feedback;
    fdbck.date = DateTime.local()
      .setZone(dateSetting.timezone)
      .setLocale(dateSetting.locale)
      .toFormat(dateSetting.format);
    await fdbck.save();
    res.json(fdbck);
  } catch (err) {
    console.log('error');
    res.status(500).json({ msg: err });
  }
});

module.exports = router;
