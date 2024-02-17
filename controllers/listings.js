const listing = require('../models/listing');

module.exports.index=async (req,res)=>{
    let alllistings=await listing.find();
    res.render('listings/index.ejs',{alllistings});
  };

module.exports.renderNewForm=(req,res)=>{
    
    res.render('listings/new.ejs');
  };
  
module.exports.createListing=async (req,res)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    let new_listing =new listing (req.body.listing);
    new_listing.owner=req.user._id;
    new_listing.image={url,filename};
    await new_listing.save();
    req.flash('success','new listing created!');
    res.redirect('/home');
  };
  
module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    let view_listing=await listing.findById(id)
    .populate({
      path:'reviews',
      populate:{
        path:'author'
      }
    
    })
    .populate('owner');
    if(!view_listing){
      req.flash('error','listing does not exist!');
      res.redirect('/home')
    }
    res.render('listings/show.ejs',{view_listing});
      
  }  ;

 module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    let edit_listing = await listing.findById(id);
    if(!edit_listing){
      req.flash('error','listing does not exist!');
      res.redirect('/home')
    }
    res.render('listings/edit.ejs',{edit_listing});
  
  };
  
module.exports.updateListing=async(req,res)=>{
    if (!req.body.listing){
      throw new expressError(400,'Enter valid data fro listing');
    }
    let {id}=req.params;
  
  let listing= await listing.findByIdAndUpdate(id,{...req.body.listing});
  // if we dont upload a new file the req.file will be undefined
  if(typeof req.file!=='undefined'){
  let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
  }
   req.flash('success','listing updated!');

   res.redirect(`/home/${id}`);
  
  };
  
module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    await listing.findByIdAndDelete(id);
    req.flash('success','listing deleted!');

    res.redirect('/home')
  }  