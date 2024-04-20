// require("express-async-errors");
// load dependencies
const express = require("express");
const cookieParser = require('cookie-parser')

const ErrorHandler = require("./middleware/error-handler");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/product-routes");

const app = express();

app.use(cookieParser())
app.use(express.json());

//Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("*", (req, res, next) => {
  console.log(`route ${req.base_Url} not found`);
  res.status(404).json({ message: "not found" });
});

app.use(ErrorHandler);
// Error Handler

module.exports = app;
