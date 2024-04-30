const register = require("./user-validators/register");
const login = require("./user-validators/login");
const addProduct = require("./product-validators/create-product");
const updateProductSchema = require("./product-validators/update-product");

module.exports = {
  login,
  register,
  addProduct,
  updateProductSchema,
};
