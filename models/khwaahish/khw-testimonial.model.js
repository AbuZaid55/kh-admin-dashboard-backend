const mongoose = require("mongoose");

const testimonialSchema_khw = new mongoose.Schema({
    name: { type: String, required: true },
    designation: { type: String, required: true },
    testimonial: { type: String, required: true },
    profile_img: { key: String, url: String }, // Store image file path
    khw_collection_id: { type: mongoose.Schema.Types.ObjectId, ref: "Collection_khw" , required: true },
});

module.exports = mongoose.model("Testimonial_khw", testimonialSchema_khw);
