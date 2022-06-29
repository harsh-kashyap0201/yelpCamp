const isLoggedin = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo=req.originalUrl;
        console.log(req.session);
        req.flash("error","You need to be logged in to do that");
        return res.redirect("/login");  
    }
    next();
} 

module.exports = isLoggedin;