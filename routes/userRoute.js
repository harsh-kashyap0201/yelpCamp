const express=require("express");
const router=express.Router({mergeParams: true});
const User=require("../models/user");
const CatchAsync=require("../utils/catchAsync");
const passport=require("passport");
//signup route
router.get("/signup",(req,res)=>{
    res.render("users/signup");
});

router.post("/signup",CatchAsync(async(req,res,next)=>{
    try {
        const {username , email, password}=req.body;
        const newUser=new User({
            username,
            email
        });
        const registeredUser=await User.register(newUser,password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","You are registered and logged in");
            const returnTo=req.session.returnTo || "/campgrounds";
            
            res.redirect(returnTo);
        });
        
    } catch (error) {
        req.flash("error",error.message);
        res.redirect("/campgrounds");
    }
}));

//login route
router.get("/login",(req,res)=>{
    res.render("users/login");
    // console.log(req.session);
});

router.post("/login",passport.authenticate('local',{failureFlash: true,failureRedirect: '/login'}),CatchAsync(async(req,res)=>{
    const returnTo=req.session.returnTo || "/campgrounds";
    req.flash("success","You are logged in");
    // console.log(req.session);
    res.redirect(returnTo);
    
}));

//logout route
router.get("/logout",(req,res,next)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', 'You are logged out');
        res.redirect('/campgrounds');
    });
});

module.exports=router;