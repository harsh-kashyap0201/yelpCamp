const User=require("../models/user");

module.exports.renderSignup=(req,res)=>{
    res.render("users/signup");
}

module.exports.signup=async(req,res,next)=>{
    try {
        const {username , email, password}=req.body;
        const newUser=new User({
            username,
            email
        });
        const registeredUser=await User.register(newUser,password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","You are registered and logged in");
            const returnTo=req.session.returnTo || "/campgrounds";
            
            res.redirect(returnTo);
        });
        
    } catch (error) {
        req.flash("error",error.message);
        res.redirect("/campgrounds");
    }
}

module.exports.renderLogin=(req,res)=>{
    res.render("users/login");
}

module.exports.login=async(req,res)=>{
    const returnTo=req.session.returnTo || "/campgrounds";
    req.flash("success","You are logged in");
    res.redirect(returnTo);
}

module.exports.logout=(req,res,next)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', 'You are logged out');
        res.redirect('/campgrounds');
    });
}