const express = require("express");
const router = express.Router();
const { uploads } = require("../services/S3_Services.js");
const {
  getCollectionHomepage,
  updateCollectionHomepage,
  addJagItem,
  deleteJagItem,
  addHallmark,
  deleteHallmark,
  addPromise,
  deletePromise,
} = require("../controllers/eshop/collection_homepage.controller");

// Get homepage data for a specific collection
router.get("/:collection_name", getCollectionHomepage);

// Update homepage data for a specific collection
router.put(
  "/:collection_name",
  uploads.fields([
    { name: "collection_logo", maxCount: 1 },
    { name: "hero_mobile_banner_image", maxCount: 1 },
    { name: "hero_desktop_banner_image", maxCount: 1 },
    { name: "hero_title_image", maxCount: 1 },
    { name: "ad_campaign_video", maxCount: 1 },
    { name: "legacy_img", maxCount: 1 },
    { name: "curator_img", maxCount: 1 },
    { name: "store_image", maxCount: 1 },
  ]),
  updateCollectionHomepage
);

// Jewels at Glance List Management
router.post(
  "/:collection_name/jag",
  uploads.single("hallmarkImage"),
  addJagItem
);

router.delete("/:collection_name/jag/:id", deleteJagItem);

// Hallmark List Management
router.post(
  "/:collection_name/hallmark",
  uploads.single("hallmarkImage"),
  addHallmark
);

router.delete("/:collection_name/hallmark/:id", deleteHallmark);

// Promise List Management
router.post(
  "/:collection_name/promise",
  uploads.single("image"),
  addPromise
);

router.delete("/:collection_name/promise/:id", deletePromise);

module.exports = router;