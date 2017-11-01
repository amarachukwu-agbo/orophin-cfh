/**
 * Module dependencies.
 */
const mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Game = mongoose.model('Game');

/**
 * @description {function} controller function to creage game session
 * @argument {object} req
 * @argument {object} res
 * @return {object} data
 */
exports.createGameLog = (req, res) => {
  if (req.body.gameID) {
    User.findOne({
      _id: req.decoded.user._id
    }).exec((err, existingUser) => {
      if (existingUser) {
        const game = new Game(req.body);
        game.userID = req.decoded.user._id;
        game.save((err) => {
          if (err) {
            return res.status(400).send({
              errors: err.errors,
              message: 'Failed'
            });
          } else if (!err) {
            return res.status(201).send({
              message: 'Game Session Created Successfully',
              game
            });
          }
        });
      } else {
        return res.status(404).send({
          message: 'User doesnt exist exist'
        });
      }
    });
  }
};
