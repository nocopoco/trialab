const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('config');
const app = express();
const port = process.env.PORT || 8888;

// bodyParser to read req.body (json)
app.use(bodyParser.json());

//Connect to mongoDB ATLAS
mongoose.connect(config.get('connection'), {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

/*
app.get('/', (req, res) => {
  res.send('Hello AB');
});
*/

//Our routes
app.use('/api/auth', require('./routes/auth'));
//app.use('/api/test', require('./routes/foodRoute'));

////////////
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
