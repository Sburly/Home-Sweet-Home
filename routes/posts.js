const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/catchAsync");
const  { validatePost } = require("../middlewares");
const posts = require("../controllers/posts");

router.route("/").get(catchAsync(posts.renderHome));

router.route("/post")
    .get(posts.renderAdd)
    .post(validatePost, catchAsync(posts.addNew));

router.route("/:id")
    .get(catchAsync(posts.renderShow))
    .patch(validatePost, catchAsync(posts.updatePost))
    .delete(catchAsync(posts.deletePost))

router.route("/:id/edit").get(catchAsync(posts.renderEdit));

module.exports = router;