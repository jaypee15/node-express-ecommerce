const createUser = async (req, res, next) => {
  console.log("create user endpoint");
};

const loginUser = async (req, res, next) => {
  console.log("login user");
};

const getUser = async (req, res, next) => {
  console.log("get user");
};

const getAllUsers = async (req, res, next) => {
  console.log("get all users endpoint");
  res.status(200).json({ mesage: "get all users" });
};

const updateUser = async (req, res, next) => {
  console.log("update user");
};

const deleteUser = async (req, res, next) => {
  console.log("delete user");
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
