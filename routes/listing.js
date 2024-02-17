const express=require('express');
const router=express.Router();
const wrapAsync=require('../utils/wrapAsync.js');

const listing= require('../models/listing.js');
const { isLoggedIn, isOwner ,validateListing} = require('../middleware.js');

const listingcontroller=require('../controllers/listings.js');

const multer  = require('multer');
const{storage}=require('../cloudConfig.js')
// multer will store the files in a folder storage that we created in cloudinary
const upload = multer({ storage }) 

router
.route('/')
.get(wrapAsync(listingcontroller.index))
.post(isLoggedIn, upload.single('listing[image]'),validateListing,wrapAsync(listingcontroller.createListing))


 // // to create new listing
 router.get("/new",isLoggedIn,listingcontroller.renderNewForm);
  
router
.route('/:id')
.get(wrapAsync (listingcontroller.showListing))
.patch(isLoggedIn,isOwner, upload.single('listing[image]'),wrapAsync(listingcontroller.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingcontroller.destroyListing));
  
 
  // edit route
  
  router.get('/:id/edit',isLoggedIn,isOwner,wrapAsync(listingcontroller.renderEditForm)
  );
   
  module.exports=router;
