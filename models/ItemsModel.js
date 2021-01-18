const mongoose = require('mongoose');

const ItemsModel = new mongoose.Schema({
  userObj: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  items: [
    {
      itemName: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      additionalNote: {
        type: String,
      },
    },
  ],
  DTick: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

const Items = mongoose.model('ItemsTable', ItemsModel);
module.exports = Items;
