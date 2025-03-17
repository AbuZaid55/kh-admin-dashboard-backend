const mongoose = require("mongoose");

const seoSchema = new mongoose.Schema({
    page_name: String,
    page: { 
      type: String, 
      required: true, 
      unique: true,
      trim: true
    },
    title: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String, 
      required: true 
    },
    robots: { 
      type: String, 
      default: 'index, follow' 
    },
    canonical: String,
    meta_property_og: [{
      property: String,
      content: String
    }],
    meta_name_twitter: [{
      name: String,
      content: String
    }],
    created_at: { 
      type: Date, 
      default: Date.now 
    },
    updated_at: { 
      type: Date, 
      default: Date.now 
    }
});
  
seoSchema.pre('save', function(next) {
    this.updated_at = Date.now();
    next();
});
  
module.exports = mongoose.model('SEO', seoSchema);
  