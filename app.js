const express= require("express");
const app= express();
const path= require("path");
const mongoose= require("mongoose");
const Campground= require("./models/campground");
const Review= require("./models/review");
//ejs mate for making layout template
const ejsMate=require("ejs-mate");
//method overide to handle patch delete request
const methodOverride=require('method-override');
//async wrapper function to handle async errors
const CatchAsync=require('./utils/catchAsync');
//handling errors
const ExpressError=require('./utils/ExpressError');

app.use(express.static(path.join(__dirname, 'views')));

//handling requests other than get and post
app.use(methodOverride('_method'));

mongoose.connect("mongodb://localhost:27017/yelp_camp").then(()=>{
    console.log("Connected to DB");
}).catch(err=>{
    console.log("Error:",err.message);
}); 

app.engine ('ejs',ejsMate);
app.set('view engine', "ejs");
app.set('views',path.join(__dirname,"views"));

//parsing incoming request body to json
app.use(express.urlencoded({extended:true}));

//rendering homepage
app.get("/",(req,res)=>{
    res.render("home.ejs");
});

//campground routes
const campgroundRoute=require("./routes/campgroundRoute");
app.use("/campgrounds",campgroundRoute);

//adding reviews
app.post("/campgrounds/:id/reviews",CatchAsync(async(req,res)=>{
    const campground=await Campground.findById(req.params.id);
    const review=new Review({
        review:req.body.review,
        rating:req.body.rating
    });
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect("/campgrounds/"+req.params.id);
}));    

//delete review
app.delete("/campgrounds/:id/reviews/:reviewId",CatchAsync(async(req,res)=>{
    const {id,reviewId}=req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:{id:reviewId}}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect("/campgrounds/"+id);
}));

//handling error if req doesnt match
app.all("*",(req,res,next)=>{
    next(new ExpressError("Page not found",404));
});


app.use((err,req,res,next)=>{
    const {statusCode=500,message="Something Went Wrong!! "}=err;
    res.status(statusCode).render("./campgrounds/error.ejs",{message:message});
})

//listening to port 3000
app.listen(3000,()=>{
    console.log("server started");
});
