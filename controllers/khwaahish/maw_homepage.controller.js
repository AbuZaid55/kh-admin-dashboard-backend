const path = require("path");
const fs = require("fs");
const util = require("util");

const { deleteFileByLocationFromS3 } = require("../../services/S3_Services.js");

const Homepage = require("../../models/khwaahish/maw_homepage.model.js");

/**
 * Get homepage data
 */
const getHomepage = async (req, res) => {
  try {
    const homepage = await Homepage.findOne({});

    if (!homepage) {
      return res
        .status(404)
        .json({ success: false, message: "Homepage not found" });
    }

    res.status(200).json({ success: true, data: homepage });
  } catch (error) {
    console.error("Error fetching homepage:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/**
 * Update homepage data
 */
const updateHomepage = async (req, res) => {
  try {
    const {
      scroll_text,
      brand_web_link,

      // Hero Section
      hero_section,
      hero_title,
      hero_desc_1,
      hero_desc_2,
      hero_desc_3,
      hero_desc_4,

      // From Sketch To Finish section
      sketch_section,
      sketch_title,
      sketch_desc,

      // Make a wish with Khwahish section
      maw_section,
      maw_title,
      maw_desc,
    } = req.body;

    // Find the homepage or create if it doesn't exist
    let homepage = await Homepage.findOne({});
    if (!homepage) {
      homepage = new Homepage();
      await homepage.save();
    }

    // Prepare update data
    let updateData = {};

    // Update text fields if provided
    if (scroll_text !== undefined) updateData.scroll_text = scroll_text;
    if (brand_web_link !== undefined) updateData.brand_web_link = brand_web_link;

    // Hero Section
    if (hero_section !== undefined) updateData.hero_section = hero_section;
    if (hero_title !== undefined) updateData.hero_title = hero_title;
    if (hero_desc_1 !== undefined) updateData.hero_desc_1 = hero_desc_1;
    if (hero_desc_2 !== undefined) updateData.hero_desc_2 = hero_desc_2;
    if (hero_desc_3 !== undefined) updateData.hero_desc_3 = hero_desc_3;
    if (hero_desc_4 !== undefined) updateData.hero_desc_4 = hero_desc_4;

    // From Sketch To Finish section
    if (sketch_section !== undefined) updateData.sketch_section = sketch_section;
    if (sketch_title !== undefined) updateData.sketch_title = sketch_title;
    if (sketch_desc !== undefined) updateData.sketch_desc = sketch_desc;

    // Make a wish with Khwahish section
    if (maw_section !== undefined) updateData.maw_section = maw_section;
    if (maw_title !== undefined) updateData.maw_title = maw_title;
    if (maw_desc !== undefined) updateData.maw_desc = maw_desc;

    const fileFields = [
      "logo",
      "hero_image",
      "sketch_image",
      "sketch_video",
      "maw_image",
    ];

    for (const field of fileFields) {
      if (req.files && req.files[field]) {
        // Optionally delete old file if exists
        if (homepage[field]) {
          await deleteFileByLocationFromS3(homepage[field]);
        }
        updateData[field] = req.files[field][0].location;
      }
    }

    // Update the homepage
    const updated = await Homepage.findOneAndUpdate({}, updateData, {
      new: true,
      upsert: true
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating homepage:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  getHomepage,
  updateHomepage
};