const express=require("express");
const router=express.Router();
const CatchAsync = require("../utils/catchAsync");
const {isLoggedin,isAuthenticated} = require("../middleware");
const camgroundController=require("../controllers/campground");
//rendering all campgrounds
router.get("/",CatchAsync(camgroundController.index));

router.route("/new")
    //rendering add new campground form 
    .get(isLoggedin,camgroundController.renderNewForm)
    //adding new campground to db
    .post(isLoggedin,CatchAsync(camgroundController.addNewCampground));

router.route("/:id")
    //rendering campground details by id
    .get(CatchAsync(camgroundController.renderCampgroundDetails))
    //updating campground by id in db
    .put(isLoggedin,isAuthenticated,CatchAsync(camgroundController.updateCampground))
    //deleting campground by id in db
    .delete(isLoggedin,isAuthenticated,CatchAsync(camgroundController.deleteCampground));

//rendering edit camground form
router.get("/:id/edit",isLoggedin,isAuthenticated,CatchAsync(camgroundController.renderEditForm))

module.exports=router;