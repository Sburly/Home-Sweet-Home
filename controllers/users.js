const User = require("../models/user");

module.exports.renderRegister = (req, res, next) => {
    res.render("user/register")
};

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password, type } = req.body;
        let isLandowner = false;
        if(type) isLandowner = true;
        const user = new User({email, username, isLandowner});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash("success", "Welcome");
            res.redirect("/");
        });
    } catch(e) {
        req.flash("error", e.message);
        res.redirect("/register");
    };
};

module.exports.renderLogin = (req, res, next) => {
    res.render("user/login")
};

module.exports.login = (req, res) => {
    req.flash("success", "Welcome back");
    const redirectURL = req.session.returnTo || "/";
    delete req.session.returnTo;
    res.redirect(redirectURL);
};

module.exports.logout = (req, res, next) => {
    req.logout(function(err){
        if(err) return next(err);
        req.flash("success", "You've logged out");
        res.redirect("/");
    });
};