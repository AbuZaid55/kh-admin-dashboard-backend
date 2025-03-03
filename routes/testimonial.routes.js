const express = require("express");
const multer = require("multer");
const { createTestimonial, getTestimonials, updateTestimonial, deleteTestimonial } = require("../controllers/testimonial.controller.js");
const { isAuth } = require("../middlewares/authMiddleware.js");
const isAdmin = require("../middlewares/isAdmin.js");

const router = express.Router();

// Multer Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/testimonial/"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });


// Routes
router.post("/",isAuth,isAdmin, upload.single("profile_img"), createTestimonial);
router.get("/", getTestimonials);
router.put("/:id",isAuth,isAdmin, upload.single("profile_img"), updateTestimonial);
router.delete("/:id",isAuth,isAdmin, deleteTestimonial);

module.exports = router;
