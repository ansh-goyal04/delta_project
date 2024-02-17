const listing= require('./models/listing.js');
const review=require('./models/review.js');

const expressError=require('./utils/expressError.js');
const {listingschema,reviewschema}=require('./schema.js');



module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        // to redirect the user to that path that forced him to login first
        req.session.redirectUrl=req.originalUrl;
        req.flash('error','Login required!');
        return res.redirect('/login');
      }
      next();
};

// use this middleware to redirect to the same url 
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

// middleware for authorisation of listings

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let currListing= await listing.findById(id);
    if(!currListing.owner.equals(res.locals.currUser._id)){
        req.flash('error','you are not the owner!');
        return res.redirect(`/home/${id}`);
    }
    next();
}

// for server side listing using joi
// for listings

module.exports.validateListing =(req,res,next)=>{
    let {error}=listingschema.validate(req.body);
  
    if(error){
      throw new expressError(400,error)
    }
    else{
      next();
    }
  }


// for server side listing using joi

// for reviews
module.exports.validateReview =(req,res,next)=>{
    let {error}=reviewschema.validate(req.body);
  
    if(error){
      throw new expressError(400,error)
    }
    else{
      next();
    }
  }

// middleware for authoriation of reviews
  module.exports.isAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let currReview= await review.findById(reviewId);
    if(!currReview.author.equals(res.locals.currUser._id)){
        req.flash('error','you are not the author of this review!');
        return res.redirect(`/home/${id}`);
    }
    next();
}