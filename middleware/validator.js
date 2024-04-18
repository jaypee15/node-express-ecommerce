const createHttpError = require("http-errors");
const Joi = require("joi");

const Validators = require("../validators");
const ErrorObject = require("../utils/error");

module.exports = function (validator) {
  // if validator does not exist throw error
  if (!Validators.hasOwnProperty(validator))
    throw new ErrorObject("validator nonexistent", 500);

  return async function (req, res, next) {
    try {
      const validated = await Validators[validator].validateAsync(req.body);
      req.body = validated;
      next();
    } catch (error) {
      if (error.isJoi)
        return next(new ErrorObject(error, 400));
    
      next(error);
    }
  };
};
