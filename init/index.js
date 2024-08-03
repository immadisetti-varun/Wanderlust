const mongoose=require("mongoose");
const initdata = require("./data.js");
const listing = require("../models/listing.js");
let Mongo_URL="mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
console.log("connected to db");
})
.catch((err)=>{
console.log(`An error occured ${err}`);
})

async function main(){
    await mongoose.connect(Mongo_URL);
}


const initdb=async ()=>{
    await listing.deleteMany({});
    await listing.insertMany(initdata.data);
    console.log("New data added successfully");
}

initdb();
