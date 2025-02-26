const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const ejsMate = require("ejs-mate");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const users = require("./routes/user.js");

const session = require("express-session");
const MongoStore = require('connect-mongo');

const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");
const expressError = require("./utils/expressError.js")
if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

app.use((req, res, next) => {
    res.locals.searchQuery = req.query.search || ""; // Ensures searchQuery is always defined
    next();
});

const port = 8080;
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended : true}));

const dbUrl = process.env.ATLASDB_URL;



app.use(methodOverride('_method'));
app.engine("ejs",ejsMate);

app.listen(port,()=>{
    console.log("app is listening");
});

main()
    .then(() => {
        console.log("connected successfully")
    }).catch(err => console.log(err));

    async function main() {
    await mongoose.connect(dbUrl);
    }


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter:24 * 3600,
});

store.on("error",()=>{
    console.log("error in store",err);
});

const sessionOptions = {
    store,
    secret  : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    }
};
    
app.use(session(sessionOptions));
app.use(flash());

//passport------
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// locals middleware------
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;

    next();
})


// app.get("/",(req,res)=>{
//     res.send("SEEM LIKE NOTHING HERE~")
// });

//routes------
app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",users);

app.all("*",(req,res,next)=>{
    throw new expressError(500,"PAGE NOT FOUND");
});

app.use((err,req,res,next)=>{
    let{statusCode = 500,message="Somthing is Wrong!"} = err;
    res.status(statusCode).render("error.ejs",{message});
});