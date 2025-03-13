const mongoose = require("mongoose");

const maw_HomepageSchema = new mongoose.Schema({
  scroll_text: { type: String, trim: true },
  brand_web_link: { type: String, trim: true },
  logo: { type: String, trim: true }, // File URL

  //   Hero Section
  hero_section: { type: Boolean, default: false },
  hero_image: { type: String, trim: true }, // File URL
  hero_title: { type: String, trim: true },
  hero_desc_1: { type: String, trim: true },
  hero_desc_2: { type: String, trim: true },
  hero_desc_3: { type: String, trim: true },
  hero_desc_4: { type: String, trim: true },

  //   From Sketch To Finish section
  sketch_section: { type: Boolean, default: false },
  sketch_title: { type: String, trim: true },
  sketch_desc: { type: String, trim: true },
  sketch_image: { type: String, trim: true }, // File URL
  sketch_video: { type: String, trim: true }, // File URL

  // Make a wish with Khwahish section
  maw_section: { type: Boolean, default: false },
  maw_title: { type: String, trim: true },
  maw_desc: { type: String, trim: true },
  maw_image: { type: String, trim: true }, // File URL
});

module.exports = mongoose.model("maw_Homepage", maw_HomepageSchema);
