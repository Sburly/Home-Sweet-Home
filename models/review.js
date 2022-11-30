const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    title: String,
    body: String,
    rating: Number,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }
});

const model = mongoose.model("Review", ReviewSchema);
module.exports = model;