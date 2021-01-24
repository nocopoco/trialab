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
    const array = ['@u.nus.edu', '@e.ntu.edu.sg', '@smu.edu.sg'];
    const checkIfUserExists = await UserModel.findOne({
      email: req.body.email,
    });
    const index = req.body.email.indexOf('@');
    const result = req.body.email.slice(index);
    let schol = '';

    const findSchool = array.find((element) => element === result);
    if (findSchool === undefined) {
      return res.status(500).json({ msg: 'Only NUS,NTU and SMU for now.' });
    }

    if (result === '@u.nus.edu') {
      schol = 'National University of Singapore';
    }

    if (result === '@e.ntu.edu.sg') {
      schol = 'Nanyang Technological University';
    }
    if (result === '@smu.edu.sg') {
      schol = 'Singapore Management University';
    }

    //result != '@e.ntu.edu.sg' ||
    //result != '@smu.edu.sg'
    if (!checkIfUserExists) {
      const newUser = new UserModel(req.body);
      const passwordHash = bcrypt.hashSync(req.body.password, 10);
      newUser.password = passwordHash;
      newUser.name = req.body.name;
      newUser.email = req.body.email;
      newUser.school = schol;
      newUser.country = 'Singapore';
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

    res.status(500).json({ msg: 'Email exists' });
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
