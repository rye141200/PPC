const slugify = require('slugify');
const sharp = require('sharp');
const multer = require('multer');
const fs = require('fs');
const handlerFactory = require('./handlerFactory');
const Product = require('../models/productModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        "The select file can't be uploaded please try agian later",
        400,
      ),
    );
  }
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.resizeProductImage = (req, res, next) => {
  if (req.file) {
    req.file.filename = `${slugify(req.body.name, { lower: true })}.jpeg`;
    sharp(req.file.buffer)
      .resize(780, 520)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/${req.file.filename}`);
  }
  next();
};
exports.addImageName = (req, res, next) => {
  if (req.file) req.body.image = req.file.filename;
  next();
};
exports.uploadImage = upload.single('image');

exports.getAllProducts = handlerFactory.getAll(Product);

exports.createProduct = handlerFactory.createOne(Product);

exports.getProduct = handlerFactory.getOne(Product);

exports.updateProduct = handlerFactory.updateOne(Product);

exports.deleteProductImage = catchAsync(async (req, res, next) => {
  //! 1.check if the product still exists
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
  //! 2. get the path for the old image
  const oldImagePath = `public/img/${product.image}`;
  if (product.image) {
    fs.access(oldImagePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error('File does not exist:', err);
        return next();
      }
      //! 3.delete the old image
      fs.unlink(oldImagePath, (err) => {
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
});

exports.deleteProduct = handlerFactory.deleteOne(Product);

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
