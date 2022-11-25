const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "An email is needed"],
        unique: [true, "This email is already in use"]
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Posts"
    }],
    posts: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Posts"
        },
        date: Date
    }],
    favourites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Posts"
    }],
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }]
});
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);