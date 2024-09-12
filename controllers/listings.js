const Listing=require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken:mapToken });

//Newform
module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
}

//Index
module.exports.index=async(req,res)=>{
    const allListing=await Listing.find({});
    res.render("listings/index.ejs",{allListing});
}

//Show listings
module.exports.showListings=async(req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id)
    .populate({path:"reviews",
        populate:{
            path:"author",
        },
    })
    .populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for doesn't exist"); 
        res.redirect("/listings");  
    }
    res.render("listings/show.ejs",{listing});
}

//Create listings
module.exports.createListings=async(req,res,next)=>{ 

    let response=await geocodingClient.forwardGeocode({
        query: req.body.Listing.location,
        limit: 1,
      })
        .send();
        
    let url=req.file.path;
    let filename=req.file.filename;   
    const newListing= new Listing(req.body.Listing);
    newListing.image={filename,url};
    newListing.owner=req.user._id;
    newListing.geometry=response.body.features[0].geometry;
    let savedListing=await newListing.save();
    req.flash("success","new user succesfully saved");
    res.redirect("/listings");
}

//Edit form
module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for doesn't exist"); 
        res.redirect("/listings");  
    }
    let originalImg=listing.image.url;
    originalImg=originalImg.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing,originalImg});
}

//Update listings
module.exports.updateListings= async(req,res)=>{
    const {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.Listing});

    let url=req.file.path;
    let filename=req.file.filename;  
    if(typeof req.file!="undefined"){
        listing.image={filename,url};
        listing.save();
    }
    req.flash("success","Listing succesfully updated");
    res.redirect("/listings");
}

//destroy
module.exports.destroyListings=async(req,res)=>{
    let {id}=req.params;
    const deletedPost=await Listing.findByIdAndDelete(id);
    console.log(deletedPost);
    req.flash("success","Listing succesfully deleted");
    res.redirect("/listings");
}