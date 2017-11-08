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

/**
 * @description retrieve user game log
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @return {*} void
 */
module.exports.getGameLog = (req, res) => {
  Game.find({
    userID: req.decoded.user._id
  }).exec((err, getGameLog) => {
    if (err) {
      return res.status(500).json({ err });
    } if (getGameLog.length === 0) {
      return res.status(404).json({ message: 'User does not have any game record' });
    }
    return res.status(200).json({
      message: 'User game-logs retrieved successfully',
      getGameLog
    });
  });
};
