const express = require("express");
const router = express.Router();
const {
  getHomepage,
  updateHomepage
} = require("../controllers/khwahish/maw_homepage.controller");
const { uploads } = require("../services/S3_Services.js");

// Get homepage data
router.get("/", getHomepage);

// Update homepage data
router.put(
  "/",
  uploads.fields([
    { name: "logo", maxCount: 1 },
    { name: "hero_image", maxCount: 1 },
    { name: "sketch_image", maxCount: 1 },
    { name: "sketch_video", maxCount: 1 },
    { name: "maw_image", maxCount: 1 }
  ]),
  updateHomepage
);

module.exports = router;