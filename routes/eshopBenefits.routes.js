const express = require("express");
const multer = require("multer");
const { createBenefit, getBenefits, updateBenefit, deleteBenefit } = require("../controllers/eshop/eshopBenefits.controller.js");
const { isAuth } = require("../middlewares/authMiddleware.js");
const isAdmin = require("../middlewares/isAdmin.js");

const router = express.Router();

// Local Storage Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/benefits/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const localUpload = multer({ storage });

// S3 Upload Setup
// const { uploadSingle } = require("../../services/S3_Services"); // adjust the path as needed

// Routes using local storage
router.post("/", isAuth, isAdmin, localUpload.single("image"), createBenefit);
router.put("/:id", isAuth, isAdmin, localUpload.single("image"), updateBenefit);

// Routes using S3 storage (uncomment these lines to switch to S3)
// router.post("/", isAuth, isAdmin, uploadSingle("image"), createBenefit);
// router.put("/:id", isAuth, isAdmin, uploadSingle("image"), updateBenefit);

router.get("/", getBenefits);
router.delete("/:id", isAuth, isAdmin, deleteBenefit);

module.exports = router;
