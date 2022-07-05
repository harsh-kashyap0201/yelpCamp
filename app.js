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
//handling errors
const ExpressError=require('./utils/ExpressError');
//session management
const session=require('express-session');
//flash messages
const flash=require('connect-flash');
const passport=require('passport');
const localStartegy=require('passport-local');
const User=require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");
const MongoStore = require('connect-mongo');
// To remove data using these defaults:
app.use(mongoSanitize());
// app.use(helmet({contentSecurityPolicy: false}));
//contentSecurityPolicy
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/856e27698d.js",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/js/bootstrap.bundle.min.js",
    "https://fonts.googleapis.com/",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/js/bootstrap.bundle.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.min.js",
    "https://ka-f.fontawesome.com/"
];
const styleSrcUrls = [
    "https://kit.fontawesome.com/856e27698d.js",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css",
    "https://fonts.googleapis.com/",
    "https://ka-f.fontawesome.com/"
    
    
];
const connectSrcUrls = [
    "https://*.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://events.mapbox.com",
    "https://res.cloudinary.com/",
    "https://ka-f.fontawesome.com/"
];
const fontSrcUrls = [ "https://res.cloudinary.com/",
    "https://fonts.googleapis.com/",
    "https://fonts.gstatic.com",
    "https://ka-f.fontawesome.com/"
];

app.use(
    helmet.contentSecurityPolicy({
        directives : {
            defaultSrc : [],
            connectSrc : [ "'self'", ...connectSrcUrls ],
            scriptSrc  : [ "'unsafe-inline'", "'self'", ...scriptSrcUrls ],
            styleSrc   : [ "'self'", "'unsafe-inline'", ...styleSrcUrls ],
            workerSrc  : [ "'self'", "blob:" ],
            objectSrc  : [],
            imgSrc     : [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
                "https://images.unsplash.com/"
            ],
            fontSrc    : [ "'self'", ...fontSrcUrls ],
            mediaSrc   : [ "https://res.cloudinary.com/" ],
            childSrc   : [ "blob:" ]
        }
    })
);

app.use(express.static(path.join(__dirname, 'views')));

//handling requests other than get and post
app.use(methodOverride('_method'));
// const db_url=process.env.DB_URL;
const db_url=process.env.DB_URL || "mongodb://localhost:27017/yelp_camp";
mongoose.connect(db_url).then(()=>{
    console.log("Connected to DB");
}).catch(err=>{
    console.log("Error:",err.message);
}); 

app.engine ('ejs',ejsMate);
app.set('view engine', "ejs");
app.set('views',path.join(__dirname,"views"));

//parsing incoming request body to json
app.use(express.urlencoded({extended:true}));

const SECRET_KEY=process.env.SECRET_KEY || "secret";

const store= new MongoStore({
    mongoUrl:db_url,
    secret:SECRET_KEY,
    touchAfter:24*60*60
})
store.on("error",function(err){
    console.log(err);
});
//session config
const sessionConfig={
    store:store,
    name:'session',
    secret: SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: new Date(Date.now() + (1000 * 60 * 60 * 24 * 7)),
        maxAge: 1000*60*60*24*7,
        
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
const port=process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`server started on https://localhost:${port}`);
});
