const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport=require("passport");
const {saveredirecturl}=require("../middleware.js");
const userc=require("../controllers/users.js");
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
})

router.route("/signup")
    .post(wrapAsync(userc.newuser))

router.route("/login")
    .get(userc.getuserform)
    .post(saveredirecturl,  passport.authenticate("local",{failureFlash:true, failureRedirect:"/login"}),userc.userlogin);

router.get("/logout", userc.userlogout);

module.exports=router;