// require("dotenv").config()

const express = require("express");
// const {PORT} = process.env;
// console.log(PORT);
const userRoutes = require("./routes/userRoutes");
const app = express();

// Middlewares
app.use(express.json());

//Routes
app.use("/api/users", userRoutes);
app.use("*", (req, res, next) => {
  console.log(`route ${req.base_Url} not found`);
  res.status(404).json({ message: "not found" });
});
// Error Handler

module.exports = app;
