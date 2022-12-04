const mongoose = require("mongoose");
const Review = require("./review");

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
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }]
});

PostSchema.post("findOneAndDelete", async function(doc) {
    if(doc) {
        await Review.deleteMany({ _id: { $in: doc.reviews }});
    };
});

const model = mongoose.model("Post", PostSchema);
module.exports = model;