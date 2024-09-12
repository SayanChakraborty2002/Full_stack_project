const Review= require("../models/reviews.js");
const Listing= require("../models/listing.js");

//Create Review
module.exports.createReview= async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview= new Review(req.body.review);   
    newReview.author=req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    // res.send("Review saved");
    // console.log("review saved");
    req.flash("success","New review added");
    res.redirect(`/listings/${listing.id}`);
}

//Delete Review
module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted");
    res.redirect(`/listings/${id}`);
}