const mongoose = require('mongoose');

const ServerTickSchema = new mongoose.Schema({
  tick: {
    type: Number,
    required: true,
  },
  running: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const ServerTick = mongoose.model('serverTick', ServerTickSchema);
module.exports = ServerTick;
