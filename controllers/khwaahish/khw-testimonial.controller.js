const Testimonial = require("../../models/eshop/testimonial.model");
const { deleteFileFromS3 } = require("../../services/S3_Services"); // Adjust path as needed

// Create a new testimonial
exports.createTestimonial = async (req, res) => {
  try {
    const { name, designation, testimonial, collection_id } = req.body;

    // S3 storage
    const profile_img = req.file ? { key: req.file.key, url: req.file.location } : null;

    const newTestimonial = new Testimonial({ name, designation, testimonial, profile_img, collection_id });
    await newTestimonial.save();
    
    res.status(201).json(newTestimonial);
  } catch (error) {
    res.status(500).json({ message: "Error creating testimonial", error });
  }
};

// Get all testimonials (optional: filter by collection_id)
exports.getTestimonials = async (req, res) => {
  try {
    const { collection_id } = req.query;
    const filter = collection_id ? { collection_id } : {}; // If collection_id is provided, filter by it
    const testimonials = await Testimonial.find(filter);
    
    res.status(200).json(testimonials);
  } catch (error) {
    res.status(500).json({ message: "Error fetching testimonials", error });
  }
};

// Update a testimonial
exports.updateTestimonial = async (req, res) => {
  try {
    const { name, designation, testimonial, collection_id } = req.body;
    const updatedData = { name, designation, testimonial, collection_id };

    // S3 storage
    if (req.file) {
      updatedData.profile_img = { key: req.file.key, url: req.file.location };
    }

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
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ message: "Testimonial not found" });

    // If using S3 storage, delete the file from S3
    if (testimonial.profile_img?.key) {
      await deleteFileFromS3(testimonial.profile_img.key);
    }

    await Testimonial.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting testimonial", error });
  }
};
