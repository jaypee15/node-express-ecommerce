const cloudinary = require("cloudinary");
const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_SECRET } =
  process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_SECRET,
});

const uploadImage = async (image) => {
    try {
      const result = await cloudinary.uploader.upload(image.url, {
        folder: 'user-profile-photos', 
        public_id: image.id,
      });
      return result; 
    } catch (error) {
      throw new Error("Failed to upload image");
    }
  };
  
  module.exports = uploadImage;

