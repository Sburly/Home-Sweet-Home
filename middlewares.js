const { postSchema, reviewSchema } = require("./schemas");
const Post = require("./models/post");
const User = require("./models/user");
const Review = require("./models/review");
const user = require("./models/user");

module.exports.validatePost = (req, res, next) => {
    const { err } = postSchema.validate(req.body);
    if(err) {
        const msg = err.details.map(i => i.message).join(",");
    } else {
        next();
    };
};

module.exports.validateReview = (req, res, next) => {
    const { err } = reviewSchema.validate(req.body);
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
        return res.redirect("/");
    };
    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)) {
        req.flash("error", "You don't have permission");
        return res.redirect("/");
    };
    next();
};