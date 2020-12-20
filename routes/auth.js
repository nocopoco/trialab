const express = require('express');
const UserModel = require('../models/UserModel');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('GET AUTH');
});

router.post('/register', async (req, res) => {
  res.json(req.body);
});

module.exports = router;
