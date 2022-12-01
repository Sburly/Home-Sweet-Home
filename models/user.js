const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "An email is needed"],
        unique: [true, "This email is already in use"]
    },
    isLandowner: Boolean,
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }],
    bookings: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking"
        },
        date: Date
    }],
    favourites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }],
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }]
});
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);