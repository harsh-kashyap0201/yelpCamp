const express=require("express");
const router=express.Router({mergeParams: true});
const CatchAsync=require("../utils/AsyncHandler");
const passport=require("passport");
const userController=require("../controllers/user");

//signup route
router.route("/signup")
    .get(userController.renderSignup)
    .post(CatchAsync(userController.signup));

//login route
router.route("/login")
    .get(userController.renderLogin)
    .post(passport.authenticate('local',{failureFlash: true,failureRedirect: '/login'}),CatchAsync(userController.login));

//logout route
router.get("/logout",userController.logout);

module.exports=router;