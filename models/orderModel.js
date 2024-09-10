const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

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
      enum: ['pending', 'accepted', 'shipped', 'cancelled'],
      default: 'pending',
    },
    location: {
      location: {
        type: String,
        required: true,
        trim: true,
      },
      address: {
        type: String,
        required: true,
      },
      street: {
        type: String,
        required: true,
      },
      buildingno: String,
      specialLandmarks: String,
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
    orderid: {
      type: Number,
      unique: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  },
);
orderSchema.plugin(autoIncrement, { inc_field: 'orderid' });

//! To calculate the total price
orderSchema.virtual('totalPrice').get(function () {
  const totalPrice = this.products.reduce(
    (total, el) =>
      total +
      el.product.price * el.count -
      el.product.price * el.product.discount * el.count,
    0,
  );
  return totalPrice.toFixed(2);
});
orderSchema.virtual('orderName').get(function () {
  return `#ORD-${this.orderid}`;
});
//! Query middlewares
orderSchema.pre(/^find/, function (next) {
  if (!this.getOptions().bypassFilter) this.find({ paid: { $ne: false } });
  this.populate({
    path: 'products.product',
    options: { bypassFilter: true },
  })
    .setOptions({ bypassFilter: true })
    .populate('user');
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

//! Identity

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
