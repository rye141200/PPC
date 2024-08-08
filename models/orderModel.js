const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
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
    location: {
      type: String,
      required: true,
      trim: true,
    },
    paymentID: {
      type: String,
      requird: [true, 'Order must have Moyasar payment ID!'],
      select: false,
    },
    paid: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  },
);
//! To calculate the total price
orderSchema.virtual('totalPrice').get(function () {
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
  if (!this.getOptions().bypassFilter) this.find({ paid: { $ne: false } });
  this.populate({
    path: 'products.product',
    select: 'name price discount category',
  });
  //.populate({ path: 'user', select: 'name email' });
  next();
});

orderSchema.pre('save', async function (next) {
  if (this.isModified('products')) {
    await this.populate({
      path: 'products.product',
      select: 'name price discount category',
    });
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
