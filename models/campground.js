const mongoose=require('mongoose');
const Schema=mongoose.Schema;
campGroundSchema=new Schema({
    name:String,
    price:Number,
    description:String,
    location:String,
    image:String,
    reviews: {
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }
});
module.exports=mongoose.model('Campground',campGroundSchema);
