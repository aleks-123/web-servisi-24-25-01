const Movie = require('../pkg/movies/moveSchema');
const User = require('../pkg/user/userSchema');
const crypto = require('crypto');
const sendEmail = require('./emailHandler');
const jwt = require('jsonwebtoken');

exports.getLoginForm = async (req, res) => {
  try {
    res.status(200).render('login', {
      title: 'Login',
      podnaslov: 'Login to see our movies',
    });
  } catch (err) {
    res.status(500).send('Error');
  }
};

exports.movieView = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).render('viewFilms', {
      naslov: 'Our movie',
      kategorija: 'Comedy',
      test: 'HELLOOO',
      movies,
    });
  } catch (err) {
    res.status(500).send('Error');
  }
};

exports.createMovie = async (req, res) => {
  try {
    console.log(req.body);
    await Movie.create(req.body);
    res.redirect('/viewmovies');
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    const movieId = req.params.id;
    await Movie.findByIdAndDelete(movieId);
    res.redirect('/viewmovies');
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getForgotPasswordForm = async (req, res) => {
  try {
    res.status(200).render('forgotPassword', {
      title: 'Forgot Password',
      podnaslov: 'Please enter your email to reset password',
    });
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Could not load forgot password page',
    });
  }
};

exports.submitForgotPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send('Token is invalid or expired');
    }
    // 'vrapcevrapce123'
    const resetToken = crypto.randomBytes(32).toString('hex');
    // 'vrapcevrapce123 -> dvetripet123'
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = Date.now() + 30 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get('host')}/resetPassword/${resetToken}`;
    const message = `Copy this link to reset your password ${resetUrl}`;

    await sendEmail({
      email: user.email,
      messages: message,
      subject: 'Your reset token is valid (30 min)',
    });

    res.status(200).render('emailSent', {
      title: 'Email sent',
      message: 'An email is sent to your mail',
    });
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Could not load forgot password page',
    });
  }
};

exports.getResetPasswordForm = async (req, res) => {
  try {
    res.status(200).render('resetPassword', {
      title: 'Reset Password',
      token: req.params.token,
    });
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Could not load forgot password page',
    });
  }
};

exports.submitResetPassword = async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).render('error', {
        title: 'Error',
        message: 'Token is invalid or has expired',
      });
    }

    user.password = req.body.password;
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;
    await user.save();

    const token = jwt.sign(
      { id: user._id, name: user.name, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );

    res.cookie('jwt', token, {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 10000),
      secure: false,
      httpOnly: true,
    });

    res.redirect('/viewmovies');
  } catch (err) {
    res.status(500).render('error', {
      title: 'Error',
      message: 'Could not load forgot password page',
    });
  }
};
