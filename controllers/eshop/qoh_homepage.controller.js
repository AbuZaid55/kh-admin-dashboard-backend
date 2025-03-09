const { deleteFileByLocationFromS3 } = require("../../services/S3_Services.js");

const Homepage = require("../../models/eshop/qoh_homepage.model.js");

/**
 * Get homepage data
 */
const getHomepage = async (req, res) => {
  try {
    const homepage = await Homepage.findOne({
      homepage_name: "Queen of Hearts",
    });

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
      logo_text,
      hero_short_desc,
      hero_desc,

      // Hallmark section
      hallmark_section,
      hallmark_sec_desc,
      hallmark_slug_name,
      hallmark_slug,

      // Gulz section
      gulz_section,
      gulz_section_title,
      gulz_section_short_desc,
      gulz_title,
      gulz_short_desc,
      gulz_slug_name,
      gulz_slug,

      // Faza section
      faza_section,
      faza_section_title,
      faza_section_short_desc,
      faza_title,
      faza_short_desc,
      faza_slug_name,
      faza_slug,

      // Festara section
      festara_section,
      festara_section_title,
      festara_section_short_desc,
      festara_title,
      festara_short_desc,
      festara_slug_name,
      festara_slug,

      // Legacy section
      legacy_section,
      lagacy_title,
      legacy_desc,

      // Curator section
      curator_section,
      curator_title,
      curator_desc,

      // Promise section
      promise_section,
      promise_title,
      promise_desc,

      // Galaria section
      galaria_section,
      galaria_section_title,
      galaria_section_short_location,
      galaria_section_desc,
    } = req.body;

    // Find the homepage or create if it doesn't exist
    let homepage = await Homepage.findOne({ homepage_name: "Queen of Hearts" });
    if (!homepage) {
      homepage = new Homepage({ homepage_name: "Queen of Hearts" });
      await homepage.save();
    }

    // Prepare update data
    let updateData = {};

    // Update text fields if provided
    if (scroll_text !== undefined) updateData.scroll_text = scroll_text;
    if (brand_web_link !== undefined)
      updateData.brand_web_link = brand_web_link;
    if (logo_text !== undefined) updateData.logo_text = logo_text;
    if (hero_short_desc !== undefined)
      updateData.hero_short_desc = hero_short_desc;
    if (hero_desc !== undefined) updateData.hero_desc = hero_desc;

    // Hallmark section
    if (hallmark_section !== undefined)
      updateData.hallmark_section = hallmark_section;
    if (hallmark_sec_desc !== undefined)
      updateData.hallmark_sec_desc = hallmark_sec_desc;
    if (hallmark_slug_name !== undefined)
      updateData.hallmark_slug_name = hallmark_slug_name;
    if (hallmark_slug !== undefined) updateData.hallmark_slug = hallmark_slug;

    // Gulz section
    if (gulz_section !== undefined) updateData.gulz_section = gulz_section;
    if (gulz_section_title !== undefined)
      updateData.gulz_section_title = gulz_section_title;
    if (gulz_section_short_desc !== undefined)
      updateData.gulz_section_short_desc = gulz_section_short_desc;
    if (gulz_title !== undefined) updateData.gulz_title = gulz_title;
    if (gulz_short_desc !== undefined)
      updateData.gulz_short_desc = gulz_short_desc;
    if (gulz_slug_name !== undefined)
      updateData.gulz_slug_name = gulz_slug_name;
    if (gulz_slug !== undefined) updateData.gulz_slug = gulz_slug;

    // Faza section
    if (faza_section !== undefined) updateData.faza_section = faza_section;
    if (faza_section_title !== undefined)
      updateData.faza_section_title = faza_section_title;
    if (faza_section_short_desc !== undefined)
      updateData.faza_section_short_desc = faza_section_short_desc;
    if (faza_title !== undefined) updateData.faza_title = faza_title;
    if (faza_short_desc !== undefined)
      updateData.faza_short_desc = faza_short_desc;
    if (faza_slug_name !== undefined)
      updateData.faza_slug_name = faza_slug_name;
    if (faza_slug !== undefined) updateData.faza_slug = faza_slug;

    // Festara section
    if (festara_section !== undefined)
      updateData.festara_section = festara_section;
    if (festara_section_title !== undefined)
      updateData.festara_section_title = festara_section_title;
    if (festara_section_short_desc !== undefined)
      updateData.festara_section_short_desc = festara_section_short_desc;
    if (festara_title !== undefined) updateData.festara_title = festara_title;
    if (festara_short_desc !== undefined)
      updateData.festara_short_desc = festara_short_desc;
    if (festara_slug_name !== undefined)
      updateData.festara_slug_name = festara_slug_name;
    if (festara_slug !== undefined) updateData.festara_slug = festara_slug;

    // Legacy section
    if (legacy_section !== undefined)
      updateData.legacy_section = legacy_section;
    if (lagacy_title !== undefined) updateData.lagacy_title = lagacy_title;
    if (legacy_desc !== undefined) updateData.legacy_desc = legacy_desc;

    // Curator section
    if (curator_section !== undefined)
      updateData.curator_section = curator_section; // Ensure this is included
    if (curator_title !== undefined) updateData.curator_title = curator_title;
    if (curator_desc !== undefined) updateData.curator_desc = curator_desc;

    // Promise section
    if (promise_section !== undefined)
      updateData.promise_section = promise_section;
    if (promise_title !== undefined) updateData.promise_title = promise_title;
    if (promise_desc !== undefined) updateData.promise_desc = promise_desc;

    // Galaria section
    if (galaria_section !== undefined)
      updateData.galaria_section = galaria_section;
    if (galaria_section_title !== undefined)
      updateData.galaria_section_title = galaria_section_title;
    if (galaria_section_short_location !== undefined)
      updateData.galaria_section_short_location =
        galaria_section_short_location;
    if (galaria_section_desc !== undefined)
      updateData.galaria_section_desc = galaria_section_desc;

    const fileFields = [
      "logo",
      "hero_video",
      "gulz_image",
      "faza_image",
      "festara_image",
      "legacy_img",
      "curator_img",
      "galaria_image",
    ];

    for (const field of fileFields) {
      if (req.files && req.files[field]) {
        if (homepage[field]) {
          await deleteFileByLocationFromS3(homepage[field]);
        }
        // Update with new file location (convert to a public URL)
        updateData[field] = req.files[field][0].location;
      }
    }

    // Update the homepage
    const updated = await Homepage.findOneAndUpdate(
      { homepage_name: "Queen of Hearts" },
      updateData,
      { new: true, upsert: true }
    );

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating homepage:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/**
 * Add a hallmark to the homepage
 */
const addHallmark = async (req, res) => {
  try {
    let homepage = await Homepage.findOne({ homepage_name: "Queen of Hearts" });
    if (!homepage) {
      homepage = new Homepage({ homepage_name: "Queen of Hearts" });
      await homepage.save();
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Hallmark image is required" });
    }

    const hallmarkImage = req.file.location;

    homepage.hallmark_list.push({ hallmarkImage });
    await homepage.save();

    res.status(201).json({
      success: true,
      message: "Hallmark added successfully",
      data: homepage.hallmark_list[homepage.hallmark_list.length - 1],
    });
  } catch (error) {
    console.error("Error adding hallmark:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/**
 * Delete a hallmark from the homepage
 */
const deleteHallmark = async (req, res) => {
  try {
    const { id } = req.params;

    const homepage = await Homepage.findOne({
      homepage_name: "Queen of Hearts",
    });
    if (!homepage) {
      return res
        .status(404)
        .json({ success: false, message: "Homepage not found" });
    }

    const hallmark = homepage.hallmark_list.id(id);
    if (!hallmark) {
      return res
        .status(404)
        .json({ success: false, message: "Hallmark not found" });
    }

    if (hallmark.hallmarkImage) {
      await deleteFileByLocationFromS3(hallmark.hallmarkImage);
    }

    // Remove hallmark from list
    homepage.hallmark_list = homepage.hallmark_list.filter((h) => h.id !== id);
    await homepage.save();

    res
      .status(200)
      .json({ success: true, message: "Hallmark deleted successfully" });
  } catch (error) {
    console.error("Error deleting hallmark:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/**
 * Add a promise to the homepage
 */
const addPromise = async (req, res) => {
  try {
    const { description } = req.body;

    let homepage = await Homepage.findOne({ homepage_name: "Queen of Hearts" });
    if (!homepage) {
      homepage = new Homepage({ homepage_name: "Queen of Hearts" });
      await homepage.save();
    }

    if (!description && !req.file) {
      return res.status(400).json({
        success: false,
        message: "Either description or image is required for a promise",
      });
    }

    const promise = {
      description: description || "",
      image: req.file ? req.file.location : "",
    };

    homepage.promises_list.push(promise);
    await homepage.save();

    res.status(201).json({
      success: true,
      message: "Promise added successfully",
      data: homepage.promises_list[homepage.promises_list.length - 1],
    });
  } catch (error) {
    console.error("Error adding promise:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/**
 * Delete a promise from the homepage
 */
const deletePromise = async (req, res) => {
  try {
    const { id } = req.params;

    const homepage = await Homepage.findOne({
      homepage_name: "Queen of Hearts",
    });
    if (!homepage) {
      return res
        .status(404)
        .json({ success: false, message: "Homepage not found" });
    }

    const promise = homepage.promises_list.id(id);
    if (!promise) {
      return res
        .status(404)
        .json({ success: false, message: "Promise not found" });
    }

    if (promise.image) {
      await deleteFileByLocationFromS3(promise.image);
    }

    // Remove promise from list
    homepage.promises_list = homepage.promises_list.filter((p) => p.id !== id);
    await homepage.save();

    res
      .status(200)
      .json({ success: true, message: "Promise deleted successfully" });
  } catch (error) {
    console.error("Error deleting promise:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  getHomepage,
  updateHomepage,
  addHallmark,
  deleteHallmark,
  addPromise,
  deletePromise,
};
