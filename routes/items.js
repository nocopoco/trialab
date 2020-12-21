const express = require('express');
const ItemsModel = require('../models/ItemsModel');

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

router.get('/get', async (req, res) => {
  try {
    const result = await ItemsModel.find({ userObj: req.body.id }).populate(
      'userObj'
    );
    console.log(result);
    res.json(result);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
