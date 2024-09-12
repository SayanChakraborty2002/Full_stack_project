const express=require("express");
const router=express.Router({mergeParams:true});
const Listing= require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Review= require("../models/reviews.js");
const {validateReview,isloggedin,isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/reviews.js")

//Review 
// Review Post route
router.post("/",isloggedin,validateReview,wrapAsync(reviewController.createReview));

//Review Delete Route
router.delete("/:reviewId" ,
    isloggedin,isReviewAuthor,
    wrapAsync(reviewController.destroyReview)
)

module.exports=router;