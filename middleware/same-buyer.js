const asyncHandler = require("express-async-handler");
const ErrorObject = require("../utils/error");
const Cart = require("../models/cart-model");

const sameBuyer = asyncHandler(async (req, res, next) => {
  const { cartId } = req.params;

  const cart = await Cart.find(cartId);
  if (!cart) {
    next(new ErrorObject("Cart not found", 404));
  }

  if (req.user.userId.toString() !== cart.userId.toString()) {
    next(new ErrorObject("You are not authorised to perform this action", 403));
  }
  req.user.cart = cart;

  next();
});

module.exports = sameBuyer;
