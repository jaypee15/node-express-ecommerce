const express = require("express");
const validator = require("../middleware/validator");

const {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product-controller");

const router = express.Router();

router.route("/").post(validator("addProduct"), createProduct).get(getAllProducts);
router.route("/:productID").get(getProduct).patch(validate("updateProduct"), updateProduct).delete(deleteProduct)
