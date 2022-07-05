const Campground= require("../models/campground");
const {cloudinary}=require("../cloudinary/config");
const mbxGeocode=require("@mapbox/mapbox-sdk/services/geocoding");
const mapboxtoken=process.env.mapbox_token;
const geocoder = mbxGeocode({accessToken:mapboxtoken});
module.exports.index=async(req,res)=>{
    const campgrounds=await Campground.find({});
    res.render("./campgrounds/campground.ejs",{campgrounds:campgrounds});
}
module.exports.allCampgrounds=async(req,res)=>{
    const campgrounds=await Campground.find({});
    res.render("./campgrounds/allCampgrounds.ejs",{campgrounds:campgrounds});
}


module.exports.search=async(req,res)=>{
    var thename = req.body.search;
    var query = { name: { $regex: thename, $options: 'i' } };
    // const campground = await Campground.find(query);
    // res.send(campgrounds);     
    const campground=await Campground.find(query).populate({
        path:"reviews",
        populate:{
            path:"author"
        }
    }).populate("author");
    if(campground.length==0){
        req.flash("error","Campground not found 😥");
        return res.redirect("/campgrounds");
    }
    // const length=campground.length;
    // res.send(campground);
    res.render("./campgrounds/show.ejs",{campground:campground[0]})          
} 




module.exports.renderNewForm=(req,res)=>{
    res.render("./campgrounds/new.ejs");
}

module.exports.addNewCampground=async(req,res,next)=>{
    const geoData = await geocoder.forwardGeocode({
        query: req.body.location,
        limit: 1
    }).send()
    // console.log(geoData);
    // res.send(geoData.body.features[0].geometry.coordinates);
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
        images:imgs,
        geometry:geoData.body.features[0].geometry
    });
    campground.author=req.user._id;
    await campground.save();
    // res.send(campground);
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
    const geoData = await geocoder.forwardGeocode({
        query: req.body.location,
        limit: 1
    }).send()
    const campground=await Campground.findByIdAndUpdate(req.params.id,{ ...req.body},{runValidators:true});
    const imgs=req.files.map(f=>({url:f.path,filename:f.filename}));
    campground.images.push(...imgs);
    campground.geometry=geoData.body.features[0].geometry
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
    const campground=await Campground.findById(req.params.id);
    const filename=campground.images.map(img=>img.filename);
    for(let i=0;i<filename.length;i++){
        await cloudinary.uploader.destroy(filename[i]);
    }
    await Campground.findByIdAndDelete(req.params.id);
    req.flash("success","Campground Deleted Successfully");
    res.redirect("/campgrounds");
}