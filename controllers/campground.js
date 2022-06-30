const Campground= require("../models/campground");
const {cloudinary}=require("../cloudinary/config");

module.exports.index=async(req,res)=>{
    const campgrounds=await Campground.find({});
    res.render("./campgrounds/campground.ejs",{campgrounds:campgrounds});
}

module.exports.renderNewForm=(req,res)=>{
    res.render("./campgrounds/new.ejs");
}

module.exports.addNewCampground=async(req,res,next)=>{
    const imgs=req.files.map(f=>({url:f.path,filename:f.filename}));
    for (let i = 0; i< imgs.length; i++) {
        if(imgs[i].size>5000){
            return req.flash("error","Image size should be less than 5MB");
        }
    }
    const campground=new Campground({
        name:req.body.name,
        location:req.body.location,
        price:req.body.price,
        description:req.body.description,
        images:imgs
    });
    campground.author=req.user._id;
    await campground.save();
    req.flash("success","Campground Added Successfully");
    res.redirect("/campgrounds");
}

module.exports.renderCampgroundDetails=async(req,res)=>{
    const campground=await Campground.findById(req.params.id).populate({
        path:"reviews",
        populate:{
            path:"author"
        }
    }).populate("author");
    
    if(!campground){
        req.flash("error","Campground not found 😥");
        res.redirect("/campgrounds");
    }
    res.render("./campgrounds/show.ejs",{campground:campground});
}

module.exports.renderEditForm=async(req,res)=>{
    const campground=await Campground.findById(req.params.id);
    if(!campground){
        req.flash("error","Campground not found 😥");
        res.redirect("/campgrounds");
    }
    res.render("./campgrounds/edit.ejs",{campground:campground});
}

module.exports.updateCampground=async(req,res)=>{
    const campground=await Campground.findByIdAndUpdate(req.params.id,{ ...req.body},{runValidators:true});
    const imgs=req.files.map(f=>({url:f.path,filename:f.filename}));
    campground.images.push(...imgs);
    await campground.save();
    if(req.body.deleteimg){
        for (let i =0;i<req.body.deleteimg.length;i++) {
            const filename=req.body.deleteimg[i];
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull:{images:{filename:{ $in:req.body.deleteimg}}}});
    }
    req.flash("success","Campground Updated Successfully");
    res.redirect("/campgrounds/"+req.params.id);
}

module.exports.deleteCampground=async(req,res)=>{
    await Campground.findByIdAndDelete(req.params.id);
    req.flash("success","Campground Deleted Successfully");
    res.redirect("/campgrounds");
}