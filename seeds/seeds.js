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
                name: `${sample(descriptors)} ${sample(places)}`,
                image: `https://source.unsplash.com/collection/483251`,
                description: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero sint doloribus illum maiores iure repellat inventore magni labore deserunt expedita nobis est, consequuntur dignissimos distinctio officiis magnam numquam! Officiis, ut.`,
                price: Math.floor(Math.random() * 100)+1000
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