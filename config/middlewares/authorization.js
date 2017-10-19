const jwt = require('jsonwebtoken');

/**
 * Generic require login routing middleware
 */

module.exports = function requiresLogin(req, res, next) {
  const token = req.headers['x-access-token'] || req.headers.authorization || req.params.token;
  if (!token) {
    return res.status(403).send({
      message: 'No token provided!'
    });
  } else if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.status(401).send({ message: 'Token has Expired!' });
      }
      req.decoded = decoded;
      return next();
    });
  } else {
    res.status(403).send({ message: 'Authentication Unsuccessful!! Token not provided' });
  }
};

/**
 * User authorizations routing middleware
 */
exports.user = {
  hasAuthorization (req, res, next) {
    if (req.profile.id != req.user.id) {
      return res.send(401, 'User is not authorized');
    }
    next();
  }
};

/**
 * Article authorizations routing middleware
 */
// exports.article = {
//     hasAuthorization: function(req, res, next) {
//         if (req.article.user.id != req.user.id) {
//             return res.send(401, 'User is not authorized');
//         }
//         next();
//     }
// };
