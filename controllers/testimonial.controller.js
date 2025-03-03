const Testimonial = require("../models/testimonial.model.js");

// Create a new testimonial
exports.createTestimonial = async (req, res) => {
    try {
        const { name, designation, testimonial } = req.body;
        const profile_img = req.file ? `/uploads/testimonial/${req.file.filename}` : null;

        const newTestimonial = new Testimonial({ name, designation, testimonial, profile_img });
        await newTestimonial.save();
        res.status(201).json(newTestimonial);
    } catch (error) {
        res.status(500).json({ message: "Error creating testimonial", error });
    }
};

// Get all testimonials
exports.getTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find();
        res.status(200).json(testimonials);
    } catch (error) {
        res.status(500).json({ message: "Error fetching testimonials", error });
    }
};

// Update a testimonial
exports.updateTestimonial = async (req, res) => {
    try {
        const { name, designation, testimonial } = req.body;
        const profile_img = req.file ? `/uploads/${req.file.filename}` : undefined;

        const updatedData = { name, designation, testimonial };
        if (profile_img) updatedData.profile_img = profile_img;

        const updatedTestimonial = await Testimonial.findByIdAndUpdate(req.params.id, updatedData, { new: true });

        if (!updatedTestimonial) return res.status(404).json({ message: "Testimonial not found" });

        res.status(200).json(updatedTestimonial);
    } catch (error) {
        res.status(500).json({ message: "Error updating testimonial", error });
    }
};

// Delete a testimonial
exports.deleteTestimonial = async (req, res) => {
    try {
        await Testimonial.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Testimonial deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting testimonial", error });
    }
};
