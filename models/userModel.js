const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'A user must have a name'],
    },
    email: {
      type: String,
      trim: true,
      required: [true, 'A user must have an email'],
      unique: true,
      lowercase: true,
      validator: [validator.isEmail, 'Please provide a valid email!'],
    },
    phone: {
      type: String,
      trim: true,
      unique: true,
      validator: [
        validator.isMobilePhone,
        'Please provide a valid phone number!',
      ],
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    password: {
      type: String,
      required: [true, 'A user must have a password'],
      minlength: 8,
      select: false,
      trim: true,
    },
    passwordChangedAt: Date,
    addresses: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        link: {
          type: String,
          required: true,
        },
        address: String,
        description: String,
        floor: String,
      },
    ],
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

//!Methods for a fat model
userSchema.virtual('orders', {
  ref: 'Order',
  foreignField: 'user',
  localField: '_id',
});
// userSchema.virtual('location')
// userSchema.index({ addresses: '2dsphere' });

userSchema.pre('save', async function (next) {
  //?Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  //?Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
