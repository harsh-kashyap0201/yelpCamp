const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./indian cities.js");
const {
    descriptors,
    places
} = require("./seedhelper.js");
const db_url=process.env.DB_URL || "mongodb://localhost:27017/yelp_camp";
mongoose
    .connect(db_url)
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {
    try {
        await Campground.deleteMany({});
        for (let i = 0; i < 50; i++) {
            const random1000 = Math.floor(Math.random() * 500);
            const camp = new Campground({
                location: `${cities[random1000].name}, ${cities[random1000].state}`,
                name: `${sample(descriptors)} ${sample(places)}`,
                images: [{
                        url: "https://res.cloudinary.com/dupbox21b/image/upload/v1656965156/yelpcamp/qhklc3dzkr1ypm4ae7ap.jpg",
                        filename: "yelpcamp/qhklc3dzkr1ypm4ae7ap",
                    },
                    {
                        url: "https://res.cloudinary.com/dupbox21b/image/upload/v1656965337/yelpcamp/acsiyab5lam6g3tmbs6m.jpg",
                        filename: "yelpcamp/acsiyab5lam6g3tmbs6m",
                    },
                ],
                description: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero sint doloribus illum maiores iure repellat inventore magni labore deserunt expedita nobis est, consequuntur dignissimos distinctio officiis magnam numquam! Officiis, ut.`,
                price: Math.floor(Math.random() * 100) + 1000,
                author: "62c45a2f686093268eaf9201",
                geometry:{
                    type: "Point",
                    coordinates: [
                        cities[random1000].lon,
                        cities[random1000].lat
                    ]
                }
            });
            await camp.save();
        }
    } catch (err) {
        console.log(err);
    }
};

seedDb().then(() => {
    console.log("Seeding complete");
    mongoose.connection.close();
});