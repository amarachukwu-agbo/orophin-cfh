/**
  * Module dependencies.
  */
const mongoose = require('mongoose'),
  Game = mongoose.model('Game');

/**
 * @description get leaderBoard  data
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @return {*} void
 */
module.exports.getLeaderBoard = (req, res) => {
  Game.aggregate([
    {
      $group: {
        _id: '$gameID',
        gameID: { $first: '$gameID' },
        userId: { $first: '$userID' },
        gameWinner: { $first: '$gameWinner' }
      }
    }
  ], (err, leaderBoard) => {
    if (err) {
      return res.status(500).send({ err });
    }
    const leaderBoardData = leaderBoard.map(data => data.gameWinner);
    const newleaderBoardData = {};
    leaderBoardData.forEach((item) => {
      if (typeof newleaderBoardData[item] === 'number') {
        newleaderBoardData[item] += 1;
      } else {
        newleaderBoardData[item] = 1;
      }
    });
    return res.status(200).send({
      message: 'Leaderboard retrieved Successfully',
      leaderBoard: newleaderBoardData
    });
  });
};
