const asyncHandler = require("express-async-handler");
const Cart = require("../models/cart-model");
const ErrorObject = require("../utils/error");

const createCart = asyncHandler(async (req, res, next) => {
  const { userId, products } = req.body;
  const cart = await Cart.create({ userId, products });
  res.status(201).json({ message: "Cart created successfully.", cart });
});

const getAllCarts = asyncHandler(async (req, res, next) => {
  const carts = await Cart.find();
  res.status(200).json({ carts });
});

const getCart = asyncHandler(async (req, res, next) => {
  const { cartId } = req.params;

  const cart = await Cart.findById(cartId);
  if (!cart) {
    next(new ErrorObject("Cart not found", 404));
  }
  const userId = req.user.userID;
  // restrict to same buyer or product owner, admin
  if (
    userId.toString() !== cart.userId.toString() ||
    req.user.role !== "admin"
  ) {
    next(
      new ErrorObject("You are not authorized to perform this action.", 403)
    );
  }
  res.status(200).json({ cart });
});

const updateCart = asyncHandler(async (req, res, next) => {
  const { products } = req.body;
  req.user.cart = products;
  await req.user.cart.save();
  res.status(200).json({ message: "Cart updated successfully.", cart });
});

const deleteCart = asyncHandler(async (req, res, next) => {
  
  await Cart.findByIdAndDelete(req.user.cart.cart._id)
});

module.exports = { createCart, getAllCarts, getCart, updateCart, deleteCart };
