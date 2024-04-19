const Joi = require("joi");

const registerSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{8,30}$")),
  phone_number: Joi.string().min(7),
  address: Joi.string().min(4),
  role: Joi.string().min(3).default("buyer")
});

module.exports = registerSchema;
