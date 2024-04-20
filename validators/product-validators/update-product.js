const Joi = require('joi');

const updateProductSchema = Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    richDescription: Joi.string().allow(null, ''), 
    images: Joi.array().items(Joi.string().max(2097152)), 
    price: Joi.number(),
    discountRate: Joi.number().max(100),
    rating: Joi.number().min(0).max(5), 
    quantity: Joi.number().integer(),
    isAvailable: Joi.boolean(),
    sellerId: Joi.string()
});

module.exports = updateProductSchema;
