const express=require("express");
const router=express.Router({mergeParams: true});
const User=require("../models/user");
const CatchAsync=require("../utils/catchAsync");
const passport=require("passport");
//signup route
router.get("/signup",(req,res)=>{
    res.render("users/signup");
});

router.post("/signup",CatchAsync(async(req,res)=>{
    try {
        const {username , email, password}=req.body;
        const newUser=new User({
            username,
            email
        });
        const registeredUser=await User.register(newUser,password);
        console.log(registeredUser);
        req.flash("success","You are registered and can log in");
        res.redirect("/campgrounds");
    } catch (error) {
        req.flash("error",error.message);
        res.redirect("/campgrounds");
    }
}));

//login route
router.get("/login",(req,res)=>{
    res.render("users/login");
});

router.post("/login",passport.authenticate('local',{failureFlash: true,failureRedirect: '/login'}),CatchAsync(async(req,res)=>{
    req.flash("success","You are logged in");
    res.redirect("/campgrounds");
}));

module.exports=router;