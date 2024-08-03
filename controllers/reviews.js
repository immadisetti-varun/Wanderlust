const Review=require("../models/reviews");
const listing=require("../models/listing");
module.exports.newreview=async(req,res)=>{
    let {id} = req.params;
    let listing1 = await listing.findById(id);
    let review = new Review(req.body.review);
    review.author=req.user._id;
    await listing1.reviews.push(review);
    await listing1.save();
    await review.save();
    req.flash("success","Review Created!");
    res.redirect(`/listings/${listing1._id}`);
}

module.exports.removereview=async(req,res)=>{
    let{id,reviewid}=req.params;

    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    await Review.findByIdAndDelete(reviewid);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
}