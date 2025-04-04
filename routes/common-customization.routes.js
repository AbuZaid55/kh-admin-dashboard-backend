const { uploads } = require("../services/S3_Services.js");
const {
    getTerms,
    createTerms,
    updateTerms,
    addTerm,
    removeTerm,
    addCondition,
    removeCondition
  } = require('../controllers/termAndCondition.controller.js');
const { getPrivacyPolicy,updatePrivacyPolicy } = require("../controllers/privacyPolicy.controller.js");

const express=require("express");
const {getFooters,createFooter,getFooter,updateFooter,deleteFooter,getFooterByDomain} = require("../controllers/footer.controller.js")
const router=express.Router();
const { getOurStory, updateOurDesire, addDesireFeat, deleteDesireFeat, updateOurValue, addValue, deleteValue, updatePromoter, addpromoter, deletepromoter, updateOurLogo, toggleOurStory } = require('../controllers/ourStory.controller');



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

// Our Story


// Footer
router.route('/footer')
    .get(getFooters)
    .post(uploads.single('available_payment_methods'), createFooter);

router.route('/footer/:id')
    .get(getFooter)
    .put( uploads.single('available_payment_methods'), updateFooter)
    .delete(deleteFooter);

router.route('/footer/domain/:domain')
    .get(getFooterByDomain);

// OURSTORY 
router.get("/our-story",getOurStory);
router.put("/our-story/toggle",toggleOurStory);
// our-desire 
router.put("/our-story/desire",uploads.single("desire_image"),updateOurDesire)
router.post("/our-story/desire",addDesireFeat)
router.delete("/our-story/desire",deleteDesireFeat)

// our-logo
router.put("/our-story/logo",uploads.single("logo_img"),updateOurLogo)

// our-value
router.put("/our-story/value",updateOurValue)
router.post("/our-story/value",addValue)
router.delete("/our-story/value",deleteValue)

// our-promoters
router.put("/our-story/promoter",updatePromoter)
router.post("/our-story/promoter",uploads.single("profileImg"),addpromoter)
router.delete("/our-story/promoter",deletepromoter)



module.exports = router;