const express= require("express");
const app= express();
const path= require("path");
const mongoose= require("mongoose");
const Campground= require("./models/campground");

mongoose.connect("mongodb://localhost:27017/yelp_camp").then(()=>{
    console.log("Connected to DB");
}).catch(err=>{
    console.log("Error:",err.message);
}); 

app.set('view engine', "ejs");
app.set('views',path.join(__dirname,"views"));
//parsing incoming request body to json
app.use(express.urlencoded({extended:true}));

app.get("/",(req,res)=>{
    res.render("home.ejs");
});

app.get("/campgrounds",async(req,res)=>{
    const campgrounds=await Campground.find({});
    res.render("./campgrounds/campground.ejs",{campgrounds:campgrounds});
});

app.get("/campgrounds/new",(req,res)=>{
    res.render("./campgrounds/new.ejs");
});

app.post("/campgrounds/new",async(req,res)=>{
    const campground=new Campground({
        name:req.body.name,
        location:req.body.location
    });
    await campground.save();
    res.redirect("/campgrounds");
});


app.get("/campgrounds/:id",async(req,res)=>{
    const campground=await Campground.findById(req.params.id);
    res.render("./campgrounds/show.ejs",{campground:campground});
})


app.listen(3000,()=>{
    console.log("server started");
});
