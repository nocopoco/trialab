const express = require('express');
const ItemsModel = require('../models/ItemsModel');
const checkToken = require('../checkToken');

const router = express.Router();

router.post('/insert-item-list', async (req, res) => {
  try {
    const itemsList = new ItemsModel(req.body);
    await itemsList.save();
    res.json(itemsList);
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

router.get('/getall', checkToken, async (req, res) => {
  try {
    const result = await ItemsModel.find({ email: req.email });
    res.json(result);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
