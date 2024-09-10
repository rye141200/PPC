const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.getCart = catchAsync(async (req, res, next) => {
  const { user } = req;
  const cart = await Cart.findOne({ user: user.id });
  res.status(200).json({
    status: 'success',
    data: cart,
  });
});

exports.createCart = catchAsync(async (req, res, next) => {
  const { user } = req;
  const cart = await Cart.create({ user: user._id });
  res.status(201).json({
    status: 'success',
    user,
    cart,
  });
});
const incrementCart = async (cart, productId, count = 1) =>
  await cart.addItem(productId, count);
const decrementCart = async (cart, productId) =>
  await cart.decrementItemCount(productId);
const deleteItem = async (cart, productId) => await cart.removeItem(productId);
const emptyCart = async (cart) => await cart.setItems([]);
const wasLoggedInAndNowAManWhoHasACart = async (cart, items) =>
  await cart.setItems(items);

exports.handleCart = catchAsync(async (req, res, next) => {
  //! 1) Get the user cart
  const { user } = req;
  const cart = await Cart.findOne({ user: user.id });

  //! 2) Handle the operation
  const { operation } = req.body;
  const productId = req.body?.productId;
  const items = req.body?.items;
  const count = req.body?.count;

  let updatedCart;
  switch (operation) {
    case 'increment':
      updatedCart = await incrementCart(cart, productId, count ? count : 1);
      break;
    case 'decrement':
      updatedCart = await decrementCart(cart, productId);
      break;
    case 'delete':
      updatedCart = await deleteItem(cart, productId);
      break;
    case 'newFullCart':
      updatedCart = await wasLoggedInAndNowAManWhoHasACart(cart, items);
      break;
    case 'empty':
      updatedCart = await emptyCart(cart);
      break;
    default:
      break;
  }
  res.locals.cart = updatedCart;
  res.status(200).json({
    status: 'success',
    updatedCart,
  });
});
exports.constructCart = catchAsync(async (req, res, next) => {
  //!1) Getting products from the database
  const productsCountList = req.body;
  const ids = productsCountList.map((product) => product.product);
  let cart = await Product.find({ _id: ids });
  if (!cart) return next(new AppError('No products found!', 404));

  //!2) Reassigning the counts to each product
  cart = cart.map((el) => {
    return {
      product: el,
      count: productsCountList.find((product) => product.product == el._id)
        .count,
    };
  });

  //!3) Calculating the total price
  cart = {
    products: cart,
    totalPrice: cart.reduce(
      (total, el) =>
        total +
        el.product.price * el.count -
        el.product.price * el.product.discount * el.count,
      0,
    ),
  };
  //!4) Send the request
  res.status(200).json({
    status: 'success',
    cart,
  });
});
