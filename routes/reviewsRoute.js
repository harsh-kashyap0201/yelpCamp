const express=require("express");
const router=express.Router({mergeParams: true});
const CatchAsync=require("../utils/catchAsync");
const Review= require("../models/review");
const Campground= require("../models/campground");
const { merge } = require("./campgroundRoute");

//adding reviews
router.post("/",CatchAsync(async(req,res)=>{
    const campground=await Campground.findById(req.params.id);
    const review=new Review({
        review:req.body.review,
        rating:req.body.rating
    });
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success","Review Added Successfully")
    res.redirect("/campgrounds/"+req.params.id);
}));    

//delete review
router.delete("/:reviewId",CatchAsync(async(req,res)=>{
    const {id,reviewId}=req.params;
    
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:{id:reviewId}}});
    await Review.findByIdAndDelete(reviewId);
    if(!Campground){
        req.flash("error","Campground not found 😥");
        res.redirect("/campgrounds");
    }
    if(!Review ){
        req.flash("error","Campground not found 😥");
        res.redirect("/campgrounds");
    }
    req.flash("success","Review Deleted Successfully");
    res.redirect("/campgrounds/"+id);
}));

module.exports=router;