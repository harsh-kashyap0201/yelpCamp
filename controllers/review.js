const Review= require("../models/review");
const Campground= require("../models/campground");
module.exports.addReview=async(req,res)=>{
    const campground=await Campground.findById(req.params.id);
    const review=new Review({
        review:req.body.review,
        rating:req.body.rating
    });
    review.author=req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success","Review Added Successfully")
    res.redirect("/campgrounds/"+req.params.id);
}

module.exports.deleteReview=async(req,res)=>{
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
}