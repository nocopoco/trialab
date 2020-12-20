const express = require('express');
const UserModel = require('../models/UserModel');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const config = require('config');
const checkToken = require('../checkToken');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('GET AUTH');
});

router.post('/register', async (req, res) => {
  const newUser = new UserModel(req.body);
  try {
    await newUser.save();
    res.json(newUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await UserModel.findById(req.body.id);
    if (user) {
      //create JWT token
      const token = jwt.sign({ user: user.name }, config.get('secretToken'));
      //save token in cookie
      res.cookie('authcookie', token, { maxAge: 900000000, httpOnly: true });
      res.json(user);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/getmoney', checkToken, (req, res) => {
  res.json('No Prob');
});

module.exports = router;
