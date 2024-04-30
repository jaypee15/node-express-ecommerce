const express = require("express");

const restrict = require("../middleware/restrict");
const verifyToken = require("../middleware/authentication");
const sameBuyer = require("../middleware/same-buyer");

const {
  createCart,
  getAllCarts,
  getCart,
  updateCart,
  deleteCart,
} = require("../controllers/cart-controller");


const router = express.Router();

router
  .route("/")
  .post(verifyToken, restrict("buyer"), createCart)
  .get(verifyToken, restrict("admin"), getAllCarts);

router
  .route("/:cartId")
  .get(verifyToken, getCart)
  .patch(verifyToken, sameBuyer, updateCart)
  .delete(verifyToken, sameBuyer, deleteCart);

module.exports = router;
