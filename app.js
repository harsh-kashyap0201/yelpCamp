if(process.env.NODE_ENV != 'production') {
    require('dotenv').config();
}
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
//session management
const session=require('express-session');
//flash messages
const flash=require('connect-flash');
const passport=require('passport');
const localStartegy=require('passport-local');
const User=require('./models/user');

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

//session config
const sessionConfig={
    secret: "secretkeyforsession",
    resave: false,
    saveUninitialized: true,
    signed:true,
    cookie: {
        maxAge: 1000*60*60*24*7,
        httpOnly: true
        
    }   
};

app.use(session(sessionConfig));
app.use(flash());
//initializing passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStartegy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser=req.user;
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
});


//rendering homepage
app.get("/",(req,res)=>{
    res.render("home.ejs");
});

//campground routes
const campgroundRoute=require("./routes/campgroundRoute");
app.use("/campgrounds",campgroundRoute);

//review routes
const reviewsRoute=require("./routes/reviewsRoute");
app.use("/campgrounds/:id/reviews",reviewsRoute);

//user routes
const userRoute=require("./routes/userRoute")
app.use("/",userRoute)

//handling error if req doesnt match
app.all("*",(req,res,next)=>{
    next(new ExpressError("Page not found",404));
});

//handling error
app.use((err,req,res,next)=>{
    const {statusCode=500,message="Something Went Wrong!! "}=err;
    res.status(statusCode).render("./campgrounds/error.ejs",{message:message});
})

//listening to port 3000
app.listen(3000,()=>{
    console.log("server started");
});
