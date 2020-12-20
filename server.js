const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 8888;

// bodyParser to read req.body (json)
app.use(bodyParser.json());

/*
app.get('/', (req, res) => {
  res.send('Hello AB');
});
*/

//Our routes
app.use('/api/auth', require('./routes/auth'));

////////////
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
