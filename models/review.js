const mongoose=require('mongoose');
const Schema=mongoose.Schema;
reviewSchema=new Schema({
    review:String,
    rating:Number
});
module.exports=mongoose.model('Review',reviewSchema);
