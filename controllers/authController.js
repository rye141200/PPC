const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { sendEmail } = require('../utils/email');
const { sendEmailText } = require('../utils/email');
const replaceTemplate = require('../dev-data/passwordResetTemplate');

//!Helper methods
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, req, res, signup = false) => {
  const token = signToken(user._id);

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  });

  // Remove password from output
  user.password = undefined;
  //res.status(statusCode).redirect('/');

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};
exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    // roles ['admin']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          'You do not have permission to perform this action',
          403,
          true,
        ),
      );
    }

    next();
  };
const shortenURL = async (longURL) => {
  const response = await fetch('https://api-ssl.bitly.com/v4/shorten', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.BITLY_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ long_url: longURL }),
  });

  const data = await response.json();
  return data.link; // This will be the shortened URL
};

//!Main functionalities
exports.renderLoginUI = (req, res, next) => {
  res.render('login');
};
exports.renderSignup = (req, res, next) => {
  res.render('register');
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
  });

  //const url = `${req.protocol}://${req.get('host')}/me`;
  // console.log(url);
  req.user = newUser;
  createSendToken(newUser, 201, req, res, true);
  next();
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //* 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  //* 2) Check if user exists && password is correct

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  //* 3) If everything ok, send token to client
  createSendToken(user, 200, req, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError(
        'You are not logged in! Please log in to get access.',
        401,
        true,
      ),
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401,
        true,
      ),
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'User recently changed password! Please log in again.',
        401,
        true,
      ),
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;

  next();
});
//! RENDERING
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies?.jwt) {
    try {
      //* 1) verify token
      const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);

      //* 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }
      //* 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      // res.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

//!Password CRUD operations
exports.forgotPassword = catchAsync(async (req, res, next) => {
  //*1) Get email
  const user = await User.findOne({ email: req.body.email });

  if (!user)
    return next(new AppError('There is no user with such email!', 404));

  //*2) Generating random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ valdiationBeforeSave: false });

  //*3) Send it to user's email
  try {
    const resetURL = `${req.protocol}://${req.get('host')}/resetPassword/${resetToken}`;

    // console.log(resetURL);

    //!This for html when we get a bussiness account
    /* const html = replaceTemplate(resetURL);
    await sendEmail(user.email, 'Password reset (Expires in 10 mins)', html); */

    await sendEmailText(
      user.email,
      'Password reset (Expires in 10 mins)',
      `Hello,
          To reset your password, please copy and paste the following link into your browser:
          ${resetURL}

          If you did not request a password reset, please ignore this email.
          (This link will expire in 10 minutes)
          Thank you,
          PPC
      `,
    );

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500,
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //* 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // console.log('On my way to update');
  //* 2) If token has not expired, and there is user, set the new password
  if (!user) return next(new AppError('Token is invalid or has expired', 400));

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  //* 3) Update changedPasswordAt property for the user
  //* 4) Log the user in, send JWT
  createSendToken(user, 200, req, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //? 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');
  // console.log(user);
  //? 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  //? 3) Check if password and passwordConfirm are equal if so, update password
  if (req.body.password !== req.body.passwordConfirm)
    return next(new AppError('Passwords does not match!', 400));

  user.password = req.body.password;
  // user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  //! User.findByIdAndUpdate will NOT work as intended! Due to not running validators

  //? 4) Log user in, send JWT
  createSendToken(user, 200, req, res);
});
