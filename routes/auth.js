const express = require('express');
const UserModel = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const checkToken = require('../checkToken');

const router = express.Router();

router.get('/', (req, res) => {
  console.log('TESRING: ' + process.env.TESTING);
  res.send('GET AUTH');
});

router.post('/register', async (req, res) => {
  try {
    const newUser = new UserModel(req.body);
    const passwordHash = bcrypt.hashSync(req.body.password, 10);
    newUser.password = passwordHash;
    console.log(newUser);
    await newUser.save();
    res.json(newUser);
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
      const token = jwt.sign({ user: user.id }, config.get('secretToken'));
      //save token in cookie
      res.cookie('authcookie', token, { maxAge: 900000000, httpOnly: true });
      res.json(user);
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
});

router.get('/getmoney', checkToken, (req, res) => {
  res.json('No Prob');
});

module.exports = router;
