const jwt = require('jsonwebtoken');

const requiresToken = {
  verifyUser(req, res, next) {
    const token = req.headers['x-access-token'] || req.headers.authorization || req.params.token;
    if (!token) {
      return res.status(403).send({
        message: 'No token provided!'
      });
    } else if (token) {
      jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) {
          // return res.status(403).send(err);
          if (err.name === 'TokenExpiredError') {
            return res.send(403, { message: 'expired user authorization token' });
          }
          // check if token is invalid/tampered with
          return res.send(403, { message: 'invalid user authorization token' });
        }
        req.decoded = decoded;
        return next();
      });
    } else {
      res.status(403).send({ message: 'Authentication Unsuccessful!! Token not provided' });
    }
  }
};

module.exports = requiresToken;
