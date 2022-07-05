const express=require("express");
const router=express.Router({mergeParams: true});
// const CatchAsync=require("../utils/catchAsync");
const {isLoggedin,isReviewAuthor} = require("../middleware");
const reviewController=require("../controllers/review");

CatchAsync=()=>{
    return(req,res,next)=>{
        func(req,res,next).catch(next);
    }
};

//adding reviews
router.post("/",isLoggedin,CatchAsync(reviewController.addReview));    

//delete review
router.delete("/:reviewId",isLoggedin,isReviewAuthor,CatchAsync(reviewController.deleteReview));

module.exports=router;