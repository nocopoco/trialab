const mongoose = require('mongoose');

const QuestionModel = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  question: {
    type: String,
    required: true,
  },
  askingWho: {
    type: String,
    required: true,
  },
  reply: {
    type: String,
  },
  proper: {
    type: Boolean,
    default: false,
  },
  date: {
    type: String,
  },
});

const Question = mongoose.model('QuestionTable', QuestionModel);
module.exports = Question;
