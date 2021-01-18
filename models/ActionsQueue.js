const mongoose = require('mongoose');

const ActionsQueueSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  type: {
    type: String,
    required: true,
  },
  doneInWhatTick: {
    type: Number,
    required: true,
  },
  creation: {
    name: {
      type: String,
    },
    type: {
      type: String,
    },
    amount: {
      type: Number,
    },
  },
  target: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  totalPower: {
    type: Number,
  },
  forces: [
    {
      name: {
        type: String,
      },
      type: {
        type: String,
      },
      amount: {
        type: Number,
      },
    },
  ],
  date: {
    type: String,
  },
});

const ActionsQueue = mongoose.model('ActionsQueue', ActionsQueueSchema);
module.exports = ActionsQueue;
