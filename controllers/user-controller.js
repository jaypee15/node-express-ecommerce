require("dotenv").config();

const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/emailService");
const randomstring = require("randomstring");
const moment = require("moment");
const uploadImage = require("../utils/cloudinary");
const multer = require("multer");
const asyncHandler = require("express-async-handler");
const ErrorObject = require("../utils/error");
const { message } = require("../validators/register");

const { EXPIRES_IN, SECRET } = process.env;

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image")) {
      return cb(new BadRequestError("Please upload an image file"), false);
    }
    cb(null, true);
  },
}).single("photo");

const createUser = asyncHandler(async (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(err);
    }

    const { username, email, password, address, phoneNumber, role } = req.body;
    let photo = "";

    if (req.file) {
      try {
        const result = await uploadImage(req.file.buffer);
        photo = result.secure_url;
      } catch (error) {
        return res
          .status(500)
          .json({ message: "Failed to upload image to Cloudinary" });
      }
    }

    if (!email || !username || !password) {
      return next(
        new ErrorObject("email, username, password are all required", 400)
      );
    }

    const emailAlreadyExists = await User.findOne({ email });
    if (emailAlreadyExists) {
      return next(new ErrorObject("email already exists", 400));
    }

    const usernameAlreadyExists = await User.findOne({ username });
    if (usernameAlreadyExists) {
      return next(new ErrorObject("username already exists", 400));
    }

    const user = await User.create({
      username,
      email,
      password,
      address: address || "",
      phoneNumber: phoneNumber || "",
      photo: photo,
      role: role || "buyer",
    });

    // Generate Token
    const token = jwt.sign({ userID: user._id, role: user.role }, SECRET, {
      expiresIn: EXPIRES_IN,
    });

    // Construct user response object
    const userResponse = {
      Status: "success",
      userId: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token,
    };

    req.user = userResponse;

    return res.status(201).json({ user: userResponse });
  });
});

const loginUser = async (req, res, next) => {
  const { email, username, password } = req.body;

  if ((!email && !username) || !password) {
    return next(
      new ErrorObject("Please provide username or email and password", 400)
    );
  }

  const user = await User.findOne({ $or: [{ email }, { username }] }).select(
    "+password"
  );
  if (!user) {
    return next(new ErrorObject("Invalid Credentials", 400));
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return next(new ErrorObject("Invalid Credentials", 400));
  }

  const token = jwt.sign({ userID: user._id, role: user.role }, SECRET, {
    expiresIn: EXPIRES_IN,
  });

  // Construct user response object
  const userResponse = {
    Status: "success",
    userId: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    token,
  };

  req.user = userResponse;

  return res.status(200).json({ user: userResponse });
};

const getUser = async (req, res, next) => {
  const userID = req.params.userID;
  const user = req.user;

  if (user._id != userID || user.role != "admin") {
    return next(
      new ErrorObject("You are not allowed to access this user details", 401)
    );
  }

  const userDetails = await User.findById(userID).select("-password");
  res.status(200).json({ user: userDetails });
};

const getAllUsers = async (req, res, next) => {
  const user = req.user;

  if (user.role != "admin") {
    return next(
      new ErrorObject("You are not allowed to access this user details", 401)
    );
  }
  const users = await User.find().select("-password");
  res.status(200).json({ users });
};

const updateUser = async (req, res, next) => {
  const userID = req.params.userID;
  const { username, email, address, phoneNumber, photo, role } = req.body;

  const loggedInUserId = req.user.userID;
  if (loggedInUserId !== userID) {
    return next(
      new ErrorObject("You are not allowed to access this user", 401)
    );
  }
  let user = await User.findById(userId);

  if (!user) {
    return next(new ErrorObject("User not Found", 404));
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

  const loggedInUserId = req.user.userID;
  if (loggedInUserId !== userID) {
    return next(
      new ErrorObject("You are not allowed to access this user", 401)
    );
  }

  const user = await User.findByIdAndDelete(userID);
  if (!user) {
    return next(new ErrorObject("User not Found", 404));
  }

  res.status(204).json({ message: "user deleted succesfully" });
};

const updatePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const userID = req.params.userID;
  if (!currentPassword || !newPassword) {
    return next(new ErrorObject("provide both passwords", 400))
  }

  if(currentPassword == newPassword) {
    return res.status(400).json({message: "make a change of password please"})
  }

  const loggedInUserId = req.user.userID;
  if (loggedInUserId !== userID) {
    return next(
      new ErrorObject("You are not allowed to access this route", 401)
    );
  }

  const user = await User.findById(userID).select("+password");
  if (!user) {
    return next(new ErrorObject("User not Found", 404));
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    return next(new ErrorObject("Invalid Credentials", 400));
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({ message: "Password updated successfully" });
};

const forgotPassword = async (req, res, next) => {
  
  const userID = req.params.userID
  const loggedInUserId = req.user.userID;
  if (loggedInUserId !== userID) {
    return next(
      new ErrorObject("You are not allowed to access this route", 401)
    );
  }

  const user = await User.findById(userID);
  if (!user) {
    return next(new ErrorObject("user not found", 404));
  }

console.log(user)
email = user.email

  const otp = randomstring.generate({
    length: 6,
    charset: "numeric",
  });

  const expirationTime = moment().add(10, "minute").toDate();

  user.resetPasswordOTP = otp;
  user.resetPasswordExpires = expirationTime;
  await user.save();

  await sendEmail(
    email,
    "Password Reset OTP",
    `Your OTP for resetting your password is: ${otp}. It will expire in 10 minutes.`,
    next
  );

  res.status(200).json({ message: "OTP sent to your email" });
};

const resetPassword = async (req, res, next) => {
  const { email, token, newPassword } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorObject("user not found", 404));
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
