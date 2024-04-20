const register = require("./user-validators/register");
const login = require("./user-validators/login");
const addProduct = require("./product-validators/create-product");

module.exports = {
  login,
  register,
  addProduct,
  updateProduct,
};
