const {
    landingPageUpdate,
    addPromise,
    deletePromise,
    getLandingpage
} =require("../controllers/eshop/landingpage.controller.js");
const express = require("express");
const { uploads } = require("../services/S3_Services.js");
const router = express.Router();


// add update both
router.get("/landing-page", getLandingpage);
router.put("/landing-page", uploads.fields([
    { name: "logo" },
    { name: "hero_desktop_img" },
    { name: "hero_mobile_img" },
    { name: "ad_video" },
    { name: "trending_img" },
    { name: "legacy_img" },
    { name: "curator_img" },
]), landingPageUpdate);

router.post('/landing-page/promises', uploads.single('image'), addPromise);
router.delete('/landing-page/promises/:id', deletePromise);


module.exports = router;