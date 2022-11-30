const Review = require("../models/review");
const Post = require("../models/post");
const User = require("../models/user");
const { findById } = require("../models/review");

async function updateRating(post) {
    if(post.reviews) {
        let arr = [];
        for(let i of post.reviews) arr.push(i.rating);
        const average = (arr.reduce((a, b) => a + b, 0) / arr.length);
        if(!average) post.rating = "N/D";
        else post.rating = Math.round(average * 10) / 10;
    } else {
        post.rating = "N/D";
    };
    await post.save();
};

module.exports.postReview = async (req, res) => {
    const { id } = req.params;
    const review = new Review(req.body);
    review.author = req.user._id;
    review.post = id;
    await review.save();

    const post = await Post.findById(id);
    post.reviews.push(review._id);
    await post.save();
    await post.populate("reviews")
    await updateRating(post);

    const user = await User.findById(req.user._id);
    user.reviews.push(review._id);
    await user.save();
    res.redirect(`/${id}`);
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Post.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await User.findByIdAndUpdate(req.user._id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    const post = await Post.findById(id).populate("reviews");
    await updateRating(post);
    res.redirect(`/${id}`);
};