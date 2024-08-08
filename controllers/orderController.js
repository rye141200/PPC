const factory = require('./handlerFactory');
const Order = require('../models/orderModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.createOrder = factory.createOne(Order);
exports.getOrder = factory.getOne(Order, 'user', 'name email phone');

//!Only for admins
exports.getAllOrders = factory.getAll(Order, 'user', 'name email phone');
exports.deleteOrder = factory.deleteOne(Order);
exports.updateOrder = factory.updateOne(Order);
exports.setUserId = (req, res, next) => {
  req.body.user = req.user.id;
  next();
};

/* exports.validatePurchase = catchAsync(async (req, res, next) => {
  const payment = req.body;
  const response = await fetch(
    `https://api.moyasar.com/v1/payments/${payment.id}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer sk_test_CPiBmCDNr7dPv4jNWbf8KdUt6VxQ1pf9LdEd7mKb`,
      },
    },
  );
  const data = await response.json();
  res.status(201).json({
    status: 'success!',
  });
}); */

exports.moyasarWebhook = catchAsync(async (req, res, next) => {
  //!1) Verifying the signature
  const signature = req.headers['x-event-secret'];
  if (signature !== process.env.MOYASAR_SECRET_KEY)
    return next(new AppError('Invalid signature', 400));

  //!2) If order wasnt paid, delete from the database
  const payment = req.body;
  const order = await Order.findOne({ paymentID: payment.data.id }).setOptions({
    bypassFilter: true,
  });
  if (!order) return next(new AppError('Order does not exist!', 404));
  if (
    payment.type === 'payment_failed' ||
    payment.type === 'payment_canceled' ||
    payment.type === 'payment_expired'
  ) {
    await Order.deleteOne({ _id: order.id });
    return res.status(204).json({
      status: 'Failed',
      message: 'Order deleted, payment not complete',
    });
  }
  //!3) Else complete with the save product and send it back in the response
  if (payment.type === 'payment_paid')
    await Order.findByIdAndUpdate(
      order.id,
      { paid: true },
      { new: true },
    ).setOptions({ bypassFilter: true });

  res.status(200).json({
    status: 'success',
    message: 'Order created',
    data: {
      data: order,
    },
  });
});
