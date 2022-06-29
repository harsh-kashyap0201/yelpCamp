const mongoose=require('mongoose');
const Schema=mongoose.Schema;
reviewSchema=new Schema({
    review:String,
    rating:Number,
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
});
module.exports=mongoose.model('Review',reviewSchema);
