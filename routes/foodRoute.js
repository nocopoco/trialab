const express = require('express');
const router = express.Router();
const foodModel = require('../models/FoodModel');

router.get('/', (req, res) => {
  res.send('GET FOOD');
});

router.get('/foods', async (req, res) => {
  const foods = await foodModel.find({});
  try {
    res.send(foods);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/food', async (req, res) => {
  const food = new foodModel(req.body);
  try {
    await food.save();
    res.send(food);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
