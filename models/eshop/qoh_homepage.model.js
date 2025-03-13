const mongoose = require("mongoose");

const qoh_HomepageSchema = new mongoose.Schema(
  {
    // Hero Section
    homepage_name: { type: String, default: "Queen of Hearts", trim: true },
    scroll_text: { type: String, trim: true },
    brand_web_link: { type: String, trim: true },
    logo: { type: String, trim: true }, // File URL Validation
    logo_text: { type: String, trim: true },
    hero_video: { type: String, trim: true }, // File URL
    hero_short_desc: { type: String, trim: true },
    hero_desc: { type: String, trim: true },

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

    // Gulz Section
    gulz_section: { type: Boolean, default: false },
    gulz_section_title: { type: String, trim: true },
    gulz_section_short_desc: { type: String, trim: true },
    gulz_image: { type: String, trim: true },
    gulz_title: { type: String, trim: true },
    gulz_short_desc: { type: String, trim: true },
    gulz_slug_name: { type: String },
    gulz_slug: { type: String },

    // Faza Section
    faza_section: { type: Boolean, default: false },
    faza_section_title: { type: String, trim: true },
    faza_section_short_desc: { type: String, trim: true },
    faza_image: { type: String, trim: true },
    faza_title: { type: String, trim: true },
    faza_short_desc: { type: String, trim: true },
    faza_slug_name: { type: String },
    faza_slug: { type: String },

    // Festara Section
    festara_section: { type: Boolean, default: false },
    festara_section_title: { type: String, trim: true },
    festara_section_short_desc: { type: String, trim: true },
    festara_image: { type: String, trim: true },
    festara_title: { type: String, trim: true },
    festara_short_desc: { type: String, trim: true },
    festara_slug_name: { type: String },
    festara_slug: { type: String },

    // Legacy Section
    legacy_section: { type: Boolean, default: false },
    legacy_img: { type: String, trim: true }, // Image URL
    lagacy_title: { type: String, trim: true },
    legacy_desc: { type: String, trim: true },

    // Curators Tales Section
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

    //  Galaria Section
    galaria_section: { type: Boolean, default: false },
    galaria_section_title: { type: String, trim: true },
    galaria_section_short_location: {
      type: String,
      trim: true,
    },
    galaria_section_desc: { type: String, trim: true },
    galaria_image: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Homepage_qoh", qoh_HomepageSchema);
