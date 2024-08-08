const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      required: [true, 'A cart must be owned by a user!'],
      unique: [true, 'A cart must be owned by only one user!'],
    },
    items: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: 'Product',
          required: [true, 'Order must have at least 1 product!'],
        },
        count: {
          type: Number,
          required: true,
          min: [1, 'Item count cannot be less than one!'],
        },
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  },
);

cartSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'items.product',
    select: '',
  });
  next();
});
// cartSchema.pre('save', async function (next) {
//   await this.populate(this.items);
//   next();
// });
cartSchema.virtual('totalPrice').get(function () {
  const totalPrice = this.items.reduce(
    (total, el) =>
      total +
      el.product.price * el.count -
      el.product.price * el.product.discount * el.count,
    0,
  );
  return totalPrice;
});

cartSchema.methods.addItem = async function (productId) {
  const itemIndex = this.items.findIndex(
    (item) => item.product._id.toString() === productId,
  );
  if (itemIndex > -1) {
    // Item exists, increment count
    this.items[itemIndex].count += 1;
  } else {
    // Item does not exist, add new item
    this.items.push({ product: productId, count: 1 });
  }
  await this.save();
  return this;
};

cartSchema.methods.decrementItemCount = async function (productId) {
  const itemIndex = this.items.findIndex(
    (item) => item.product._id.toString() === productId,
  );
  if (itemIndex > -1 && this.items[itemIndex].count > 1) {
    this.items[itemIndex].count -= 1;
    await this.save();
  }
  return this;
};

cartSchema.methods.removeItem = async function (productId) {
  this.items = this.items.filter(
    (item) => item.product._id.toString() !== productId,
  );
  await this.save();
  return this;
};

//! Only in case a user started buying without logging in first or resetting the cart
cartSchema.methods.setItems = async function (items) {
  this.items = items;
  await this.save();
  return this;
};
const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
