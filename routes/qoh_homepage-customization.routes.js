const express = require("express");
const router = express.Router();
const { uploads } = require("../services/S3_Services.js");
const {
  getHomepage,
  updateHomepage,
  addHallmark,
  deleteHallmark,
  addPromise,
  deletePromise,
} = require("../controllers/eshop/qoh_homepage.controller");

// Get homepage data
router.get("/", getHomepage);

// Update homepage data
router.put(
  "/",
  uploads.fields([
    { name: "logo", maxCount: 1 },
    { name: "hero_video", maxCount: 1 },
    { name: "gulz_image", maxCount: 1 },
    { name: "faza_image", maxCount: 1 },
    { name: "festara_image", maxCount: 1 },
    { name: "legacy_img", maxCount: 1 },
    { name: "curator_img", maxCount: 1 },
    { name: "galaria_image", maxCount: 1 },
  ]),
  updateHomepage
);

// Hallmark routes
router.post("/hallmark", uploads.single("hallmarkImage"), addHallmark);
router.delete("/hallmark/:id", deleteHallmark);

// Promise routes
router.post("/promise", uploads.single("image"), addPromise);
router.delete("/promise/:id", deletePromise);

module.exports = router;
