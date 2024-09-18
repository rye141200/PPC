const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema(
  {
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
    discount: {
      type: Number,
      min: [0, `Discount {VALUE} must be a positive number`],
      max: [1, `Discount {VALUE} must be less than 1!`],
      default: 0,
    },
    slug: {
      type: String,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: [true, 'A product must belong to a category!'],
    },
    deleted: {
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
//! Pre document middleware
productSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
productSchema.pre(/^find/, function (next) {
  if (!this.getOptions().bypassFilter) this.find({ deleted: { $ne: true } });
  this.populate('category');
  next();
});
//! Pre query middleware
/* productSchema.pre(/find^/, function (next) {
  if (this.isModified('name')) this.slug = slugify(this.name, { lower: true });
  next();
}); */
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
