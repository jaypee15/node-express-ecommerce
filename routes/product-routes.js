const express = require("express");
const validator = require("../middleware/validator");
const verifyToken = require("../middleware/authentication");

const {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadProductPhotos,
} = require("../controllers/product-controller");

const router = express.Router();

router
  .route("/")
  .post(uploadProductPhotos, validator("addProduct"), verifyToken, createProduct)
  .get(getAllProducts);
router
  .route("/:productID")
  .get(getProduct)
  .patch(validator("updateProduct"), verifyToken, updateProduct)
  .delete(verifyToken, deleteProduct);

module.exports = router;
