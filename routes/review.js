const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const listing = require("../models/listing.js");
const Review =require("../models/reviews.js");
const {reviewvalidate,isLoggedin,isReviewAuthor} = require("../middleware.js");
const reviewc=require("../controllers/reviews.js")

router.post("/", isLoggedin,reviewvalidate, wrapAsync(reviewc.newreview));

router.delete("/:reviewid",isLoggedin,isReviewAuthor,wrapAsync(reviewc.removereview));

module.exports=router;