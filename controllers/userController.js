const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getMyOrders = catchAsync(async (req, res, next) => {
  const userData = await User.findById(req.user.id)
    .populate('orders')
    .select('orders');

  res.status(200).json({
    status: 'success',
    data: {
      userData,
    },
  });
});

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);

exports.updateMe = catchAsync(async (req, res, next) => {
  //? 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400,
      ),
    );
  }

  //? 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email', 'phone');

  //? 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.addNewAddress = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      $push: { addresses: req.body },
    },
    { new: true },
  );

  res.status(201).json({
    status: 'success',
    results: user.addresses.length,
    data: {
      data: user.addresses,
    },
  });
});

exports.getMyAddresses = catchAsync(async (req, res, next) => {
  const { addresses } = await User.findById(req.user.id);
  res.status(200).json({
    status: 'success',
    results: addresses.length,
    data: {
      data: addresses,
    },
  });
});
