const cloudinary = require("cloudinary");
const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const uploadImage = async (image, folder) => {
      const result = await cloudinary.uploader.upload(image.url, {
        folder, 
        public_id: image.id,
      });
      return result; 
  };
  
  module.exports = uploadImage;

