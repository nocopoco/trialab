const mongoose = require('mongoose');

const FeedbackScheme = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  feedback: {
    type: String,
    required: true,
  },
  date: {
    type: String,
  },
});

const Feedback = mongoose.model('Feedback', FeedbackScheme);
module.exports = Feedback;
