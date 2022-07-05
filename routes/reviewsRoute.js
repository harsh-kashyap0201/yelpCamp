const express=require("express");
const router=express.Router({mergeParams: true});
const CatchAsync=require("../utils/catchAsync");
const {isLoggedin,isReviewAuthor} = require("../middleware");
const reviewController=require("../controllers/review");

//adding reviews
router.post("/",isLoggedin,CatchAsync(reviewController.addReview));    

//delete review
router.delete("/:reviewId",isLoggedin,isReviewAuthor,CatchAsync(reviewController.deleteReview));

module.exports=router;