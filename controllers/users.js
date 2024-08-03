const User = require("../models/user");

module.exports.newuser=async(req,res,next)=>{
    try{
    let {username, email, password} = req.body;
    const Newuser = new User({email,username});
    const registeredUser=await User.register(Newuser,password);
    req.login(registeredUser, (err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","user registered successfully");
        res.redirect("/listings");
    })
    }
    catch(e){
        req.flash("error", e.message);
        res.redirect("/users/signup");
    }
}

module.exports.getuserform= (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.userlogin=async(req,res)=>{
    req.flash("success","Login successful. Welcome to Wanderlust");
    let url=res.locals.redirecturl || "/listings";
    res.redirect(url)}


module.exports.userlogout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logout Successful");
        res.redirect("/listings");
    });
}