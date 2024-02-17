const express=require('express');
const router=express.Router();
const User= require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');

const listingcontroller=require('../controllers/users.js');

// signup route
router
.route('/signup')
.get(listingcontroller.renderSignupForm)
.post(wrapAsync(listingcontroller.signup));


// login route
router
.route('/login')
.get(listingcontroller.renderLoginForm)
.post(saveRedirectUrl,passport.authenticate('local', { 
    failureRedirect: '/login',
    failureFlash:true,
 }),listingcontroller.login);

// logOut route

router.get('/logout',listingcontroller.logout);


module.exports=router;