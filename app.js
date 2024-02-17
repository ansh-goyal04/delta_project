if(process.env.NODE_ENV!='production'){
  require('dotenv').config();
}
// console.log(process.env);
const express=require('express');
const app=express();
const mongoose = require('mongoose');
const listing= require('./models/listing.js');
app.set('view engine','ejs');
const path=require('path');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
const methodoverride=require('method-override');
app.use(methodoverride('_method'));
const ejsMate=require('ejs-mate');
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,'/public')));
const wrapAsync=require('./utils/wrapAsync.js');
const expressError=require('./utils/expressError.js');
const {listingschema,reviewschema}=require('./schema.js');

// requiring passport for authentication and user model
const passport=require('passport');
const localStrategy=require('passport-local');  
const User=require('./models/user.js');

const dbUrl=process.env.ATLASDB_URL;

const session=require('express-session');
const mongoStore=require('connect-mongo');
const flash= require('connect-flash');

// using mongo store for seesions
const store=mongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET
  },
  touchAfter:24*3600
});

store.on('error',()=>{
  console.log('error in mongo session store',err);
});

// session boilerplate
const sessionOptions={
  store,
  secret:process.env.SECRET,
  saveUninitialized:true,
  resave:false,
  cookie:{
    expires: Date.now()+ 7*24*60*60*1000,
    maxAge: 7*24*60*60*1000,
    httpOnly:true
  },

};



// using express session and flash alerts
app.use(session(sessionOptions));
app.use(flash());




// using passport for authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.success=req.flash('success');
  res.locals.error=req.flash('error');
  res.locals.currUser=req.user;
  next();
})


const listingRouter=require('./routes/listing.js');
const reviewRouter=require('./routes/review.js');
const userRouter=require('./routes/user.js');


const review=require('./models/review.js');

// const mongoUrl='mongodb://127.0.0.1:27017/trivago';
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);

}
app.listen(300,()=>{
    console.log('success');
});

// for server side listing using joi
// for listings

// listings route

app.use('/home',listingRouter);

app.use('/home/:id/reviews',reviewRouter);

app.use('/',userRouter);



// handling errors

app.all('*',(req,res,next)=>{
  next(new expressError(404,'Page not found')); 
})

app.use((err,req,res,next)=>{
  let {statuscode=500,message='something went wrong'}=err;
  
  res.status(statuscode).render('./error.ejs',{message})
})