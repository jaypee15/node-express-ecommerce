const express = require("express");
const validator = require("../middleware/validator");
const verifyToken = require("../middleware/authentication");

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
  uploadAvatar,
} = require("../controllers/user-controller");
const { register, login } = require("../validators");

const router = express.Router();

router
  .route("/:userID")
  .get(verifyToken, getUser)
  .patch(verifyToken, updateUser)
  .delete(verifyToken, deleteUser);
router
  .route("/")
  .post(uploadAvatar, validator(register), createUser, )
  .get(verifyToken, getAllUsers);
router
  .route("/password/:userID")
  .get(verifyToken, forgotPassword)
  .patch(verifyToken, updatePassword);
router.post("/password/", resetPassword)
router.post("/login", validator(login), loginUser);

module.exports = router;
