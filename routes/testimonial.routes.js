const express = require("express");
const multer = require("multer");
const { createTestimonial, getTestimonials, updateTestimonial, deleteTestimonial } = require("../controllers/eshop/testimonial.controller.js");
const { isAuth } = require("../middlewares/authMiddleware.js");
const isAdmin = require("../middlewares/isAdmin.js");

const router = express.Router();

// Local Storage Setup 
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/testimonial/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const localUpload = multer({ storage });

// S3 Upload Setup 
// const { uploadSingle } = require("../../services/S3_Services"); // adjust the path as needed

// Routes

// Using local storage
router.post("/", isAuth, isAdmin, localUpload.single("profile_img"), createTestimonial);
router.put("/:id", isAuth, isAdmin, localUpload.single("profile_img"), updateTestimonial);

// Using S3 storage (uncomment these lines to switch to S3):
// router.post("/", isAuth, isAdmin, uploadSingle("profile_img"), createTestimonial);
// router.put("/:id", isAuth, isAdmin, uploadSingle("profile_img"), updateTestimonial);

router.get("/", getTestimonials);
router.delete("/:id", isAuth, isAdmin, deleteTestimonial);

module.exports = router;
