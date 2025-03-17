const express = require('express');
const router = express.Router();
const {getSeo,getSeoById,createSeo,updateSeo,deleteSeo,searchSeo}=require("../controllers/seo.controller.js");

router.get("/",getSeo);
router.get("/search/:term",searchSeo);
router.get("/:id",getSeoById);
router.post("/",createSeo);
router.put("/:id",updateSeo);
router.delete("/:id",deleteSeo);

module.exports = router;