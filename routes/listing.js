const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const listing = require("../models/listing.js");
const {isLoggedin, isOwner,schemavalidate}=require("../middleware.js");
const {listingschema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const listingsc=require("../controllers/listings.js");
const {storage} =require("../cloudConfig.js");
const multer = require("multer");
const upload = multer({storage});

router.route("/")
    .get(wrapAsync(listingsc.index))
    .post(isLoggedin,upload.single('list[image]'),schemavalidate,wrapAsync(listingsc.newlisting));


router.get("/new",isLoggedin,listingsc.rendernewform);

router.route("/:id")
    .get(wrapAsync(listingsc.showlistings))
    .put(isLoggedin,isOwner,upload.single('list[image]'),schemavalidate,wrapAsync(listingsc.editlisting))
    .delete(isLoggedin,isOwner,wrapAsync(listingsc.removelisting));




router.get("/:id/edit",isLoggedin,isOwner,wrapAsync(listingsc.showeditlisting));




module.exports = router;