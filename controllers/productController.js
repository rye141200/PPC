const slugify = require('slugify');
const sharp = require('sharp');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const handlerFactory = require('./handlerFactory');
const Product = require('../models/productModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const Category = require('../models/categoryModel');

// Multer configuration
const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  console.log('File MIME type:', file.mimetype); // Debug logging
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        "The selected file can't be uploaded. Please try again later.",
        400,
      ),
      false,
    );
  }
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

// Middleware to resize and save image
exports.resizeProductImage = (req, res, next) => {
  if (req.file) {
    const fileName = `${slugify(req.body?.referencename ?? req.body.name, { lower: true })}.jpeg`;
    const filePath = `public/img/${fileName}`;

    // Ensure directory exists
    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    sharp(req.file.buffer)
      .resize(780, 520)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(filePath, (err) => {
        if (err) {
          return next(new AppError('Error processing image', 500));
        }
        req.file.filename = fileName; // Update filename in request
        next();
      });
  } else {
    next();
  }
};

// Middleware to add image filename to the request body
exports.addImageName = (req, res, next) => {
  if (req.file) req.body.image = req.file.filename;
  next();
};

// Multer middleware for handling single image upload
exports.uploadImage = upload.single('image');

// Route handlers
exports.getAllProducts = handlerFactory.getAll(Product);
exports.createProduct = handlerFactory.createOne(Product);
exports.getProduct = handlerFactory.getOne(Product);

exports.updateProduct = catchAsync(async (req, res, next) => {
  // Check if name exists and create slug
  if (req.body.name) req.body.slug = slugify(req.body.name, { lower: true });

  // Update product
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).setOptions({ bypassFilter: true });

  if (!product) {
    return res.status(404).json({
      status: 'error',
      message: 'Product not found',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      product,
    },
  });
});

// Middleware to delete old product image
exports.deleteProductImage = catchAsync(async (req, res, next) => {
  // Check if product ID exists
  if (!req.params.id) {
    return next(new AppError('No product ID provided', 400));
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({
      status: 'error',
      message: 'Product not found',
    });
  }

  // Check if the form-data has an image
  if (req.file) {
    const oldImagePath = `public/img/${product.image}`;
    if (product.image) {
      fs.access(oldImagePath, fs.constants.F_OK, (err) => {
        if (err) {
          console.error('File does not exist:', err);
          return next();
        }
        // Delete old image
        fs.unlink(oldImagePath, () => {
          if (err) {
            console.error('Error deleting file:', err);
            return res.status(500).json({
              status: 'error',
              message: 'Error deleting file',
            });
          }
          next();
        });
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const deletedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    { deleted: true },
    { new: true, runValidators: true },
  );
  if (!deletedProduct) return next(new AppError('Product not found!', 404));
  res.status(204).json({
    status: 'success',
    data: {
      product: deletedProduct,
    },
  });
});

exports.getCartProducts = catchAsync(async (req, res, next) => {
  const ids = req.query._id.split(',');
  const products = await Product.find({
    _id: { $in: ids },
  });
  res.status(200).json({
    status: 'success',
    products,
  });
});

exports.searchProducts = catchAsync(
  async (subString = '', category = '', page = 1, pageSize = 8) => {
    const currentPage = isNaN(page) || page < 1 ? 1 : parseInt(page, 10);
    const currentPageSize =
      isNaN(pageSize) || pageSize < 1 ? 8 : parseInt(pageSize, 10);

    const skip = (currentPage - 1) * currentPageSize;

    const query = {};
    if (subString) {
      query.name = { $regex: subString, $options: 'i' };
    } else if (category) {
      query.category = category;
    }
    if (!subString && !category) {
      throw new AppError('Either subString or category must be provided.', 400);
    }

    try {
      const totalCount = await Product.countDocuments(query);

      const products = await Product.find(query)
        .skip(skip)
        .limit(currentPageSize)
        .exec();

      const remainingProducts = await Product.find(query)
        .where('_id')
        .nin(products.map((product) => product._id))
        .exec();

      return {
        products,
        count: totalCount,
        remainingProducts,
      };
    } catch (err) {
      throw new AppError(`Error searching products: ${err.message}`, 500);
    }
  },
);

exports.aliasCategory = catchAsync(async (req, res, next) => {
  if (req.query.category) {
    req.query.category = await Category.findOne({ name: req.query.category });
  }
  next();
});

exports.restoreProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  }).setOptions({ bypassFilter: true });
  if (!product) return next(new AppError('Product not found!', 404));
  res.status(200).json({
    status: 'success',
    data: {
      document: product,
    },
  });
});
