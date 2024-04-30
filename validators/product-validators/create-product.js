const Joi = require('joi');

const createProductSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    richDescription: Joi.string().allow(null, ''), 
    images: Joi.array().items(Joi.string().max(2097152)).required(),
    price: Joi.number().required(),
    discountRate: Joi.number().max(100),
    rating: Joi.number().min(0).max(5).default(0), 
    quantity: Joi.number().integer().required(),
    isAvailable: Joi.boolean().required(),
    sellerId: Joi.string().required() 
});

module.exports = createProductSchema;
