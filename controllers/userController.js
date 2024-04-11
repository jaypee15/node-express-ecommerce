require("dotenv").config();

const { EXPIRES_IN, SECRET } = process.env;

const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const BadRequestError = require("../utils/errors/badRequestError");
const ServerError = require("../utils/errors/serverError");
const UnauthenticatedError = require("../utils/errors/unauthenticatedError");
const UnauthorizedError = require("../utils/errors/unauthorizedError");
const NotFound = require("../utils/errors/notFound");

const createUser = async (req, res, next) => {
  const { username, email, password, address, phoneNumber, photo, role } =
    req.body;

  if (!email) {
    throw new BadRequestError("Email is required");
  }

  if (!username) {
    throw new BadRequestError("Username is required");
  }

  if (!password) {
    throw new BadRequestError("Password is required");
  }

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new BadRequestError("Email already exists");
  }

  const usernameAlreadyExists = await User.findOne({ username });
  if (usernameAlreadyExists) {
    throw new BadRequestError("Username already exists");
  }

  const user = await User.create(
    username,
    email,
    password,
    address || "",
    phoneNumber || "",
    photo || "",
    role || "buyer"
  );

  if (!user) {
    throw new ServerError("Failed to create user");
  }

  // Generate Token
  const token = jwt.sign({ userID: user._id }, SECRET, {
    expiresIn: EXPIRES_IN,
  });

  // remove password from user response
  userResponse = { ...user_.doc };
  delete userResponse.password;

  return res.status(201).json({ user: userResponse, token });
};

const loginUser = async (req, res, next) => {
  const { email, username, password } = req.body;

  if ((!email && !username) || !password) {
    throw new BadRequestError("Please provide username or email and password");
  }

  const user = await User.findOne({ $or: [{ email }, { username }] });
  if (!user) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  const token = jwt.sign({ userID: user._id }, SECRET, {
    expiresIn: EXPIRES_IN,
  });
  const userResponse = { ...user_.doc };
  delete userResponse.password;

  res.status(200).json({ user: userResponse, token });
};

const getUser = async (req, res, next) => {
  const userID = req.params.userID;
  const user = req.user;

  if (user._id != userID && user.role != "admin") {
    throw new UnauthorizedError(
      "You are not allowed to access this user details"
    );
  }

  const userDetails = await User.findById(userID).select("-password");
  res.status(200).json({ user: userDetails });
};

const getAllUsers = async (req, res, next) => {
  const user = req.user;

  if (user.role != "admin") {
    throw new UnauthorizedError("You are not allowed to access this route ");
  }
  const users = await User.find().select("-password");
  res.status(200).json({ users });
};

const updateUser = async (req, res, next) => {
  const userID = req.params.userId;
  const { username, email, address, phoneNumber, photo, role } = req.body;

  let user = await User.findById(userID);
  if (!user) {
    throw new NotFound("User not Found");
  }

  const loggedInUserId = req.user.userId;
  if (loggedInUserId !== userID) {
    throw new UnauthorizedError("You are not allowed to access this user");
  }

  user.username = username || user.username;
  user.email = email || user.email;
  user.address = address || user.address;
  user.phoneNumber = phoneNumber || user.phoneNumber;
  user.photo = photo || user.photo;
  user.role = role || user.role;

  user = await user.save();
  const updatedUser = { ...user.toJSON() };
  delete updatedUser.password;

  res.status(200).json({ user: updatedUser });
};

const deleteUser = async (req, res, next) => {
  const userID = req.params.userId;

  let user = await User.findById(userID);
  if (!user) {
    throw new NotFound("User not Found");
  }

  const loggedInUserId = req.user.userId;
  if (loggedInUserId !== userID) {
    throw new UnauthorizedError("You are not allowed to access this user");
  }

  await user.remove();


  res.status(304).json({ message: "user deleted succesfully"});
};

const updatePassword = async (req, res, next) => {
  console.log("password update");
};

const forgotPassword = async (req, res, next) => {
  console.log("password forgot");
};

const resetPassword = async (req, res, next) => {
  console.log("password reset");
};

module.exports = {
  createUser,
  getAllUsers,
  loginUser,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updatePassword,
  forgotPassword,
  resetPassword,
};
