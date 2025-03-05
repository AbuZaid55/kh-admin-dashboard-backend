const mongoose = require("mongoose");

const LandingPageSchema = new mongoose.Schema(
  {
    eshop_name:{type:String,default:"Gulz"},
    scroll_text: { type: String, },
    brand_web_link: { type: String, },
    logo: { type: String,}, // File URL (S3 or local path)
    logo_text: { type: String, },
    hero_desktop_img: { type: String, }, // File URL
    hero_mobile_img: { type: String, }, // File URL
    hero_short_desc: { type: String,},
    hero_desc: { type: String,  },
    hero_message: { type: String,  },
    ad_title: { type: String,  },
    ad_desc: { type: String,  },
    ad_video: { type: String,  }, // Video URL
    trending_img:{type:String,},
    trending_title:{type:String,},
    trending_desc:{type:String,},
    trending_slug_name:{type:String,},
    trending_slug:{type:String,},
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

module.exports = mongoose.model("LandingPage_eshop", LandingPageSchema);