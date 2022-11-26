const { postSchema } = require("./schemas");

module.exports.validatePost = (req, res, next) => {
    const { err } = postSchema.validate(req.body);
    if(err) {
        const msg = err.details.map(i => i.message).join(",");
    } else {
        next();
    };
};

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must be signed in");
        return res.redirect("/login");
    };
    next();
};

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    if(!post.author.equals(req.user._id)) {
        req.flash("error", "You don't have permission");
        return res.redirect("/")
    };
    next();
};