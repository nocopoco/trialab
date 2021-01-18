const jwt = require('jsonwebtoken');
const config = require('config');

const checkToken = (req, res, next) => {
  // get authcookie from request
  const authcookie = req.cookies.authcookie;

  //verify token which is in cookie value
  jwt.verify(authcookie, config.get('secretToken'), (err, data) => {
    if (err) {
      res.status(403).json(err.message);
    } else if (data.user) {
      req.id = data.id;
      req.email = data.email;
      next();
    }
  });
};

module.exports = checkToken;
