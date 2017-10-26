const loginValidation = (req, res, next) => {
  if (!req.body.auth) {
    return res.status(400).send({ message: 'auth property is required on request body' });
  }
  if (!req.body.auth.email || !req.body.auth.password) {
    return res.status(400).send({ message: 'email and password are required' });
  }
  next();
};

module.exports = loginValidation;
