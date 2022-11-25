const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    name: String,
    description: String,
    location: String,
    price: Number,
    rating: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }
});

const model = mongoose.model("Post", PostSchema);
module.exports = model;