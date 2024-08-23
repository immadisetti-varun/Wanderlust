if(process.env.NODE_ENV !="production"){
    require("dotenv").config();
}

const dburl=process.env.DB_URL;

const express = require("express");
const app=express();
const mongoose=require("mongoose");
const path = require("path");
const methodoverride=require("method-override");
const ejsmate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const {listingschema,reviewSchema}=require("./schema.js");
app.set("view engine", "ejs")
const listings=require("./routes/listing.js");
const users=require("./routes/users.js");
const reviews=require("./routes/review.js");
const session = require("express-session");
const mongoStore = require("connect-mongo");
const flash = require("connect-flash");
const LocalStrategy=require("passport-local");
const passport=require("passport");
const User = require("./models/user.js");
const multer=require("multer");
const upload = multer({dest:"uploads/"});
const store = mongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600,
});

store.on("error",()=>{console.log(err)})
const sessionOptions={
    store,
    resave:false,
    saveUninitialized:true,
    secret:process.env.SECRET,
    cookie:{
        expires:Date.now() + 5*60*1000,
        maxAge:5*60*1000,
        httpOnly:true
    }
}


app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodoverride("_method"));
app.use(express.static(path.join(__dirname,"/public")))
app.engine("ejs",ejsmate);

main().then(()=>{
console.log("connected to db");
})
.catch((err)=>{
console.log(`An error occured ${err}`);
})



async function main(){
    await mongoose.connect(dburl);
}


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.curruser=req.user;
    next();
})



app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/users",users);


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
})

app.use((err,req,res,next)=>{
    let {statuscode=500, message="something went wrong"}=err;
    res.status(statuscode).render("listings/error.ejs",{message});
})



let port=8080;
app.listen(8080,()=>{
    console.log(`App is listening to ${port}`)
})