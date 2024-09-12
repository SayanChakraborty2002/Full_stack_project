if(process.env.NODE_ENV !="production"){
require('dotenv').config();
//console.log(process.env.SECRET) // remove this after you've confirmed it is working
}

const express=require("express");
const app= express();
const mongoose = require("mongoose");


const dbUrl=process.env.ATLASDB_URL;

main().then((res)=>{
    console.log("connected to Db");
}).catch((err)=>{
    console.log(err);
})
async function main() {
    await mongoose.connect(dbUrl);
}


const path = require("path");
const methodOverride= require('method-override');
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/expressErr.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const listingsRouter=require("./routers/listing.js");
const reviewsRouter=require("./routers/review.js");
const userRouter=require("./routers/user.js");


app.use(express.static(path.join(__dirname,"/public")));
app.engine('ejs', ejsMate);
app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600
});

store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STROE",err);
});

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized: true,
    cookie:{
        expires:Date.now()+7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        maxAge:7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    }
}

app.use(session(sessionOptions));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currentUser=req.user;
    next();
})

//Listing
app.use("/listings",listingsRouter);

//Reviews
app.use("/listings/:id/reviews",reviewsRouter);

// Signup
app.use("/",userRouter);


//error handler

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
})
app.use((err,req,res,next)=>{
    let { statusCode=500,message="Something went wrong!" }=err;
    res.status(statusCode).render("error.ejs",{message});
})


app.listen(8080,()=>{
    console.log("server is listening to port 8080");
})

