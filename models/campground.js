const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const Review=require('./review');
const opt={ toJson: { virtuals: true } };
campGroundSchema=new Schema({
    name:String,
    price:Number,
    description:String,
    location:String,
    geometry: {
        type: {
            type: String, 
            enum: ['Point'], 
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    images:[
        {
            url:String,
            filename:String
        }
    ],
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
},opt);

campGroundSchema.virtual('properties.popUpMarkup').get(function(){
    return 'text';
});

campGroundSchema.post('findOneAndDelete', async function(doc) {
    if(doc){
        await Review.remove({_id: {$in: doc.reviews}});
    }

})

module.exports=mongoose.model('Campground',campGroundSchema);
