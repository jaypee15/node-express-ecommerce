const Joi = require("joi");
// set to use either email or password not both
const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  username: Joi.string().lowercase(),
  password: Joi.string().min(3).required(),
});

module.exports = loginSchema;
