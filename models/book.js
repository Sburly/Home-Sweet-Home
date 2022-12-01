const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
    people: Number,
    checkIn: Date,
    checkOut: Date,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }
});

const model = mongoose.model("Bookings", BookingSchema);
module.exports = model;