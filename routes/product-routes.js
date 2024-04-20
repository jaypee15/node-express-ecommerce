const express = require("express");
const validator = require("../middleware/validator");
const verifyToken = require("../middleware/authentication");

const {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product-controller");

const router = express.Router();

router
  .route("/")
  .post(validator("addProduct"), verifyToken, createProduct)
  .get(getAllProducts);
router
  .route("/:productID")
  .get(getProduct)
  .patch(validator("updateProduct"), verifyToken, updateProduct)
  .delete(verifyToken, deleteProduct);

module.exports = router;
