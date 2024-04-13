require("dotenv").config();

const { EXPIRES_IN, SECRET } = process.env;

const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const emailService = require("..utils/emailService");
const randomstring = require("randomstring");
const moment = require("moment");

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

  req.user = {
    Status: "success",
    userId: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
  };

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

  req.user = {
    Status: "success",
    userId: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
  };

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
  const userID = req.params.userID;
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

  req.user = {
    Status: "success",
    userId: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
  };

  const updatedUser = { ...user.toJSON() };
  delete updatedUser.password;

  res.status(200).json({ user: updatedUser });
};

const deleteUser = async (req, res, next) => {
  const userID = req.params.userID;

  const user = await User.findById(userID);
  if (!user) {
    throw new NotFound("User not Found");
  }

  const loggedInUserId = req.user.userId;
  if (loggedInUserId !== userID) {
    throw new UnauthorizedError("You are not allowed to access this user");
  }

  await user.remove();

  res.status(304).json({ message: "user deleted succesfully" });
};

const updatePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const userID = req.params.userID;

  const user = await User.findById(userID);
  if (!user) {
    throw new NotFound("User not Found");
  }

  const loggedInUserId = req.user.userId;
  if (loggedInUserId !== userID) {
    throw new UnauthorizedError("You are not allowed to access this route");
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({ message: "Password updated successfully" });
};

const forgotPassword = async (req, res, next) => {
  const email = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new NotFound("user not found");
    }

    const otp = randomstring.generate({
      length: 6,
      charset: "numeric",
    });

    const expirationTime = moment().add(10, "minute").toDate();

    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = expirationTime;
    await user.save();

    await emailService.sendEmail(
      email,
      "Password Reset OTP",
      `Your OTP for resetting your password is: ${otp}. It will expire in 10 minutes.`
    );

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    throw new ServerError("Internal Server Error");
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, token, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new NotFound("user not found");
    }
    if (
      user.resetPasswordOTP !== token ||
      new Date() > user.resetPasswordExpires
    ) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }
    user.password = newPassword;
    user.resetPasswordOTP = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    throw new ServerError("Internal Server Error");
  }
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
