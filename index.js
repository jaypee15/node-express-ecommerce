
// load dependencies
const express = require("express");
const logger = require("morgan");

const userRoutes = require("./routes/userRoutes");
const app = express();

// load middlewares
app.use(express.json());
app.use(logger("dev"));


//Routes
app.use("/api/users", userRoutes);
app.use("*", (req, res, next) => {
  console.log(`route ${req.base_Url} not found`);
  res.status(404).json({ message: "not found" });
});
// Error Handler

module.exports = app;
