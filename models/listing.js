const { application } = require('express');
const mongoose = require('mongoose');
const Review=require("./reviews.js")
const Schema = mongoose.Schema;

const listingschema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  price: Number,
  country: String,
  image: {
    url: String,
    filename: String,
  },
  location: String,
  reviews:[{
    type:Schema.Types.ObjectId,
    ref:"Review"
  }],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
  },
  geometry:{
    type:{
      type:String,
      enum:['Point'],
      required:true
    },
    coordinates:{
      type:[Number],
      required:true
    }
  }
});


listingschema.post("findOneAndDelete", async(listing)=>{
  if(listing){
     await Review.deleteMany({_id:{$in:listing.reviews}})
  }
});

const Listing = mongoose.model('Listing', listingschema);
module.exports = Listing;
