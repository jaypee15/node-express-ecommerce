const { Schema, model } = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: [true, "a user with this username already exists"],
      required: [true, "Please provide a name"],
      minlength: [3, "username must be more than three characters"],
      maxlength: [50, "username must not be more than fifty characters"],
      trim: true,
    },

    email: {
      type: String,
      unique: [true, "a user with this email already exists"],
      required: [true, "Please provide an email address"],
      validate: {
        validator: validator.isEmail,
        message: "Pleses provide a valid email address",
      },
      trim: true,
      lowerCase: true,
    },

    phoneNumber: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    photo: {
      // TODO: store photo on cloudinary
      type: String,
    },

    role: {
      type: String,
      emun: ["admin", "buyer", "seller"],
      default: "buyer",
    },
    password: {
      type: String,
      required: [true, "user must have a password"],
      select: false,
      minLength: [8, "Password must ba at least 8 characters"],
    },

    resetPasswordOTP: {
      type: String,
    },

    resetPasswordExpires: {
      type: Date,
    }

  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = model("User", userSchema);
module.exports = User;
