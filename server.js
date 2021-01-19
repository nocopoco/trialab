const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('config');
const path = require('path');
const { startTicker } = require('./serverStuff');

const app = express();
const port = process.env.PORT || 8888;

// bodyParser to read req.body (json)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

//Connect to mongoDB ATLAS
const connectDB = async () => {
  try {
    await mongoose.connect(config.get('connection'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log('MongoDB Connected....');
    startTicker(true);
  } catch (err) {
    console.error(err.message);
    //EXIT PROCESS WITH FAILURE
    process.exit(1);
  }
};

connectDB();

//Our routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/items', require('./routes/items'));
app.use('/api/controlpanel', require('./routes/controlpanel'));
app.use('/api/post', require('./routes/post'));
app.use('/api/users', require('./routes/users'));
app.use('/api/actions', require('./routes/actions'));

////////////

app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
