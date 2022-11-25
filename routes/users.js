const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utilities/catchAsync");
const  { validatePost } = require("../middlewares");
const users = require("../controllers/users");
const passport = require("passport");

router.route("/register")
    .get(users.renderRegister)
    .post(catchAsync(users.register))

router.route("/login")
    .get(users.renderLogin)
    .post(
        passport.authenticate(
            "local",
            {
                failureFlash : true,
                failureRedirect : "/login",
                keepSessionInfo : true
            }
        ), users.login
    );

router.route("/logout").get(users.logout);

module.exports = router;