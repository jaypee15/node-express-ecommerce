const expressAsyncHandler = require("express-async-handler");
const ErrorObject = require("../utils/error");


const restrict = role => expressAsyncHandler(async (req, res, next) => {
    if (role.toLowerCase() === req.user.role.toLowerCase()){
        next();
    } else{
        next(new ErrorObject("You are not authorised", 401))
    }

})

module.exports = restrict;