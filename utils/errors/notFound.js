const { StatusCodes } = require("http-status-codes");
const customError = require("./customError");

class notFoundError extends customError{
    constructor(message){
        super(message)
        this.statusCodes = StatusCodes.NOT_FOUND;
    }
}