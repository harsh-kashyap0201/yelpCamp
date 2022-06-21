const express=require("express");
const router=express.Router();
const CatchAsync = require("../utils/catchAsync");
const Campground= require("../models/campground");

//rendering all campgrounds
router.get("/",CatchAsync(async(req,res)=>{
    const campgrounds=await Campground.find({});
    res.render("./campgrounds/campground.ejs",{campgrounds:campgrounds});
}));

//rendering add new campground form
router.get("/new",(req,res)=>{
    res.render("./campgrounds/new.ejs");
});

//adding new campground to db
router.post("/new",CatchAsync(async(req,res,next)=>{
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
router.get("/:id",CatchAsync(async(req,res)=>{
    const campground=await Campground.findById(req.params.id).populate("reviews");
    res.render("./campgrounds/show.ejs",{campground:campground});
}));

//rendering edit camground form
router.get("/:id/edit",CatchAsync(async(req,res)=>{
    const campground=await Campground.findById(req.params.id);
    res.render("./campgrounds/edit.ejs",{campground:campground});
}))

//updating campground by id in db
router.put("/:id",CatchAsync(async(req,res)=>{
    const campground=await Campground.findByIdAndUpdate(req.params.id,{ ...req.body},{runValidators:true});
    res.redirect("/campgrounds/"+req.params.id);
}))

//deleting campground by id in db
router.delete("/campgrounds/:id",CatchAsync(async(req,res)=>{
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect("/campgrounds");
}));

module.exports=router;