const factory = require('./handlerFactory');
const Order = require('../models/orderModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find();
  res.status(200).json({
    status: 'success',
    data: {
      data: orders,
    },
  });
});

exports.createOrder = factory.createOne(Order);

exports.deleteOrder = factory.deleteOne(Order);

exports.getOrder = factory.getOne(Order);
