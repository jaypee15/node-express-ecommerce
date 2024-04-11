const { StatusCodes } = require("http-status-codes");
const customError = require("./customError");

class UnauthorizedError extends customError {
  constructor(message) {
    super(message);
    this.StatusCodes = StatusCodes.FORBIDDEN;
  }
}

module.exports = UnauthorizedError;