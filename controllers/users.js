const User=require("../models/user.js");

//sigup form
module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
}

//signup form
module.exports.signup=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser=new User({email,username});
        const registeredUser=await User.register(newUser,password);
        console.log(registeredUser);

        req.login(registeredUser,(err)=>{
            if(err){
                next(err);
            }else{
                req.flash("success","Welcome to Wanderlust");
                res.redirect("/listings");
            }
        })

    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

//login from
module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
}

//login
module.exports.login=async(req,res)=>{
    req.flash("success","Welcome back to Wanderlust");
    let redirectUrl = res.locals.redirectUrl || '/listings'; // Use fallback if not set
    res.redirect(redirectUrl);       
}

//logout
module.exports.logOut=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","logged you out");
        res.redirect("/listings");
    })
}

