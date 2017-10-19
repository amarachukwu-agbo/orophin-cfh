const validateUserFields = (req, res, next) => {
  // check if username field is empty
  if (!req.body.name || req.body.name.trim() === '') {
    return res.status(400).send({ message: 'name field cannot be empty' });
  }
  // check if password field is empty
  if (!req.body.password || req.body.password.trim() === '') {
    return res.status(400).send({ message: 'password field cannot be empty' });
  }
  // check if email field is empty
  if (!req.body.email || req.body.email.trim() === '') {
    return res.status(400).send({ message: 'email field cannot be empty' });
  }
  // check if username field contains more than 3 characters
  if (req.body.name.length < 4) {
    return res.status(400).send({ message: 'name field must have more than 3 characters' });
  }
  // check if password field contains more than 3 characters
  if (req.body.password.length < 4) {
    return res.status(400).send({ message: 'password field must have more than 3 characters' });
  }
  return next();
};

module.exports = validateUserFields;
