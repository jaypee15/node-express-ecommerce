const { StatusCodes } = require("http-status-codes");
const customError = require("./customError");

class ServerError extends customError {
  constructor(message) {
    super(message);
    this.StatusCodes = StatusCodes.INTERNAL_SERVER_ERROR;
  }
}

module.exports = ServerError;
