const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: [true, 'No two categories can have the same name!'],
      validate: {
        validator: async function (value) {
          // Use the Category model directly
          const category = await mongoose.models.Category.findOne({
            name: { $regex: new RegExp(`^${value}$`, 'i') },
          });

          // If category exists, check if it's not the current document (for updates)
          // For new documents (this._id doesn't exist yet), skip this check
          if (
            category &&
            this._id &&
            category._id.toString() !== this._id.toString()
          ) {
            return false; // Validation fails
          }

          return true; // Validation passes
        },
        message: 'Category name must be unique!',
      },
    },
    slug: {
      type: String,
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

//! Middlewares, populations
categorySchema.pre(/^find/, function (next) {
  if (!this.getOptions().bypassFilter) this.find({ deleted: { $ne: true } });
  next();
});
categorySchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
