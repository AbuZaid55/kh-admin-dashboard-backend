

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


module.exports = router;