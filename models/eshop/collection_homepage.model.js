const mongoose = require("mongoose");

const collection_HomepageSchema = new mongoose.Schema(
  {
    // Collection Homepage Name
    homepage_collection_name: { type: String, trim: true },

    // Hero Section
    scroll_text: { type: String, trim: true },
    brand_web_link: { type: String, trim: true },
    collection_logo: { type: String, trim: true }, // File URL Validation
    collection_logo_text: { type: String, trim: true },
    hero_mobile_banner_image: { type: String, trim: true }, // File URL
    hero_desktop_banner_image: { type: String, trim: true }, // File URL
    hero_title: { type: String, trim: true },
    hero_title_image: { type: String, trim: true }, // File URL
    hero_desc: { type: String, trim: true },

    // Jewels at Glance
    jag_section: { type: Boolean, default: false },
    jag_section_title: { type: String, trim: true },
    jag_section_short_desc: { type: String, trim: true },
    //separate add delete update api
    jag_list: [
      {
        hallmarkImage: { type: String, trim: true },
      },
    ],

    // ad campaign
    ad_campaign_section: { type: Boolean, default: false },
    ad_campaign_title: { type: String, trim: true },
    ad_campaign_video: { type: String, trim: true }, // File URL

    //  Queen of Hearts Section
    qoh_section: { type: Boolean, default: false },
    qoh_short_desc: { type: String, trim: true },
    qoh_long_desc: { type: String, trim: true },

    // hallmark Section
    hallmark_section: { type: Boolean, default: false }, // Image URL
    hallmark_sec_desc: { type: String, trim: true },
    hallmark_slug_name: { type: String },
    hallmark_slug: { type: String },
    //separate add delete update api
    hallmark_list: [
      {
        hallmarkImage: { type: String, trim: true },
      },
    ],

    // Legacy Section
    legacy_section: { type: Boolean, default: false },
    legacy_img: { type: String, trim: true }, // Image URL
    lagacy_title: { type: String, trim: true },
    legacy_desc: { type: String, trim: true },

    // Curator Tales Section
    curator_section: { type: Boolean, default: false },
    curator_img: { type: String, trim: true }, // Image URL
    curator_title: { type: String, trim: true },
    curator_desc: { type: String, trim: true },

    // Promise Section
    promise_section: { type: Boolean, default: false },
    promise_title: { type: String, trim: true },
    promise_desc: { type: String, trim: true },
    promises_list: [
      {
        image: { type: String, trim: true },
        description: { type: String, trim: true },
      },
    ],

    //  Store section
    store_image: { type: String, trim: true }, // File URL
    store_title: { type: String, trim: true },
    store_slug_name: { type: String },
    store_slug: { type: String },
  },

  { timestamps: true }
);

module.exports = mongoose.model(
  "Homepage_collection",
  collection_HomepageSchema
);
