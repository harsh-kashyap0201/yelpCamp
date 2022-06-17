const express= require("express");
const app= express();
const path= require("path");
const mongoose= require("mongoose");
const Campground= require("./models/campground");
//ejs mate for making layout template
const ejsMate=require("ejs-mate");
//method overide to handle patch delete request
const methodOverride=require('method-override');
//async wrapper function to handle async errors
const CatchAsync=require('./utils/catchAsync');
//handling errors
const ExpressError=require('./utils/ExpressError');

//handling requests other than get and post
app.use(methodOverride('_method'));

mongoose.connect("mongodb://localhost:27017/yelp_camp").then(()=>{
    console.log("Connected to DB");
}).catch(err=>{
    console.log("Error:",err.message);
}); 

app.engine  ('ejs',ejsMate);
app.set('view engine', "ejs");
app.set('views',path.join(__dirname,"views"));

//parsing incoming request body to json
app.use(express.urlencoded({extended:true}));

//rendering homepage
app.get("/",(req,res)=>{
    res.render("home.ejs");
});

//rendering all campgrounds
app.get("/campgrounds",CatchAsync(async(req,res)=>{
    const campgrounds=await Campground.find({});
    res.render("./campgrounds/campground.ejs",{campgrounds:campgrounds});
}));

//rendering add new campground form
app.get("/campgrounds/new",(req,res)=>{
    res.render("./campgrounds/new.ejs");
});

//adding new campground to db
app.post("/campgrounds/new",CatchAsync(async(req,res,next)=>{
    
        const campground=new Campground({
            name:req.body.name,
            location:req.body.location,
            price:req.body.price,
            description:req.body.description,
            image:req.body.image
        });
        await campground.save();
        res.redirect("/campgrounds");
}));

//rendering campground details by id
app.get("/campgrounds/:id",CatchAsync(async(req,res)=>{
    const campground=await Campground.findById(req.params.id);
    res.render("./campgrounds/show.ejs",{campground:campground});
}));

//rendering edit camground form
app.get("/campgrounds/:id/edit",CatchAsync(async(req,res)=>{
    const campground=await Campground.findById(req.params.id);
    res.render("./campgrounds/edit.ejs",{campground:campground});
}))

//updating campground by id in db
app.put("/campgrounds/:id",CatchAsync(async(req,res)=>{
    const campground=await Campground.findByIdAndUpdate(req.params.id,{ ...req.body},{runValidators:true});
    res.redirect("/campgrounds/"+req.params.id);
}))

//deleting campground by id in db
app.delete("/campgrounds/:id",CatchAsync(async(req,res)=>{
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect("/campgrounds");
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
