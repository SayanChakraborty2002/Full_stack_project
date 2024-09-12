const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js");
const userController=require("../controllers/users.js");

router.route("/signup")
.get(userController.renderSignupForm)             //signup form
.post(wrapAsync(userController.signup));          //signup

router.route("/login")
.get(userController.renderLoginForm)              //login form
.post(                                            //log in
    saveRedirectUrl,
    passport.authenticate(
        "local",
        {
            failureRedirect:"/login",
            failureFlash:true
        }
    ),
    userController.login
);

//Logout
router.get("/logout",userController.logOut);

module.exports=router;

//PREVIOUS EASY CODE
//signup form
// router.get("/signup",userController.renderSignupForm);

// //signup
// router.post("/signup",wrapAsync(userController.signup))

// //login form
// router.get("/login",userController.renderLoginForm);

// //log in
// router.post("/login",
//     saveRedirectUrl,
//     passport.authenticate(
//         "local",
//         {
//             failureRedirect:"/login",
//             failureFlash:true
//         }
//     ),
//     userController.login
// )

