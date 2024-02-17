const express=require('express');
const router=express.Router({mergeParams:true});
const review=require('../models/review.js');
const listing= require('../models/listing.js');

const wrapAsync=require('../utils/wrapAsync.js');
const expressError=require('../utils/expressError.js');
const {listingschema,reviewschema}=require('../schema.js');

const { isLoggedIn, isAuthor ,validateReview} = require('../middleware.js');
const listingcontroller=require('../controllers/reviews.js');


// / reviews
// post route

router.post('/',isLoggedIn,validateReview,wrapAsync(listingcontroller.createReview));

// delete route for review
// in this case we delete a review , so we delete it from reviews collection and remove it from reviews 
// array from the listing
// if we delete a listing the reviews have to be deleted from the reviews collection
router.delete('/:reviewId',isLoggedIn,isAuthor,wrapAsync(listingcontroller.destroyReview));

module.exports=router;