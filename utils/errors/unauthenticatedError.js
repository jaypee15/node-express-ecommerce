const { StatusCodes } = require("http-status-codes");
const customError = require("./customError");

class UnauthenticatedError extends customError {
  constructor(message) {
    super(message);
    this.StatusCodes = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = UnauthenticatedError;