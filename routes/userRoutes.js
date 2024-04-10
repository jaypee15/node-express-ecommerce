const express = require("express");

const {
  createUser,
  getAllUsers,
  loginUser,
  getUser,
  updateUser,
  deleteUser,
  updatePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");

const router = express.Router();

router.route("/:userID").post(createUser).get(getUser).patch(updateUser).delete(deleteUser);
router.route("/").post(loginUser).get(getAllUsers);
router.route("/password").post(resetPassword).get(forgotPassword).patch(updatePassword)

module.exports = router;
