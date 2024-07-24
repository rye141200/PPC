const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Order must have a customer!'],
    },
    products: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: 'Product',
          required: [true, 'Order must have at least 1 product!'],
        },
        count: {
          type: Number,
          required: true,
        },
      },
    ],
    paymentMethod: {
      type: String,
      required: [true, 'Please choose your payment method!'],
    },
    status: {
      type: String,
      enum: ['pending', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
//! To calculate the total price
orderSchema.virtual('TotalPrice').get(function () {
  const totalPrice = this.products.reduce(
    (total, el) =>
      total +
      el.product.price * el.count -
      el.product.price * el.product.discount * el.count,
    0,
  );
  return totalPrice;
});

//! Query middlewares
orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'products.product',
    select: 'price discount',
  }).populate({ path: 'user', select: 'name email' });
  next();
});

//# update the product quantity
/*orderSchema.pre(/^find/, async function (next) {
  // convert query object into document object
  this.product = await this.findOne();
});
*/
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
