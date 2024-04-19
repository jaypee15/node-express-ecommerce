const { required } = require("joi");
const {Schema, model} = require("momgoose");

const productSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please provide a product name"],
    },
    description: {
        type: String,
        required: [true, "Please provide a product description"],
    },
    richDescription: String,
    images: {
        type: [{
            type: String,
            validate: {
                validator: function(v){
                    return v.every(image => image.length < 2097152)
                },
                message: 'Image size should not exceed 2MB'
            }
        }],
        required: [true, "provide atleast one image"]
    },
    price: {
        type: Number,
        required: [true, "provide a price"],
    },
    discountRate: {
        type: Number
    }
})