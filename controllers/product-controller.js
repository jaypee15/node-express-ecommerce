const asyncHandler = require("express-async-handler");
const multer = require("multer");

const Product = require("../models/product-model");
const uploadImage = require("../utils/cloudinary");
const ErrorObject = require("../utils/error");

const storage = multer.diskStorage({});
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new BadRequestError("Please upload an image file"), false);
  }
};
const upload = multer({
  storage,
  fileFilter: multerFilter,
});

const uploadProductPhotos = upload.array("images");

const createProduct = asyncHandler(async (req, res, next) => {
    

    if (!req.user || req.user.role !== "seller") {
        return next( new ErrorObject("You are not allowed to add a product", 403))
    }

    const {
      name,
      description,
      richDescription,
      price,
      discountRate,
      rating,
      quantity,
      isAvailable,
      sellerId,
    } = req.body;
    let images = "";

  if (req.files) {
    try {
      const image = { url: req.file.path, id: req.file.filename };
      const folder = 'product-photos'
      const result = await uploadImage(image, folder);
      const photo = result.secure_url;
      console.log(photo);
    } catch (error) {
      return res.status(500).json({ message: "Failed to upload Image" });
    }
  }

    // Create product using Mongoose
    const product = await Product.create({
      name,
      description,
      richDescription,
      images,
      price,
      discountRate,
      rating,
      quantity,
      isAvailable,
      sellerId,
    });

    res.status(201).json({ success: true, product });
});

const getProduct = asyncHandler(async (req, res, next) => {
  const productId = req.params.productID;

  const productDetails = await Product.findOne(productId);
  res.status(200).json({product: productDetails });
});


const getAllProducts = asyncHandler(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).json({products: products });
});


const updateProduct = asyncHandler(async (req, res, next) => {
    const productId = req.params.productID;
    const updates = req.body;
    const images = req.file;

    // upload images to cludinary first
    const updatedProduct = await Product.findByIdAndUpdate(productId, updates, { new: true });

    res.status(200).json({ success: true, product: updatedProduct });

});
const deleteProduct = asyncHandler(async (req, res, next) => {
    const productId = req.params.productID;
    const user = req.user;

    const product = await Product.findById(productId);
    if (!product) {
        return next(new ErrorObject("Product not found"), 404);
    }

    const isSeller = product.sellerId.toString() === user._id.toString()
    
    if (!user.role==="admin" && product.sellerId !== user.userId) {
        return next(new ErrorObject("You are not allowed here", 403))
    }

    await Product.findByIdAndDelete(productId)
    res.status(204).json({ message: "product deleted succesfully" });
});

module.exports = {
  createProduct,
  getProduct,
  getAllProducts,
  deleteProduct,
  updateProduct,
  uploadProductPhotos,
};
