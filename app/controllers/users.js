/**
 * Module dependencies.
 */
const nodemailer = require('nodemailer');
const mongoose = require('mongoose'),
  User = mongoose.model('User');
const avatars = require('./avatars').all();
const generateToken = require('../helpers/generateToken');

// Auth callback
exports.authCallback = (req, res) => {
  if (!req.user) {
    res.redirect('/#!/signin?error=invalid');
  } else {
    res.cookie('token', generateToken(req.user._id));
    res.redirect('/chooseavatars');
  }
};

// Show login form
exports.signin = (req, res) => {
  if (!req.user) {
    res.redirect('/#!/signin?error=invalid');
  } else {
    res.redirect('/#!/app');
  }
};

// Show signup form
exports.signup = (req, res) => {
  if (!req.user) {
    res.redirect('/#!/signup');
  } else {
    res.redirect('/#!/app');
  }
};

// Logout
exports.signout = (req, res) => {
  req.logout();
  res.redirect('/');
};

// Session
exports.session = (req, res) => {
  res.redirect('/');
};

/**
 * Check avatar - Confirm if the user who logged in via passport
 * already has an avatar. If they don't have one, redirect them
 * to our Choose an Avatar page.
 */

exports.checkAvatar = (req, res) => {
  if (req.user && req.user._id) {
    User.findOne({
      _id: req.user._id
    })
      .exec((err, user) => {
        if (user.avatar !== undefined) {
          res.redirect('/#!/');
        } else {
          res.redirect('/#!/choose-avatar');
        }
      });
  } else {
    // If user doesn't even exist, redirect to /
    res.redirect('/');
  }
};

// Create user
exports.create = (req, res) => {
  if (req.body.name && req.body.password && req.body.email) {
    User.findOne({
      email: req.body.email
    }).exec((err, existingUser) => {
      if (!existingUser) {
        const user = new User(req.body);
        user.provider = 'local';
        user.save((err) => {
          if (err) {
            return res.status(400).send({
              errors: err.errors,
              message: 'Failed'
            });
          } else if (!err) {
            const userData = {
              _id: user._id
            };
            return res.status(201).send({
              message: 'User Account Created Successfully',
              user: userData,
              token: generateToken(userData)
            });
          }
        });
      } else {
        return res.status(409).send({
          message: 'Email already exists'
        });
      }
    });
  }
};


// Search users controller
exports.searchUser = (req, res) => {
  const searchTerm = req.query.q;
  if (searchTerm === '') {
    return res.status(404).json({
      message: 'Enter a value'
    });
  }
  User.find({ name: new RegExp(searchTerm, 'i') }).exec((error, users) => {
    if (error) {
      return res.json(error);
    }
    if (users.length === 0) {
      return res.status(404).json({
        message: 'No user found'
      });
    }
    return res.json(users);
  });
};

// invite user controller
exports.inviteUser = (req, res) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USERNAME,
      pass: process.env.PASSWORD
    }
  });
  const mailOptions = {
    from: 'Cards for Humanity',
    to: req.body.mailTo,
    subject: 'Invitation to join a session of cfh',
    text: `Click the link to join game: ${req.body.gameLink}`,
    html: `<b>click the link to join game: ${req.body.gameLink}</b>`
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      res.status(400).json({
        message: 'An error occured while trying to send your mail'
      });
    } else {
      res.status(200).json({
        message: 'Message sent successfully'
      });
    }
  });
};

// Assign avatar to use
exports.avatars = (req, res) => {
  // Update the current user's profile to include the avatar choice they've made
  if (req.user && req.user._id && req.body.avatar !== undefined &&
    /\d/.test(req.body.avatar) && avatars[req.body.avatar]) {
    User.findOne({
      _id: req.user._id
    })
      .exec((err, user) => {
        user.avatar = avatars[req.body.avatar];
        user.save();
      });
  }
  return res.redirect('/#!/app');
};

// Add donation
exports.addDonation = (req, res) => {
  if (req.body && req.user && req.user._id) {
    // Verify that the object contains crowdrise data
    if (req.body.amount && req.body.crowdrise_donation_id && req.body.donor_name) {
      User.findOne({
        _id: req.user._id
      })
        .exec((err, user) => {
          // Confirm that this object hasn't already been entered
          let duplicate = false;
          for (let i = 0; i < user.donations.length; i++) {
            if (user.donations[i].crowdrise_donation_id === req.body.crowdrise_donation_id) {
              duplicate = true;
            }
          }
          if (!duplicate) {
            console.log('Validated donation');
            user.donations.push(req.body);
            user.premium = 1;
            user.save();
          }
        });
    }
  }
  res.send();
};

// Show profile
exports.show = (req, res) => {
  const user = req.profile;

  res.render('users/show', {
    title: user.name,
    user
  });
};

// Send user
exports.me = (req, res) => {
  res.jsonp(req.user || null);
};

// Find user by id
exports.user = (req, res, next, id) => {
  User
    .findOne({
      _id: id
    })
    .exec((err, user) => {
      if (err) return next(err);
      if (!user) return next(new Error(`Failed to load User ${id}`));
      req.profile = user;
      next();
    });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body.auth;
  User.findOne({
    email
  }).exec((err, user) => {
    if (err) return next(err);
    if (!user) return res.status(401).send({ message: 'wrong email or password' });
    const isLogin = user.authenticate(password);
    if (!isLogin) return res.status(401).send({ message: 'wrong email or password' });
    const userData = {
      _id: user._id
    };
    res.send({
      message: 'login successful',
      user: userData,
      token: generateToken(userData)
    });
  });
};
