const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// backend ko cloudinary ke sath jodne ke liye jo info chahiye use configure karenge
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
});

// this is similar to making a google drive folder 
// we are making a folder to store our data
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'trivago_dev',
     allowedFormats: ['png','jpg','jpeg']
    },
  });

module.exports={
    cloudinary,
    storage
} ; 