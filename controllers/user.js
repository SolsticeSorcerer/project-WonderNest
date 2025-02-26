const User = require("../models/user");

module.exports.signUpForm = (req,res)=>{
    res.render("user/signup.ejs");
}

module.exports.signUp = async(req,res)=>{
    try{
        let {username , email, password} = req.body;
        let newUser = new User({email , username});
        const registeredUser = await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return req.flash("error",err);
            }
            req.flash("success","WELCOME TO WonderNest");
            return res.redirect("/listings");
        });
    }
    catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
}

module.exports.loginForm = (req,res)=>{
    res.render("user/login.ejs");
}

module.exports.login = async(req,res)=>{
    req.flash("success","WELCOME TO WonderNest");
    let redirectURL = res.locals.redirectUrl || "/listings";
    if (redirectURL.includes("/reviews")) {
        redirectURL = redirectURL.replace("/reviews", ""); //Remove "/reviews" as ther is no /listings/:id/reviews page
    }
    res.redirect(redirectURL);
}

module.exports.logout = (req,res)=>{
    req.logout((err)=>{
        if(err){
            return req.flash("error",err);
        }
        req.flash("success","Successfully logged out!");
        res.redirect("/listings");
    });
}