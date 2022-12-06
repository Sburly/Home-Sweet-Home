const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/catchAsync");
const  { validatePost, isLoggedIn, isAuthor } = require("../middlewares");
const posts = require("../controllers/posts");

router.route("/").get(catchAsync(posts.renderHome));

router.route("/post")
    .get(isLoggedIn, posts.renderAdd)
    .post(isLoggedIn, validatePost, catchAsync(posts.addNew));

router.route("/places")
    .get(isLoggedIn, catchAsync(posts.renderYourPlaces));

router.route("/favourites")
    .get(isLoggedIn, catchAsync(posts.renderFavourites))
    .patch(isLoggedIn, catchAsync(posts.addFavourite));

router.route("/bookings").get(isLoggedIn, catchAsync(posts.renderBookings));

router.route("/:id")
    .get(catchAsync(posts.renderShow))
    .patch(isLoggedIn, isAuthor, validatePost, catchAsync(posts.updatePost))
    .delete(isLoggedIn, isAuthor, catchAsync(posts.deletePost));

router.route("/:id/edit").get(isLoggedIn, isAuthor, catchAsync(posts.renderEdit));

router.route("/:id/book")
    .post(isLoggedIn, catchAsync(posts.book));

module.exports = router;