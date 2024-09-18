const factory = require('./handlerFactory');
const Order = require('../models/orderModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const email = require('../utils/email');

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

//! Order admits
exports.admitOrder = catchAsync(async (req, res, next) => {
  const updatedOrder = await Order.findByIdAndUpdate(
    req.body.id,
    { status: req.body.status },
    {
      new: true,
      runValidators: true,
    },
  );
  if (!updatedOrder) return next(new AppError('Order not found!', 404));

  res.status(200).json({
    status: 'success',
    data: {
      order: updatedOrder,
    },
  });
});

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
  if (payment.type === 'payment_paid') {
    await Order.findByIdAndUpdate(
      order.id,
      { paid: true, status: 'accepted' },
      { new: true },
    ).setOptions({ bypassFilter: true });

    await email.sendEmail(
      order.user.email,
      'Order confirmation',
      `
      <h1>Hello ${order.user.name},</h1>
      <p>
      This is an email to confirm your purchase from PPC.
      You can check the order details on your account on the website</p>
      <h4>Thanks for your purchase</h4>
      <h2>PPC Dev team</h2>
      `,
    );
    const orderDetailsUrl = `${req.protocol}://${req.get('host')}/admin/dashboard/orders/accepted`;
    await email.sendEmailText(
      process.env.ADMIN_ORDERS_EMAIL,
      'Order has been made',
      `
      Buckle up! An order has been made!,
      Check the details here: ${orderDetailsUrl}
      Order ID: #ORD-${order.orderid}
      `,
    );
  }

  res.status(200).json({
    status: 'success',
    message: 'Order created',
    data: {
      data: order,
    },
  });
});
