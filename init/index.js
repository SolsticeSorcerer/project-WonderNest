const mongoose = require('mongoose');
const Listing = require("../models/listing.js")
MONGO_URL = 'mongodb://127.0.0.1:27017/wanderNest';
const initData = require("./data.js")

main()
    .then(() => {
        console.log("connected successfully")
    })
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj,owner:"67b23b90629f50ab10f9887f"}));
    await Listing.insertMany(initData.data);
}

initDB();