const express = require('express');
const router = express.Router();
const { 
  getHomepage, updateGeneral, updateHallMark, addHighJewel, addHighJewelCarousal,
  deleteHighJewelCarousal, QueenOfHeartSection, addQOHCarousal, deleteQOHCarousal,
  updateEditSection, promiseSection, addPromise, deletePromise,
  updateComingSoon, updateStoreSection, addStoreFeat, deleteStoreFeat, faqSection,
  addFaq, deleteFaq, toggleSection
} = require("../controllers/khwaahish/homepage.controller.js");
const collectionHomepageController= require("../controllers/khwaahish/collectionHomepage.controller.js");
const { uploads } = require('../services/S3_Services.js');

// KHWAAHISH HOMEPAGE 
router.get("/", getHomepage);

router.put("/general", uploads.fields([{ name: "logo" }, { name: "hero_video" }]), updateGeneral);

router.put("/hallmark", uploads.fields([{name:"hallmark_images"}]), updateHallMark);

router.post("/high-jewel", addHighJewel);
router.post("/high-jewel-carousel", uploads.single("high_Image"), addHighJewelCarousal);
router.delete("/high-jewel-carousel/:id", deleteHighJewelCarousal);

router.put("/qoh", QueenOfHeartSection);
router.post("/qoh-carousel", uploads.single("qohImage"), addQOHCarousal);
router.delete("/qoh-carousel/:id", deleteQOHCarousal);

router.put("/edit", uploads.fields([{ name: "bridal_edit_image" }, { name: "polki_edit_image" }]), updateEditSection);

router.put("/promise", promiseSection);
router.post("/promise", uploads.single("promise_image"), addPromise);
router.delete("/promise/:id", deletePromise);

router.put("/coming-soon", uploads.fields([{ name: "coming_soon_images" }, { name: "coming_soon_videCall_banner_image" }]), updateComingSoon);

router.put("/store", uploads.single("storeImage"), updateStoreSection);
router.post("/store-feature", addStoreFeat);
router.delete("/store-feature/:id", deleteStoreFeat);

router.put("/faq", faqSection);
router.post("/faq", addFaq);
router.delete("/faq/:id", deleteFaq);

router.put("/toggle-section", toggleSection);


// CollectionAd routes
router.get("/collectio-homepage", collectionHomepageController.getCollectionAd);

router.put("/collectio-homepage/general", uploads.fields([{ name: "hero_desktop_banner_img" }, { name: "hero_mobile_banner_img" }, { name: "collection_logo" }, { name: "ad_video" }]), collectionHomepageController.updateGeneral);

router.put("/collectio-homepage/jewel-at-glance", uploads.fields([{ name: "jewel_at_glance_images" }]), collectionHomepageController.updateJewelAtGlance);

router.put("/collectio-homepage/category-section", uploads.fields([{ name: "category_section_images" }]), collectionHomepageController.updateCategorySection);

router.put("/collectio-homepage/curator-thought", uploads.single("curator_profileImg"), collectionHomepageController.updateCuratorThought);

router.put("/collectio-homepage/toggle-section", collectionHomepageController.toggleSection);

router.put("/collectio-homepage/collection", uploads.single("collection_data_image"), collectionHomepageController.updateCollection);

router.post("/collectio-homepage/topics", collectionHomepageController.addTopics);

router.delete("/collectio-homepage/topics", collectionHomepageController.deleteTopics);

module.exports = router;
