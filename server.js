const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const config = require('config');
const app = express();
const port = process.env.PORT || 8888;

// bodyParser to read req.body (json)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

//Connect to mongoDB ATLAS
mongoose.connect(config.get('connection'), {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.get('/', (req, res) => {
  res.send('Hello AB');
});

//Our routes
app.use('/api/auth', require('./routes/auth'));
//app.use('/api/test', require('./routes/foodRoute'));

////////////
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
