const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  coverage: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
  },
});

const Items = mongoose.model('Posts', PostSchema);
module.exports = Items;
