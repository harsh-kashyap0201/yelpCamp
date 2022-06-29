const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const Review=require('./review');
campGroundSchema=new Schema({
    name:String,
    price:Number,
    description:String,
    location:String,
    image:String,
    author:[{
        type:Schema.Types.ObjectId,
        ref:"User"
    }],
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
});

campGroundSchema.post('findOneAndDelete', async function(doc) {
    if(doc){
        await Review.remove({_id: {$in: doc.reviews}});
    }

})

module.exports=mongoose.model('Campground',campGroundSchema);
