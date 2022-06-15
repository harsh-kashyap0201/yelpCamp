const mongoose= require("mongoose");
const Campground= require("../models/campground");
const cities = require("./cities.js");
const {descriptors ,places} = require("./seedhelper.js");

mongoose.connect("mongodb://localhost:27017/yelp_camp").then(
    ()=>{
        console.log("Connected to DB");
    }).catch(err=>{
        console.log(err);
    });

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDb= async ()=>{
    try{
        await Campground.deleteMany({});
        for (let i = 0; i < 50; i++) {
            const random1000 = Math.floor(Math.random() * 1000);
            const camp = new Campground({
                location: `${cities[random1000].city}, ${cities[random1000].state}`,
                name: `${sample(descriptors).toLowerCase()} ${sample(places).toLowerCase()}`
            })
            await camp.save();
        }
    }
    catch(err){
        console.log(err);
    }
}

seedDb().then(()=>{
    console.log("Seeding complete");
    mongoose.connection.close();
});