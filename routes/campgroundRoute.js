const express=require("express");

const router=express.Router();
const CatchAsync = require("../utils/catchAsync");
const Campground= require("../models/campground");
const isLoggedin = require("../middleware");

//rendering all campgrounds
router.get("/",CatchAsync(async(req,res)=>{
    const campgrounds=await Campground.find({});
    res.render("./campgrounds/campground.ejs",{campgrounds:campgrounds});
}));

//rendering add new campground form
router.get("/new",isLoggedin,(req,res)=>{
    
    res.render("./campgrounds/new.ejs");

});

//adding new campground to db
router.post("/new",isLoggedin,CatchAsync(async(req,res,next)=>{
        const campground=new Campground({
            name:req.body.name,
            location:req.body.location,
            price:req.body.price,
            description:req.body.description,
            image:req.body.image
        });
        await campground.save();
        req.flash("success","Campground Added Successfully");
        res.redirect("/campgrounds");
}));

//rendering campground details by id
router.get("/:id",CatchAsync(async(req,res)=>{
    const campground=await Campground.findById(req.params.id).populate("reviews").populate("author");
    if(!campground){
        req.flash("error","Campground not found 😥");
        res.redirect("/campgrounds");
    }
    res.render("./campgrounds/show.ejs",{campground:campground});
}));

//rendering edit camground form
router.get("/:id/edit",isLoggedin,CatchAsync(async(req,res)=>{
    const campground=await Campground.findById(req.params.id);
    if(!campground){
        req.flash("error","Campground not found 😥");
        res.redirect("/campgrounds");
    }
    res.render("./campgrounds/edit.ejs",{campground:campground});
}))

//updating campground by id in db
router.put("/:id",isLoggedin,CatchAsync(async(req,res)=>{
    const campground=await Campground.findByIdAndUpdate(req.params.id,{ ...req.body},{runValidators:true});
    req.flash("success","Campground Updated Successfully");
    res.redirect("/campgrounds/"+req.params.id);
}))

//deleting campground by id in db
router.delete("/campgrounds/:id",isLoggedin,CatchAsync(async(req,res)=>{
    await Campground.findByIdAndDelete(req.params.id);
    req.flash("success","Campground Deleted Successfully");
    res.redirect("/campgrounds");
}));

module.exports=router;