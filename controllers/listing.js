const Listing = require("../models/listing.js");


module.exports.indexRoute = async (req,res)=>{
    let query = res.locals.searchQuery;
    let category = req.query.category; // Get category from URL
    let allList;


    if (query) {
        allList = await Listing.find({ title: { $regex: query, $options: "i" } });
    } else if(category) {
        allList = await Listing.find({ category: { $in: [category] } });
    }else{
        allList = await Listing.find();
    }
    res.render("listing/index.ejs", { allList});
}

module.exports.createRouteForm = async (req,res)=>{
    res.render("listing/new.ejs");
}

module.exports.showRoute = async (req,res) =>{
    let {id} = req.params;
    let list = await Listing.findById(id).populate({path : "reviews" , populate : {path : "author" }}).populate("owner");
    if(!list){
        req.flash("error","Listing does'nt exist");
        return res.redirect("/listings");
    }
    res.render("listing/show.ejs",{list});
}

module.exports.createRoute = async (req,res)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    let newlist = new Listing(req.body.listing);
    newlist.owner = req.user._id;
    newlist.image = {url , filename};
    await newlist.save();
    req.flash("success","New list is added!");
    res.redirect("/listings");
}

module.exports.editRouteForm = async (req,res)=>{
    let {id} = req.params;
    let list = await Listing.findById(id);
    if(!list){
        req.flash("error","Listing does'nt exist");
        return res.redirect("/listings");
    }
    let preview = list.image.url.replace("/upload","/upload/h_250,w_250");
    res.render("listing/edit.ejs",{list,preview});
}

module.exports.editRoute = async (req,res) =>{
    let {id} = req.params;
    let list = await Listing.findByIdAndUpdate(id,{...req.body.listing} ,{new : true});   // When you use findByIdAndUpdate(), it returns the old version of the document before the update (by default). If you try to access list.image = {url, filename}, list could be null, leading to an error.

    if(req.file){
        let url = req.file.path;
        let filename = req.file.filename;
        list.image = {url , filename};
        await list.save();
    }
    req.flash("success","Listing has been updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyer =  async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing has been deleted");
    res.redirect("/listings");
}