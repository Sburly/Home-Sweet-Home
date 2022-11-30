const Review = require("../models/review");
const Post = require("../models/post");
const User = require("../models/user");

module.exports.postReview = async (req, res) => {
    const { id } = req.params;
    const review = new Review(req.body);
    review.author = req.user._id;
    review.post = id;
    await review.save();
    const post = await Post.findById(id);
    post.reviews.push(review._id);
    await post.save();
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
    res.redirect(`/${id}`);
};