const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A product must have a name!'],
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'A product must have a description!'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'A product must have a price!'],
    set: (value) => Math.floor(value * 100) / 100,
    validate: {
      validator: Number.isFinite,
      message: `Price {{VALUE}} is not a valid number`,
    },
    min: [0, 'Price {{VALUE}} must be a positive number'],
  },
  image: {
    type: String,
    required: [true, 'A product must have an image'],
  },
  addedAt: {
    type: Date,
    default: Date.now(),
  },
  discount: {
    type: Number,
    min: [0, `Discount {VALUE} must be a positive number`],
    max: [1, `Discount {VALUE} must be less than 1!`],
    validate: {
      validator: function (value) {
        return value < this.price;
      },
      message: 'Discount {VALUE} must be less than the price!',
    },
    default: 0,
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
