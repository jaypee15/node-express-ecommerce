const express = require("express");
const validator = require("../middleware/validator");
const verifyToken = require("../middleware/authentication");
const restrict = require("../middleware/restrict");
const sameProductOwner = require("../middleware/same-product-owner");

const {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadProductPhotos,
} = require("../controllers/product-controller");
const { updateProductSchema } = require("../validators");


const router = express.Router();

router
  .route("/")
  .post(verifyToken, restrict("seller"), uploadProductPhotos, createProduct)
  .get(getAllProducts);
router
  .route("/:productID")
  .get(getProduct)
  .patch(
    verifyToken,
    restrict("seller"),
    sameProductOwner,
    validator(updateProductSchema),
    updateProduct
  )
  .delete(verifyToken, deleteProduct);

module.exports = router;
