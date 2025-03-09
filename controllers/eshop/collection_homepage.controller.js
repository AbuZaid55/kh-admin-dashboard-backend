const { deleteFileByLocationFromS3 } = require("../../services/S3_Services.js");

const CollectionHomepage = require("../../models/eshop/collection_homepage.model.js");

// Validate if collection name is either "fazza" or "festara"
const validateCollectionName = (name) => {
  const validNames = ["fazza", "festara"];
  return validNames.includes(name.toLowerCase());
};

/**
 * Get collection homepage data
 */
const getCollectionHomepage = async (req, res) => {
  try {
    const { collection_name } = req.params;

    if (!validateCollectionName(collection_name)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid collection name. Only 'fazza' or 'festara' collections are supported.",
      });
    }

    const homepage = await CollectionHomepage.findOne({
      homepage_collection_name: collection_name,
    });

    if (!homepage) {
      return res
        .status(404)
        .json({ success: false, message: "Collection homepage not found" });
    }

    res.status(200).json({ success: true, data: homepage });
  } catch (error) {
    console.error("Error fetching collection homepage:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/**
 * Update collection homepage data
 */
const updateCollectionHomepage = async (req, res) => {
  try {
    const { collection_name } = req.params;

    if (!validateCollectionName(collection_name)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid collection name. Only 'fazza' or 'festara' collections are supported.",
      });
    }

    const {
      // Hero Section
      scroll_text,
      brand_web_link,
      collection_logo_text,
      hero_title,
      hero_desc,

      // Jewels at Glance
      jag_section,
      jag_section_title,
      jag_section_short_desc,

      // Ad Campaign
      ad_campaign_section,
      ad_campaign_title,

      // Queen of Hearts Section
      qoh_section,
      qoh_short_desc,
      qoh_long_desc,

      // Hallmark Section
      hallmark_section,
      hallmark_sec_desc,
      hallmark_slug_name,
      hallmark_slug,

      // Legacy Section
      legacy_section,
      lagacy_title,
      legacy_desc,

      // Curator Section
      curator_section,
      curator_title,
      curator_desc,

      // Promise Section
      promise_section,
      promise_title,
      promise_desc,

      // Store Section
      store_title,
      store_slug_name,
      store_slug,
    } = req.body;

    // Find the homepage or create if it doesn't exist
    let homepage = await CollectionHomepage.findOne({
      homepage_collection_name: collection_name,
    });

    if (!homepage) {
      homepage = new CollectionHomepage({
        homepage_collection_name: collection_name,
      });
      await homepage.save();
    }

    // Prepare update data
    let updateData = {};

    // Update text fields if provided - Hero Section
    if (scroll_text !== undefined) updateData.scroll_text = scroll_text;
    if (brand_web_link !== undefined)
      updateData.brand_web_link = brand_web_link;
    if (collection_logo_text !== undefined)
      updateData.collection_logo_text = collection_logo_text;
    if (hero_title !== undefined) updateData.hero_title = hero_title;
    if (hero_desc !== undefined) updateData.hero_desc = hero_desc;

    // Jewels at Glance
    if (jag_section !== undefined) updateData.jag_section = jag_section;
    if (jag_section_title !== undefined)
      updateData.jag_section_title = jag_section_title;
    if (jag_section_short_desc !== undefined)
      updateData.jag_section_short_desc = jag_section_short_desc;

    // Ad Campaign
    if (ad_campaign_section !== undefined)
      updateData.ad_campaign_section = ad_campaign_section;
    if (ad_campaign_title !== undefined)
      updateData.ad_campaign_title = ad_campaign_title;

    // Queen of Hearts Section
    if (qoh_section !== undefined) updateData.qoh_section = qoh_section;
    if (qoh_short_desc !== undefined)
      updateData.qoh_short_desc = qoh_short_desc;
    if (qoh_long_desc !== undefined) updateData.qoh_long_desc = qoh_long_desc;

    // Hallmark Section
    if (hallmark_section !== undefined)
      updateData.hallmark_section = hallmark_section;
    if (hallmark_sec_desc !== undefined)
      updateData.hallmark_sec_desc = hallmark_sec_desc;
    if (hallmark_slug_name !== undefined)
      updateData.hallmark_slug_name = hallmark_slug_name;
    if (hallmark_slug !== undefined) updateData.hallmark_slug = hallmark_slug;

    // Legacy Section
    if (legacy_section !== undefined)
      updateData.legacy_section = legacy_section;
    if (lagacy_title !== undefined) updateData.lagacy_title = lagacy_title;
    if (legacy_desc !== undefined) updateData.legacy_desc = legacy_desc;

    // Curator Section
    if (curator_section !== undefined)
      updateData.curator_section = curator_section;
    if (curator_title !== undefined) updateData.curator_title = curator_title;
    if (curator_desc !== undefined) updateData.curator_desc = curator_desc;

    // Promise Section
    if (promise_section !== undefined)
      updateData.promise_section = promise_section;
    if (promise_title !== undefined) updateData.promise_title = promise_title;
    if (promise_desc !== undefined) updateData.promise_desc = promise_desc;

    // Store Section
    if (store_title !== undefined) updateData.store_title = store_title;
    if (store_slug_name !== undefined)
      updateData.store_slug_name = store_slug_name;
    if (store_slug !== undefined) updateData.store_slug = store_slug;

    const fileFields = [
      "collection_logo",
      "hero_mobile_banner_image",
      "hero_desktop_banner_image",
      "hero_title_image",
      "ad_campaign_video",
      "legacy_img",
      "curator_img",
      "store_image",
    ];

    for (const field of fileFields) {
      if (req.files && req.files[field]) {
        // Optionally delete old file if exists
        if (homepage[field]) {
          await deleteFileByLocationFromS3(homepage[field]);
        }
        // Update with new file location (convert to a public URL)
        updateData[field] = req.files[field][0].location;
      }
    }

    // Update the homepage
    const updated = await CollectionHomepage.findOneAndUpdate(
      { homepage_collection_name: collection_name },
      updateData,
      { new: true, upsert: true }
    );

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating collection homepage:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/**
 * Add a jewel at glance item to the collection homepage
 */
const addJagItem = async (req, res) => {
  try {
    const { collection_name } = req.params;

    if (!validateCollectionName(collection_name)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid collection name. Only 'fazza' or 'festara' collections are supported.",
      });
    }

    let homepage = await CollectionHomepage.findOne({
      homepage_collection_name: collection_name,
    });

    if (!homepage) {
      homepage = new CollectionHomepage({
        homepage_collection_name: collection_name,
      });
      await homepage.save();
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Jewel at glance image is required" });
    }

    const hallmarkImage = req.file.location;

    homepage.jag_list.push({ hallmarkImage });
    await homepage.save();

    res.status(201).json({
      success: true,
      message: "Jewel at glance item added successfully",
      data: homepage.jag_list[homepage.jag_list.length - 1],
    });
  } catch (error) {
    console.error("Error adding jewel at glance item:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/**
 * Delete a jewel at glance item from the collection homepage
 */
const deleteJagItem = async (req, res) => {
  try {
    const { collection_name, id } = req.params;

    if (!validateCollectionName(collection_name)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid collection name. Only 'fazza' or 'festara' collections are supported.",
      });
    }

    const homepage = await CollectionHomepage.findOne({
      homepage_collection_name: collection_name,
    });

    if (!homepage) {
      return res
        .status(404)
        .json({ success: false, message: "Collection homepage not found" });
    }

    const jagItem = homepage.jag_list.id(id);
    if (!jagItem) {
      return res
        .status(404)
        .json({ success: false, message: "Jewel at glance item not found" });
    }

    // Optionally delete the image file from local storage
    if (jagItem.hallmarkImage) {
      await deleteFileByLocationFromS3(jagItem.hallmarkImage);
    }

    // Remove item from list
    homepage.jag_list = homepage.jag_list.filter((h) => h.id !== id);
    await homepage.save();

    res.status(200).json({
      success: true,
      message: "Jewel at glance item deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting jewel at glance item:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/**
 * Add a hallmark to the collection homepage
 */
const addHallmark = async (req, res) => {
  try {
    const { collection_name } = req.params;

    if (!validateCollectionName(collection_name)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid collection name. Only 'fazza' or 'festara' collections are supported.",
      });
    }

    let homepage = await CollectionHomepage.findOne({
      homepage_collection_name: collection_name,
    });

    if (!homepage) {
      homepage = new CollectionHomepage({
        homepage_collection_name: collection_name,
      });
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
 * Delete a hallmark from the collection homepage
 */
const deleteHallmark = async (req, res) => {
  try {
    const { collection_name, id } = req.params;

    if (!validateCollectionName(collection_name)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid collection name. Only 'fazza' or 'festara' collections are supported.",
      });
    }

    const homepage = await CollectionHomepage.findOne({
      homepage_collection_name: collection_name,
    });

    if (!homepage) {
      return res
        .status(404)
        .json({ success: false, message: "Collection homepage not found" });
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
 * Add a promise to the collection homepage
 */
const addPromise = async (req, res) => {
  try {
    const { collection_name } = req.params;
    const { description } = req.body;

    if (!validateCollectionName(collection_name)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid collection name. Only 'fazza' or 'festara' collections are supported.",
      });
    }

    let homepage = await CollectionHomepage.findOne({
      homepage_collection_name: collection_name,
    });

    if (!homepage) {
      homepage = new CollectionHomepage({
        homepage_collection_name: collection_name,
      });
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
 * Delete a promise from the collection homepage
 */
const deletePromise = async (req, res) => {
  try {
    const { collection_name, id } = req.params;

    if (!validateCollectionName(collection_name)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid collection name. Only 'fazza' or 'festara' collections are supported.",
      });
    }

    const homepage = await CollectionHomepage.findOne({
      homepage_collection_name: collection_name,
    });

    if (!homepage) {
      return res
        .status(404)
        .json({ success: false, message: "Collection homepage not found" });
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
  getCollectionHomepage,
  updateCollectionHomepage,
  addJagItem,
  deleteJagItem,
  addHallmark,
  deleteHallmark,
  addPromise,
  deletePromise,
};
