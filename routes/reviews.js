const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utilities/catchAsync");
const  { validateReview, isLoggedIn, isReviewAuthor } = require("../middlewares");
const reviews = require("../controllers/reviews");

router.route("/").post(isLoggedIn, validateReview, catchAsync(reviews.postReview));

router.route("/:reviewId").delete(isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;