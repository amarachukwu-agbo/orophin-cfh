/**
  * Module dependencies.
  */
const mongoose = require('mongoose'),
  User = mongoose.model('User');

/**
 * @description get user donations
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @return {*} void
 */
module.exports.getDonations = (req, res) => {
  User.find({
    _id: req.decoded.user._id
  }).exec((err, getDonations) => {
    if (err) {
      return res.status(500).json({ err });
    } if (getDonations) {
      if (getDonations[0].donations.length === 0) {
        return res.status(404).json({ message: 'User has not made any donations' });
      }
      return res.status(200).json({
        message: 'User donations retrieved successfully',
        getDonations: getDonations[0].donations
      });
    }
  });
};
