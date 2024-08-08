const Cart = require('../models/cartModel');
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
const incrementCart = async (cart, productId) => await cart.addItem(productId);
const decrementCart = async (cart, productId) =>
  await cart.decrementItemCount(productId);
const removeItem = async (cart, productId) => await cart.removeItem(productId);
const emptyCart = async (cart) => await cart.setItems([]);
const wasLoggedInAndNowAManWhoHasACart = async (cart, items) =>
  await cart.setItems(items);

exports.handleCart = catchAsync(async (req, res, next) => {
  //! 1) Get the user cart
  const { user } = req;
  const cart = await Cart.findOne({ user: user.id });

  //! 2) Handle the operation
  const { operation } = req.body;
  const { productId } = req.body;
  let updatedCart;
  switch (operation) {
    case 'increment':
      updatedCart = await incrementCart(cart, productId);
      break;
    case 'decrement':
      updatedCart = await decrementCart(cart, productId);
      break;
    case 'delete':
      updatedCart = await removeItem(cart, productId);
      break;
    case 'newFullCart':
      updatedCart = await wasLoggedInAndNowAManWhoHasACart(cart, productId);
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
