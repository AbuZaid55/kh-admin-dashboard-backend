const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema({
    name: { type: String, required: true },
    designation: { type: String, required: true },
    testimonial: { type: String, required: true },
    profile_img: { type: String } // Store image file path
});

module.exports = mongoose.model("Testimonial", testimonialSchema);
