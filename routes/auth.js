const express = require('express');
const UserModel = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const checkToken = require('../checkToken');
const { DateTime } = require('luxon');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const checkIfUserExists = await UserModel.findOne({
      email: req.body.email,
    });
    if (!checkIfUserExists) {
      const newUser = new UserModel(req.body);
      const passwordHash = bcrypt.hashSync(req.body.password, 10);
      newUser.password = passwordHash;
      console.log(newUser);
      //create JWT token
      const token = jwt.sign(
        { email: newUser.email, id: newUser.id },
        config.get('secretToken')
      );
      //save token in cookie
      res.cookie('authcookie', token, {
        maxAge: 1000000000,
        httpOnly: true,
      });
      await newUser.save();
      return res.json(newUser);
    }
    res.status(500).json({ email: 'Email exists' });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    const verified = bcrypt.compareSync(req.body.password, user.password);

    if (user && verified) {
      //create JWT token
      const token = jwt.sign(
        { user: user.email, id: user.id },
        config.get('secretToken')
      );
      //save token in cookie
      res.cookie('authcookie', token, {
        maxAge: 1000000000,
        httpOnly: true,
      });
      res.json(user);
    } else {
      res.status(500).json('Invalid');
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
});

router.get('/getuser', checkToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.id);
    if (user) {
      res.json(user);
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
});

router.get('/startTime', (req, res) => {
  const data = getTime();
  lol(true);
  res.json(data);
});

module.exports = router;
