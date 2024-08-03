const listing = require("../models/listing.js");
const {listingschema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const mbxgeocoding=require("@mapbox/mapbox-sdk/services/geocoding");
const maptoken = process.env.MAP_TOKEN;
const geocodingClient=mbxgeocoding({accessToken:maptoken});

module.exports.index=async (req,res)=>{
    let alllistings= await listing.find({});
    res.render("listings/index.ejs",{ alllistings });
}

module.exports.rendernewform=(req,res)=>{
    res.render("listings/new.ejs");
}
module.exports.showlistings=async(req,res)=>{
    let {id} = req.params;
    let data = await listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if(!data){
        req.flash("error","Listing you requested have been removed");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{data});
}
module.exports.showeditlisting=async (req,res)=>{
    let {id}=req.params;
    let olddata= await listing.findById(id);
    if(!olddata){
        req.flash("error","Listing you requested have been removed");
        res.redirect("/listings");
    }
    let editimage=olddata.image.url;
    olddata.image.url=editimage.replace("/upload","/upload/h_200,w_250");
    res.render("listings/edit.ejs",{olddata});
}

module.exports.newlisting=async (req,res)=>{
    let response = await geocodingClient.forwardGeocode({
        query: req.body.list.location,
        limit: 1,
      })
    .send();
    let url = req.file.path;
    let filename = req.file.filename;
    let newlist=new listing(req.body.list);
    newlist.image={url,filename};
    newlist.owner=req.user._id;
    newlist.geometry=response.body.features[0].geometry;
    newlist.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
};

module.exports.editlisting=async (req,res)=>{
    let data=req.body.list;
    let {id}=req.params;
    let listing1=await listing.findByIdAndUpdate(id,{...req.body.list});
    if(typeof req.file!=="undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing1.image={url,filename};
    await listing1.save();
    }
    req.flash("success","Listing Updated!");
    res.redirect("/listings");
}

module.exports.removelisting=async(req,res)=>{
    let {id}=req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};