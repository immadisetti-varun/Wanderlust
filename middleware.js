const listing = require("./models/listing");
const {listingschema,reviewSchema}=require("./schema.js");
const ExpressError=require("./utils/ExpressError.js");
const Review=require("./models/reviews");

module.exports.isLoggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirecturl=req.originalUrl;
        req.flash("error", "Login to perform any action");
        return res.redirect("/users/login");
    }
    next();
};

module.exports.saveredirecturl=(req,res,next)=>{
    if(req.session.redirecturl){
        res.locals.redirecturl=req.session.redirecturl;
    }
    next();
};

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let list=await listing.findById(id);
    if(!list.owner.equals(res.locals.curruser._id)){
        req.flash("error", "You don't have perimission to perform this action");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.schemavalidate=(req,res,next)=>{
    let {error}=listingschema.validate(req.body);
    if(error){
        let errmsg=error.details.map((er)=>er.message).join(",");
        throw new ExpressError(400,errmsg);
    }
    else{
        next();
    }
}

module.exports.reviewvalidate=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((er)=>er.message).join(",");
        throw new ExpressError(400,errmsg);
    }
    else{
        next();
    }
}

module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewid}=req.params;
    let review=await Review.findById(reviewid);
    if(!review.author._id.equals(res.locals.curruser._id)){
        req.flash("error", "You don't have perimission to perform this action");
        return res.redirect(`/listings/${id}`);
    }
    next();
};