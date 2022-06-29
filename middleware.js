const mongoose= require("mongoose");
const Campground= require("./models/campground");
const Review= require("./models/review");
const isLoggedin = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo=req.originalUrl;
        console.log(req.session);
        req.flash("error","You need to be logged in to do that");
        return res.redirect("/login");  
    }
    next();
} 

const isAuthenticated = async(req, res, next) => {
    const campground=await Campground.findById(req.params.id);
    if(!campground.author._id.equals(req.user._id)){
        req.flash("error","You are not authorized to do this😥");
        return res.redirect("/campgrounds");
    }
    next();
}

const isReviewAuthor = async(req, res, next) => {
    const review=await Review.findById(req.params.reviewId);
    if(!review.author._id.equals(req.user._id)){
        req.flash("error","You are not authorized to do this😥");
        return res.redirect("/campgrounds");
    }
    next();
}

module.exports = {isLoggedin,isAuthenticated,isReviewAuthor};