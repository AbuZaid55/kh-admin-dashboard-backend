const mongoose = require("mongoose")
const diamondSchema_eshop = new mongoose.Schema({
    grade: { type: String, required: true,trim:true },
    variant: { type: String, required: true,trim:true },
    priceRanges: [
      {
        minCts: { type: Number, required: true },
        maxCts: { type: Number, required: true }, 
        pricePerGram: { type: Number, required: true },
      },
    ],
  });
  
  const Diamond_eshop = mongoose.model("Diamond_eshop", diamondSchema_eshop);
  module.exports = Diamond_eshop;
  