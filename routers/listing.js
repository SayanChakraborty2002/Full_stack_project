const express=require("express");
const router=express.Router();
const Listing= require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isloggedin,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload =multer({storage});


router.route("/")
.get( wrapAsync(listingController.index))
.post(
    isloggedin,
    upload.single('Listing[image][url]'),
    validateListing,
    wrapAsync(listingController.createListings)
);


//New Route
router.get("/new",isloggedin,
    listingController.renderNewForm
)

router.route("/:id")
.get(wrapAsync(listingController.showListings))
.put(isloggedin,isOwner,
    upload.single('Listing[image][url]'),
    validateListing,
    wrapAsync(listingController.updateListings))
.delete(isloggedin,isOwner,
    wrapAsync(listingController.destroyListings)
);

//edit Route
router.get("/:id/edit",isloggedin,isOwner,
    wrapAsync(listingController.renderEditForm)
);

module.exports=router;


// PREVIOUS EASY CODE

// //Index Route
// router.get("/", wrapAsync(listingController.index));

// //Show Route
// router.get("/:id",wrapAsync(listingController.showListings));

// //Create Route
// router.post("/",isloggedin,validateListing,
//     wrapAsync(listingController.createListings)
// );

// //Update Route
// router.put("/:id",isloggedin,isOwner,validateListing,
//     wrapAsync(listingController.updateListings)
// )

// //Delete route
// router.delete("/:id",isloggedin,isOwner,
//     wrapAsync(listingController.destroyListings)
// )

