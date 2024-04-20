const { Schema, model } = require("mongoose");

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please provide a product name"],
  },
  description: {
    type: String,
    required: [true, "Please provide a product description"],
  },
  richDescription: String,
  images: {
    type: [
      {
        type: String,
        validate: {
          validator: function (v) {
            return v.every((image) => image.length < 2097152);
          },
          message: "Image size should not exceed 2MB",
        },
      },
    ],
    required: [true, "provide atleast one image"],
  },
  price: {
    type: Number,
    required: [true, "provide a price"],
  },
  discountRate: {
    type: Number,
    validate: {
      validator: function (v) {
        return v <= 100;
      },
      message: "Discount rate must be less than or equal to 100",
    },
  },
  rating: {
    type: Number,
    validate: {
      validator: function (v) {
        return v >= 0 && v <= 5;
      },
      message: "Rating must be between 0 and 5",
    },
  },
  quantity: {
    type: Number,
    required: [true, "provide a quantity"],
    validate: {
      validator: Number.isInteger,
    },
    message: "Quantity must be a whole number",
  },
  isAvailable: {
    type: Boolean,
    required: true,
  },
  sellerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Product = model("Product", productSchema);
module.exports = Product;