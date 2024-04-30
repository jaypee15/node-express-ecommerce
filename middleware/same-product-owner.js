const asyncHandler = require("express-async-handler");

const Product = require("../models/product-model");
const ErrorObject = require("../utils/error");


const sameProductOwner = asyncHandler(async (req, res, next) => {
    const {productID} = req.params;
  

    const  product = await Product.findById(productID);

    if (!product){
        
        next( new ErrorObject("Product not Found", 404))
    }

    if (product.sellerId.toString()!== req.user.userID.toString()){
        next( new ErrorObject("You are not the owner of this product", 401))
    }
  
    next();

})

module.exports = sameProductOwner;