const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn , isOwner , validation } = require("../middleware.js"); 
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

//using router.route

router
    .route("/")
    //index route
    .get(wrapAsync(listingController.indexRoute))
    //create route
    .post(isLoggedIn,
        upload.single("listing[image]"),
        validation,
        wrapAsync(listingController.createRoute)
    );

//new route
router.get("/new",isLoggedIn, wrapAsync(listingController.createRouteForm));

//show route
router
    .route("/:id")
    //show route
    .get(wrapAsync(listingController.showRoute))
    //update route
    .put(isLoggedIn,isOwner,upload.single("listing[image]"),validation, wrapAsync(listingController.editRoute))
    //delete route
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyer));

//edit
router.get("/:id/edit",isLoggedIn, wrapAsync(listingController.editRouteForm));

module.exports = router;