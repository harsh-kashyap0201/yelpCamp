const express=require("express");
const router=express.Router();
const CatchAsync = require("../utils/catchAsync");
const {isLoggedin,isAuthenticated} = require("../middleware");
const camgroundController=require("../controllers/campground");
const {storage}=require("../cloudinary/config");
const multer  = require('multer')
const upload = multer({ storage: storage })


//rendering all campgrounds
router.get("/",CatchAsync(camgroundController.index));

router.get("/allCampgrounds",CatchAsync(camgroundController.allCampgrounds));

router.route("/new")
    //rendering add new campground form 
    .get(isLoggedin,camgroundController.renderNewForm)
    //adding new campground to db
    .post(isLoggedin,upload.array('image'),CatchAsync(camgroundController.addNewCampground));

router.route("/search")
    .post(CatchAsync(camgroundController.search));




router.route("/:id")
    //rendering campground details by id
    .get(CatchAsync(camgroundController.renderCampgroundDetails))
    //updating campground by id in db
    .put(isLoggedin,isAuthenticated,upload.array('image'),CatchAsync(camgroundController.updateCampground))
    //deleting campground by id in db
    .delete(isLoggedin,isAuthenticated,CatchAsync(camgroundController.deleteCampground));

//rendering edit camground form
router.get("/:id/edit",isLoggedin,isAuthenticated,CatchAsync(camgroundController.renderEditForm))

module.exports=router;