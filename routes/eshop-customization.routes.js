const {
    landingPageUpdate,
    addPromise,
    deletePromise,
    getLandingpage
} =require("../controllers/eshop/landingpage.controller.js");
const express = require("express");
const { uploads, uploadSingle } = require("../services/S3_Services.js");
const { createTestimonial, getTestimonials, updateTestimonial, deleteTestimonial } = require("../controllers/eshop/testimonial.controller.js");
const { createBenefit, getBenefits, updateBenefit, deleteBenefit } = require("../controllers/eshop/eshopBenefits.controller.js");
const {
    getTerms,
    createTerms,
    updateTerms,
    addTerm,
    removeTerm,
    addCondition,
    removeCondition
  } = require('../controllers/eshop/termAndCondition.controller.js');
const { getPrivacyPolicy,updatePrivacyPolicy } = require("../controllers/eshop/privacyPolicy.controller.js");
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


// Testimonial Routes
// Using local storage
router.post("/testimonial", uploads.single("profile_img"), createTestimonial);
router.put("/testimonial/:id", uploads.single("profile_img"), updateTestimonial);

// Using S3 storage (uncomment these lines to switch to S3):
// router.post("/", isAuth, isAdmin, uploadSingle("profile_img"), createTestimonial);
// router.put("/:id", isAuth, isAdmin, uploadSingle("profile_img"), updateTestimonial);

router.get("/testimonial", getTestimonials);
router.delete("/testimonial/:id", deleteTestimonial);

// Eshop Benefits Routes
// S3 Upload Setup
// const { uploadSingle } = require("../../services/S3_Services"); // adjust the path as needed

// Routes using local storage
router.post("/eshop-benefits", uploads.single("image"), createBenefit);
router.put("/eshop-benefits/:id", uploads.single("image"), updateBenefit);

// Routes using S3 storage (uncomment these lines to switch to S3)
// router.post("/", isAuth, isAdmin, uploadSingle("image"), createBenefit);
// router.put("/:id", isAuth, isAdmin, uploadSingle("image"), updateBenefit);

router.get("/eshop-benefits", getBenefits);
router.delete("/eshop-benefits/:id", deleteBenefit);

// Privacy Policy 
// Get Privacy Policy
router.get("/privacy-policy",getPrivacyPolicy);

// Update or Create Privacy Policy
router.post("/privacy-policy",updatePrivacyPolicy);

// Term and conditions 
router.route('/tnc/').get(getTerms).post(createTerms);
router.route('/tnc/:id').put(updateTerms);
router.route('/tnc/:id/term').post(addTerm);
router.route('/tnc/:id/term/:termId').delete(removeTerm);
router.route('/tnc/:id/term/:termId/condition').post(addCondition);
router.route('/tnc/:id/term/:termId/condition/:conditionIndex').delete(removeCondition);


module.exports = router;